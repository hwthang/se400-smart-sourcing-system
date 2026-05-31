// components/Feature/Contract/DepositButton.tsx

import React, { useMemo, useState } from "react";
import { Coins, Loader2, ArrowRight, ChevronLeft } from "lucide-react";

import Modal from "../../../../shared/ui/modal/Modal";
import { useDeposit as useDepositBackend } from "../../hooks/use-contract";
import { useProcurement } from "../../../../core/blockchain/hooks/useProcurement";
import { parseEther } from "ethers";

interface DepositButtonProps {
  contract: {
    id: string;
    address: string;
    status: string;
    requiredDepositedAmount: string | number; // Giá trị truyền vào trực tiếp là đơn vị ETH
  };
}

export const DepositButton = ({ contract }: DepositButtonProps) => {
  // =========================================================
  // HOOKS & MUTATIONS
  // =========================================================
  const procurement = useProcurement(contract?.address);
  const depositBackend = useDepositBackend();

  const [inputOpen, setInputOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Lấy trực tiếp chuỗi hiển thị định dạng ETH
  const amountEth = contract?.requiredDepositedAmount?.toString() || "0";

  // Chỉ chuyển đổi sang WEI (BigInt) khi cần tương tác gửi nhận với ví Web3 / Smart Contract
  const amountWei = useMemo(() => {
    try {
      return parseEther(amountEth);
    } catch (e) {
      return 0n;
    }
  }, [amountEth]);

  const isProcessing =
    procurement.deposit.isPending || depositBackend.isPending;

  // =========================================================
  // FLOW CONTROL
  // =========================================================
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountWei <= 0n) return;

    setInputOpen(false);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    try {
      // 1. Gửi giá trị BigInt (WEI) lên cấu trúc dữ liệu mạng Blockchain
      const txHash = await procurement.deposit.mutateAsync(amountWei);

      // 2. Đồng bộ về Backend tập trung (Lưu trữ theo định dạng số nguyên WEI)
      await depositBackend.mutateAsync({
        id: contract.id,
        data: {
          amount: Number(amountWei),
          note: "",
          txHash,
          contractAddress: contract.address,
        },
      });

      setConfirmOpen(false);
    } catch (error) {
      console.error("Funding Flow Failed:", error);
    }
  };

  return (
    <>
      {/* TRIGGER BUTTON */}
      {contract?.status === "FUNDING" && (
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => setInputOpen(true)}
          className="w-full md:w-auto flex-grow bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white font-medium px-4 py-2.5 rounded-md text-sm shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:pointer-events-none"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" strokeWidth={2} />
          ) : (
            <Coins className="w-4 h-4 text-white" strokeWidth={2} />
          )}
          <span>Deposit Funds</span>
        </button>
      )}

      {/* BƯỚC 1 MODAL: HIỂN THỊ ETH TRỰC TIẾP */}
      <Modal
        open={inputOpen}
        onClose={() => !isProcessing && setInputOpen(false)}
        title="Initialize Escrow Funding"
      >
        <form onSubmit={handleContinue} className="space-y-5 text-left pt-2">
          
          {/* Chỉ hiển thị duy nhất trường ETH sạch */}
          <div className="text-left space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              Required Deposit Amount
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={amountEth}
                className="w-full bg-blue-50/40 text-blue-900 font-mono font-bold rounded-md pl-4 pr-14 py-2.5 text-sm shadow-sm focus:outline-none cursor-not-allowed select-all"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-mono font-bold text-blue-800 pointer-events-none">
                ETH
              </span>
            </div>
          </div>

          {/* ACTIONS FOOTER STEP 1 */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setInputOpen(false)}
              className="flex items-center justify-center bg-white text-blue-800 font-medium px-4 py-2 rounded-md transition-all duration-200 hover:bg-blue-50 active:scale-[0.98] text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white font-medium px-5 py-2 rounded-md shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98] text-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 text-white" strokeWidth={2} />
            </button>
          </div>
        </form>
      </Modal>

      {/* BƯỚC 2 MODAL: XÁC NHẬN CHỮ KÝ VÍ */}
      <Modal
        open={confirmOpen}
        onClose={() => !isProcessing && setConfirmOpen(false)}
        title="Review Escrow Settlement"
      >
        <div className="space-y-5 text-left pt-2">
          
          {/* KHỐI HIỂN THỊ TRỰC QUAN ĐƠN VỊ ETH */}
          <div className="bg-gradient-to-br from-white to-blue-50/30 p-6 rounded-md text-center space-y-1">
            <span className="text-gray-400 font-bold text-xs uppercase tracking-wider">
              Total Blockchain Escrow Funding
            </span>
            <p className="text-gray-900 font-bold text-2xl font-mono tracking-tight break-all">
              {amountEth} <span className="text-sm font-bold text-gray-400">ETH</span>
            </p>
          </div>

          {/* ACTIONS FOOTER STEP 2 */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => {
                setConfirmOpen(false);
                setInputOpen(true);
              }}
              className="flex items-center justify-center gap-1 bg-white text-blue-800 font-medium px-4 py-2 rounded-md transition-all duration-200 hover:bg-blue-50 active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none text-sm"
            >
              <ChevronLeft className="w-4 h-4 text-current" strokeWidth={2} />
              <span>Back</span>
            </button>
            
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirm}
              className="flex items-center justify-center gap-2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white font-medium px-5 py-2 rounded-md shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98] text-sm disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:pointer-events-none"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" strokeWidth={2} />
                  <span>Broadcasting Tx...</span>
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4 text-white" strokeWidth={2} />
                  <span>Sign & Deposit</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};