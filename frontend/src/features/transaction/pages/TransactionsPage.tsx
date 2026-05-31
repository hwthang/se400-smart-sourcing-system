import React, { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Copy,
  Layers,
  AlertCircle,
  Loader2,
  Eye,
  Hash,
  User,
  Cpu,
  CornerDownRight,
  Coins,
} from "lucide-react";
import { useParams, useSearchParams } from "react-router";
import { useBlockchainTransactions } from "../hooks/transaction-hook";
import { useProcurementContract } from "../../../core/blockchain/hooks/useProcurementContract";
import Modal from "../../../shared/ui/modal/Modal";

interface TransactionItem {
  id: string;
  method: string;
  txHash: string;
  createdAt: string;
  status: string;
}

// 🛠️ HELPER NORMALIZE: Chuyển đổi an toàn toàn bộ BigInt thành chuỗi (String) trước khi đưa vào State của React
const normalize = (obj: any): any => {
  if (typeof obj === "bigint") {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(normalize);
  }

  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, normalize(v)])
    );
  }

  return obj;
};

export const TransactionsPage = () => {
  const [searchParams] = useSearchParams();
  const contractAddress = searchParams.get("contractAddress");

  // 1. Khởi tạo danh sách Transactions từ database audit trail
  const { data: transactions = [], isLoading: isListLoading } =
    useBlockchainTransactions(contractAddress!);

  // 2. Khởi tạo instance contract từ ví/provider
  const contract = useProcurementContract(contractAddress!);

  // 3. Quản lý trạng thái tương tác Modal & Chi tiết giao dịch
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const truncateHash = (hash: string) => {
    if (!hash) return "N/A";
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const formatDateTime = (isoString: string) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleString();
  };

  const handleCopy = async (text: string, id: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // 4. Xử lý gọi trực tiếp On-chain Service khi bấm "View Detail"
  const handleViewDetail = async (txHash: string) => {
    if (!contract) {
      console.error("Smart Contract instance is not initialized.");
      return;
    }

    try {
      setIsDetailLoading(true);
      setOpen(true);

      // Gọi trực tiếp RPC Node thông qua Ethers Provider bên trong contract service
      const result = await contract.getTransactionDetail(txHash);
      console.log(result)
      // ✅ Thực hiện NORMALIZE ngay lập tức để làm sạch BigInt, bảo vệ UI không bao giờ bị crash
      setDetail(normalize(result));
    } catch (error) {
      console.error("Error fetching on-chain transaction details:", error);
      setDetail(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Helper render màu sắc trạng thái giao dịch chung
  const renderStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (
      s === "confirmed" ||
      s === "completed" ||
      s === "synced" ||
      s === "success"
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {status}
        </span>
      );
    }
    if (s === "pending" || s === "processing") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold">
        <AlertCircle className="w-3.5 h-3.5" />
        {status || "Failed"}
      </span>
    );
  };

  if (isListLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 space-y-3">
        <Loader2 className="w-8 h-8 text-blue-800 animate-spin" />
        <p className="text-sm font-medium text-gray-500 animate-pulse">
          Fetching ledger data from audit trail...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50/50 min-h-screen space-y-6">
      {/* HEADER SECTION */}
      <div className="text-left border-b border-gray-100 pb-5">
        <h1 className="text-2xl font-black tracking-tight text-gray-900">
          Blockchain Audit Trail
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Every action below was executed on-chain and can be independently verified.
        </p>
      </div>

      {/* METRICS DASHBOARD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-100 shadow-sm text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Total Records
          </div>
          <div className="text-2xl font-black text-gray-900 font-mono mt-1">
            {transactions.length}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-100 shadow-sm text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Target Contract
          </div>
          <div className="font-mono text-sm font-bold text-blue-900 bg-blue-50/50 px-2 py-0.5 rounded-md inline-block max-w-full truncate mt-1">
            {truncateHash(contractAddress ?? "")}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-100 shadow-sm text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Ledger Sync
          </div>
          <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 pt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Active & Synced</span>
          </div>
        </div>
      </div>

      {/* DATA TABLE WRAPPER */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-xs font-bold uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4 text-left font-semibold">
                  Smart Contract Method
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  Transaction Hash
                </th>
                <th className="px-6 py-4 text-left font-semibold">Timestamp</th>
                <th className="px-6 py-4 text-center font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-gray-400 italic"
                  >
                    No verified on-chain operations discovered for this node.
                  </td>
                </tr>
              ) : (
                transactions.map((tx: TransactionItem) => (
                  <tr
                    key={tx.id}
                    className="transition-colors hover:bg-slate-50/40 group"
                  >
                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-slate-100 text-slate-600 rounded-md group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-mono text-xs font-bold text-gray-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                          {tx?.method || "unknown()"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded">
                          {truncateHash(tx.txHash)}
                        </span>
                        <button
                          onClick={() => handleCopy(tx.txHash, tx.id)}
                          type="button"
                          className="p-1 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded transition-all"
                        >
                          {copiedId === tx.id ? (
                            <span className="text-xs text-emerald-600 font-bold px-0.5">
                              ✓
                            </span>
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{formatDateTime(tx.createdAt)}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {renderStatusBadge(tx.status)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleViewDetail(tx.txHash)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 text-blue-800 text-xs font-bold hover:bg-blue-100 active:scale-[0.98] transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ON-CHAIN AUDIT MODAL (Dữ liệu đã được Normalize an toàn) */}
      {/* ========================================================= */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setDetail(null);
        }}
        title="EVM Cryptographic Node Specifications"
      >
        {isDetailLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="w-7 h-7 text-blue-800 animate-spin" />
            <p className="text-xs text-gray-500 font-medium animate-pulse">
              Querying EVM State & Decoding Event Logs...
            </p>
          </div>
        ) : detail ? (
          <div className="space-y-5 text-sm text-left text-gray-700 max-h-[75vh] overflow-y-auto pr-1">
            {/* 1. TRANSACTION BASICS BLOCK */}
            <div className="bg-slate-50/60 rounded-lg p-3.5 border border-slate-100 space-y-2.5">
              <div className="flex items-center gap-2 border-b border-slate-200/60 pb-1.5">
                <Hash className="w-4 h-4 text-blue-800" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Transaction Core
                </h4>
              </div>

              <div className="grid grid-cols-3 gap-2 py-0.5">
                <span className="text-gray-400 text-xs font-medium">Tx Hash:</span>
                <span className="col-span-2 font-mono text-xs text-gray-800 break-all select-all bg-white px-2 py-1 rounded border border-slate-100">
                  {detail.transaction?.hash || "N/A"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-0.5 items-center">
                <span className="text-gray-400 text-xs font-medium">From (Sender):</span>
                <span className="col-span-2 font-mono text-xs text-gray-600 break-all bg-white px-2 py-1 rounded border border-slate-100">
                  {detail.transaction?.from || "N/A"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-0.5 items-center">
                <span className="text-gray-400 text-xs font-medium">To (Target Contract):</span>
                <span className="col-span-2 font-mono text-xs text-gray-600 break-all bg-white px-2 py-1 rounded border border-slate-100">
                  {detail.transaction?.to || "N/A"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-0.5 items-center">
                <span className="text-gray-400 text-xs font-medium">Value Transferred:</span>
                <span className="col-span-2 font-mono font-bold text-slate-800 flex items-center gap-1 text-xs">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  {detail.transaction?.value || "0"} ETH
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-0.5">
                <span className="text-gray-400 text-xs font-medium">Nonce / Gas Limit:</span>
                <span className="col-span-2 font-mono text-xs text-slate-700">
                  {detail.transaction?.nonce} <span className="text-gray-300 mx-1">|</span> Limit: {detail.transaction?.gasLimit}
                </span>
              </div>
            </div>

            {/* 2. TRANSACTION RECEIPT BLOCK */}
            {detail.receipt ? (
              <div className="bg-white rounded-lg p-3.5 border border-slate-200/80 space-y-2.5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
                  <Cpu className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Execution Receipt
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Receipt Status</p>
                    <div className="mt-1">{renderStatusBadge(detail.receipt.status)}</div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Block Height</p>
                    <p className="font-mono text-xs font-bold text-slate-800 mt-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 w-fit">
                      #{detail.receipt.blockNumber}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Gas Used by Tx</p>
                    <p className="font-mono text-xs text-slate-700 mt-0.5">
                      {detail.receipt.gasUsed ? Number(detail.receipt.gasUsed).toLocaleString() : 0} units
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Cumulative Gas Used</p>
                    <p className="font-mono text-xs text-slate-700 mt-0.5">
                      {detail.receipt.cumulativeGasUsed ? Number(detail.receipt.cumulativeGasUsed).toLocaleString() : 0} units
                    </p>
                  </div>
                </div>

                {detail.receipt.contractAddress && (
                  <div className="pt-1.5 border-t border-slate-50">
                    <p className="text-xs text-gray-400 font-medium">Deployed Contract Target</p>
                    <p className="font-mono text-xs text-blue-700 bg-blue-50/40 px-2 py-1 rounded border break-all mt-1">
                      {detail.receipt.contractAddress}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-gray-400 bg-amber-50/50 p-3 rounded-lg border border-dashed border-amber-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Receipt is null. Transaction may be in Pending or Unconfirmed state.</span>
              </div>
            )}

            {/* 3. DECODED INPUT / FUNCTION CALL METHOD */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                Decoded ABI Input Payload
              </span>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="font-mono text-xs font-bold text-blue-300">
                      {detail.decodedInput?.method || "unknownMethod()"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                    RPC Decoded
                  </span>
                </div>

                {detail.decodedInput?.args && Object.keys(detail.decodedInput.args).length > 0 ? (
                  <pre className="p-3.5 bg-slate-900 text-slate-200 text-xs font-mono overflow-auto max-h-[160px] shadow-inner leading-relaxed text-left">
                    {/* ✅ An tâm dùng JSON.stringify gốc vì dữ liệu trong State đã được "Clean" sạch BigInt */}
                    {JSON.stringify(detail.decodedInput.args, null, 2)}
                  </pre>
                ) : (
                  <div className="text-xs text-gray-400 italic p-4 bg-slate-900 text-center border-t border-slate-800">
                    No explicit parameters or variables extracted inside the execution inputs.
                  </div>
                )}
              </div>
            </div>

            {/* 4. EMITTED CONTRACT LOG EVENTS */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                Emitted Log Events ({detail.events?.length || 0})
              </span>

              {detail.events && detail.events.length > 0 ? (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-0.5">
                  {detail.events.map((event: any, idx: number) => (
                    <div
                      key={idx}
                      className="border border-slate-200/80 rounded-lg bg-white p-2.5 shadow-xs text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-slate-50 pb-1.5 mb-1.5">
                        <div className="flex items-center gap-1 font-semibold text-slate-800">
                          <CornerDownRight className="w-3.5 h-3.5 text-blue-600" />
                          <span>Event:</span>
                          <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {event.name || event.fragment?.name || `LogTopic[${idx}]`}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-400">Idx: #{idx}</span>
                      </div>

                      {/* ✅ Tuyệt đối an toàn, hiển thị cấu trúc mảng Result mượt mà không lo BigInt lỗi */}
                      <pre className="p-2 bg-slate-50 rounded border border-slate-100 text-gray-600 overflow-x-auto text-[11px] font-mono">
                        {JSON.stringify(event.args || event, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-400 italic p-3 bg-gray-50 rounded-md border border-dashed text-center">
                  No execution event logs triggered or emitted by the EVM state change.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-sm text-rose-600 flex flex-col items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            <span>Unable to recover node transaction artifacts from the current RPC Endpoint.</span>
          </div>
        )}
      </Modal>
    </div>
  );
};