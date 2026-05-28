// components/Feature/Contract/DepositButton.tsx

import React, { useState } from "react";
import { Coins, Loader2, ArrowRight, ChevronLeft } from "lucide-react";

import Modal from "../../../../shared/ui/modal/Modal";
import { useDeposit as useDepositBackend } from "../../hooks/use-contract";
import { useProcurement } from "../../../../core/blockchain/hooks/useProcurement";

interface DepositButtonProps {
  contract: {
    id: string;
    address: string;
    status: string;
    requiredDepositedAmount: string; // Số tiền từ backend giả định đã là chuỗi định dạng WEI
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

  // Số tiền cố định lấy từ contract, không cho phép chỉnh sửa
  const fixedAmountWei = contract?.requiredDepositedAmount || "0";
  const isProcessing = procurement.deposit.isPending || depositBackend.isPending;

  // =========================================================
  // FLOW CONTROL
  // =========================================================
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fixedAmountWei || Number(fixedAmountWei) <= 0) return;

    setInputOpen(false);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    try {
      // 1. Gửi trực tiếp số WEI lên Smart Contract
      const txHash = await procurement.deposit.mutateAsync(
        BigInt(fixedAmountWei),
      );

      // 2. Đồng bộ về Backend tập trung (Note gửi chuỗi rỗng)
      await depositBackend.mutateAsync({
        id: contract.id,
        data: {
          amount: Number(fixedAmountWei),
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
      {/* BUTTON TRIGGER */}
      {contract?.status === "FUNDING" && (
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => setInputOpen(true)}
          className="
            w-full md:w-auto flex-grow
            bg-white hover:bg-emerald-50/50
            text-emerald-700 border border-emerald-200/80
            rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider
            shadow-2xs transition-all duration-200
            flex items-center justify-center gap-2
            disabled:opacity-40 disabled:cursor-not-allowed
            active:scale-[0.98]
          "
        >
          {isProcessing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" strokeWidth={2.5} />
          ) : (
            <Coins className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
          )}
          <span>Deposit Funds</span>
        </button>
      )}

      {/* STEP 1 MODAL: READ-ONLY WEI DISPLAY */}
      <Modal
        open={inputOpen}
        onClose={() => !isProcessing && setInputOpen(false)}
        title="Initialize Escrow Funding"
      >
        <form onSubmit={handleContinue} className="space-y-4 text-left pt-2">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-slate-400" />
              Required Deposit Amount (WEI)
            </label>
            
            {/* Input khóa cứng (readOnly), dùng style disabled nhẹ để báo hiệu không sửa được */}
            <input
              type="text"
              readOnly
              value={fixedAmountWei}
              className="w-full bg-slate-50 text-slate-500 font-mono rounded-lg border border-slate-200 px-3 py-2.5 text-sm shadow-2xs focus:outline-none cursor-not-allowed select-all"
            />
          </div>

          {/* ACTIONS FOOTER STEP 1 */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setInputOpen(false)}
              className="w-full sm:w-auto bg-white text-slate-600 border border-slate-200 font-bold px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all duration-200 hover:bg-slate-50 active:scale-[0.98] shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-850 text-white font-bold px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all duration-200 hover:brightness-110 active:scale-[0.98] shadow-md"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
          </div>
        </form>
      </Modal>

      {/* STEP 2 MODAL: QUICK CONFIRM & SIGN */}
      <Modal
        open={confirmOpen}
        onClose={() => !isProcessing && setConfirmOpen(false)}
        title="Review Escrow Settlement"
      >
        <div className="space-y-4 text-left pt-2">
          {/* FIELD PREVIEWS */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium">
            <div className="flex flex-col gap-1 text-center py-2">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Total Blockchain Settlement</span>
              <p className="text-emerald-700 font-black text-xl font-mono tracking-tight break-all">
                {fixedAmountWei} <span className="text-xs font-bold text-slate-400">WEI</span>
              </p>
            </div>
          </div>

          {/* ACTIONS FOOTER STEP 2 */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => {
                setConfirmOpen(false);
                setInputOpen(true);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white text-slate-600 border border-slate-200 font-bold px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all duration-200 hover:bg-slate-50 active:scale-[0.98] disabled:opacity-40 shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirm}
              className="
                w-full sm:w-auto flex items-center justify-center gap-2 
                bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 
                text-white font-bold px-5 py-2.5 rounded-lg shadow-md 
                transition-all duration-200 hover:brightness-110 hover:shadow-lg 
                active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40
                text-xs uppercase tracking-wider
              "
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-white animate-spin" strokeWidth={2.5} />
                  <span>Broadcasting Tx...</span>
                </>
              ) : (
                <>
                  <Coins className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
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