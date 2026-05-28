import React, { useState } from "react";
import {
  CheckCircle2,
  CalendarDays,
  Package,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useConfirmDemand } from "../hooks/use-demand";
import { useProcurement } from "../../../core/blockchain/hooks/useProcurement";
import Modal from "../../../shared/ui/modal/Modal";

type Props = {
  demand: any;
};

const ConfirmDemandButton = ({ demand }: Props) => {
  const [open, setOpen] = useState(false);
  console.log(demand);

  // Trạng thái loading cục bộ để kiểm soát luồng bất đồng bộ phức tạp
  const [txStep, setTxStep] = useState<"idle" | "blockchain" | "backend">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // =========================================================
  // API & BLOCKCHAIN HOOKS
  // =========================================================
  const confirmDemandApi = useConfirmDemand();
  const {confirmDemand}= useProcurement(demand?.contract?.address);

  // =========================================================
  // HELPERS (An toàn trước các chu kỳ Re-render)
  // =========================================================
  const rawQuantity = demand?.requestedQuantity || 0;
  const deliveryDateString = demand?.requestedDeliveryDate;

  // Tính toán hiển thị an toàn bằng UTC/Local timestamp phòng hờ lỗi ngày tháng
  const displayTimestamp = Math.floor(
    new Date(deliveryDateString || Date.now()).getTime() / 1000,
  );

  // =========================================================
  // HANDLER
  // =========================================================
  const handleConfirm = async () => {
    if (!demand?.contract?.address) {
      setErrorMessage("Missing contract deployment address.");
      return;
    }

    try {
      setErrorMessage(null);

      // Chuyển kiểu dữ liệu BigInt ngay trong scope xử lý để đảm bảo tính đóng gói
      const quantityArg = BigInt(rawQuantity);
      const timestampArg = BigInt(
        Math.floor(new Date(deliveryDateString).getTime() / 1000),
      );

      // -----------------------------------------------------
      // BƯỚC 1: KHỞI TẠO BLOCKCHAIN TRANSACTION
      // -----------------------------------------------------
      setTxStep("blockchain");
      const txHash = await confirmDemand.mutateAsync({
        quantity: quantityArg,
        timestamp: timestampArg,
      });

      if (!txHash) {
        throw new Error(
          "Transaction signature was rejected or failed to broadcast.",
        );
      }

      // -----------------------------------------------------
      // BƯỚC 2: ĐỒNG BỘ HÓA DỮ LIỆU BACKEND
      // -----------------------------------------------------
      setTxStep("backend");
      await confirmDemandApi.mutateAsync({
        id: demand.id,
        data: {
          txHash,
          contractAddress: demand?.contract?.address,
        },
      });

      // Hoàn tất chu trình thành công
      setTxStep("idle");
      setOpen(false);
    } catch (error: any) {
      console.error("Demand Confirmation Failure:", error);
      setTxStep("idle");

      // Trích xuất thông báo lỗi thân thiện với người dùng (Xử lý lỗi từ chối ký từ Metamask)
      if (error?.code === 4001 || error?.message?.includes("rejected")) {
        setErrorMessage("Transaction signature denied by user on wallet.");
      } else {
        setErrorMessage(
          error?.message || "An unexpected system error occurred.",
        );
      }
    }
  };

  const handleCloseModal = () => {
    if (txStep !== "idle") return; // Ngăn chặn tắt modal khi đang gửi giao dịch lên chuỗi
    setOpen(false);
    setErrorMessage(null);
  };

  const isPending = txStep !== "idle";

  return (
    <>
      {/* NÚT KÍCH HOẠT */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          flex items-center gap-2 rounded-md shadow-sm text-sm font-medium text-white
          bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 px-4 py-2
          transition-all duration-200 hover:brightness-110 hover:shadow-md active:scale-[0.98]
        "
      >
        <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
        Confirm Demand
      </button>

      {/* MODAL XÁC NHẬN */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        title="Confirm Procurement Demand"
      >
        <div className="space-y-5">
          {/* KHỐI THÔNG TIN CHI TIẾT */}
          <div className="rounded-md border border-slate-100 bg-slate-50 p-4 space-y-3.5 text-left">
            <div className="flex items-center justify-between gap-4 border-b border-dashed border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-800" strokeWidth={2} />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Quantity
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {Number(rawQuantity).toLocaleString()} units
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays
                  className="w-4 h-4 text-blue-800"
                  strokeWidth={2}
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Delivery Date
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">
                  {deliveryDateString
                    ? new Date(deliveryDateString).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="text-[10px] font-mono text-slate-400">
                  Epoch: {displayTimestamp}
                </p>
              </div>
            </div>
          </div>

          {/* KHỐI HIỂN THỊ TRẠNG THÁI TIẾN TRÌNH LOGISTIC BẤT ĐỒNG BỘ */}
          {isPending && (
            <div className="rounded-md bg-blue-50/50 border border-blue-100 p-3.5 text-left flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-blue-700 animate-spin shrink-0" />
              <p className="text-xs text-blue-800 font-medium leading-relaxed">
                {txStep === "blockchain" &&
                  "Step 1/2: Initiating Web3 Smart Contract transaction... Please approve via MetaMask."}
                {txStep === "backend" &&
                  "Step 2/2: Transaction confirmed on-chain. Synchronizing Ledger state with decentralized backend..."}
              </p>
            </div>
          )}

          {/* HIỂN THỊ LỖI NẾU CÓ */}
          {errorMessage && (
            <div className="rounded-md bg-red-50 border border-red-100 p-3.5 text-left flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-red-800">
                  Action Interrupted
                </p>
                <p className="text-xs text-red-700/90 leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {!isPending && !errorMessage && (
            <div className="rounded-md border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-900 text-left leading-relaxed">
              This digital operation will write immutable records onto the
              blockchain contract. Gas fee optimization rules apply.
            </div>
          )}

          {/* HÀNG NÚT ĐIỀU KHIỂN */}
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              disabled={isPending}
              onClick={handleCloseModal}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isPending}
              className="
                flex items-center gap-2 rounded-md bg-gradient-to-br from-blue-900 to-indigo-900
                px-4 py-2 text-sm font-medium text-white shadow-sm transition-all
                disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed
              "
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {txStep === "idle" && "Confirm Demand"}
              {txStep === "blockchain" && "Awaiting Wallet..."}
              {txStep === "backend" && "Syncing Records..."}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmDemandButton;
