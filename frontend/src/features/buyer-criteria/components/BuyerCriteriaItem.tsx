import React from "react";
import { ClipboardCheck, Percent, Package, Layers } from "lucide-react";
import CreateBuyerCriteriaButton from "./CreateBuyerCriteriaButton";
import UpdateBuyerCriteriaButton from "./UpdateBuyerCriteriaButton";
import ConfirmBuyerCriteriaButton from "./ConfirmBuyerCriteriaButton";

type Props = {
  registration: any;
  contract: any;
};

const BuyerCriteriaItem = ({ registration, contract }: Props) => {
  const criteria = registration?.criteria;

  // =========================================================
  // CONDITIONAL RENDER: EMPTY STATE
  // =========================================================
  if (!criteria) {
    return (
      <div className="rounded-md bg-white p-4 md:p-6 shadow-sm space-y-6 text-left">
        {/* HEADER */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-blue-800" strokeWidth={2} />
            <h3 className="text-base font-bold text-gray-900">
              Buyer Criteria
            </h3>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            No allocation criteria has been created for this supplier
            registration record.
          </p>
        </div>

        {/* EMPTY VISUAL */}
        <div className="rounded-md bg-blue-50/50 border border-blue-100/60 p-6 text-center space-y-2">
          <p className="text-sm font-bold text-blue-900">
            Buyer Criteria Not Initialized
          </p>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            Configure procurement allocation constraints, basis point percentage
            thresholds, and smart sourcing filters for this supplier.
          </p>
        </div>

        {/* ACTION */}
        <div className="flex justify-end border-t border-gray-50 pt-4">
          <CreateBuyerCriteriaButton registration={registration} />
        </div>
      </div>
    );
  }

  // =========================================================
  // KINH NGHIỆM ĐỒNG BỘ: CHUYỂN ĐỔI CHUẨN CƠ SỐ 10000 -> % VISUAL
  // =========================================================
  const rawAllocation = Number(criteria?.maxAllocationPercent || 0);
  const allocationPercent = (rawAllocation / 100).toFixed(2);

  // Kiểm tra xem trạng thái criteria đã được xác thực on-chain hay chưa
  const isConfirmed =
    criteria?.status === "CONFIRMED" || criteria?.status === "ACTIVE";

  // =========================================================
  // CONDITIONAL RENDER: FILLED STATE
  // =========================================================
  return (
    <div className="rounded-md bg-white p-4 md:p-6 shadow-sm space-y-6 text-left">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-50 pb-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-blue-800" strokeWidth={2} />
            <h3 className="text-base font-bold text-gray-900">
              Buyer Criteria Configuration
            </h3>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Procurement allocation constraints and mathematical purchasing
            strategies defined for automation.
          </p>
        </div>

        {/* STATUS BADGE */}
        <div
          className={`self-start sm:self-center rounded px-2.5 py-1 text-xs font-bold tracking-wide uppercase font-mono border ${
            isConfirmed
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-amber-50 text-amber-800 border-amber-200"
          }`}
        >
          {criteria?.status || "PENDING"}
        </div>
      </div>

      {/* METRICS DATA GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* MIN PURCHASE QUANTITY CARD */}
        <div className="rounded-md border border-slate-100 bg-gradient-to-br from-white to-slate-50/50 p-4 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-800" strokeWidth={2} />
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Min Purchase Quantity
            </p>
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {Number(criteria?.minPurchaseQuantity || 0).toLocaleString()}{" "}
            <span className="text-xs font-medium text-gray-400">units</span>
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Minimum required payload volume for execution optimization.
          </p>
        </div>

        {/* MAX ALLOCATION PERCENT CARD */}
        <div className="rounded-md border border-slate-100 bg-gradient-to-br from-white to-slate-50/50 p-4 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-blue-800" strokeWidth={2} />
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Max Allocation Percent
            </p>
          </div>
          <p className="text-2xl font-black bg-gradient-to-r from-blue-900 to-indigo-700 bg-clip-text text-transparent tracking-tight">
            {allocationPercent}%
          </p>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Layers className="w-3.5 h-3.5 text-slate-300" />
            <span>On-Chain Value: {rawAllocation} / 10000</span>
          </div>
        </div>
      </div>

      {/* ACTION CONTROLS BLOCK */}
      <div className="border-t border-gray-100 pt-5 flex flex-wrap justify-end items-center gap-2">
        {/* CHỈ CHO PHÉP CHỈNH SỬA NẾU CHƯA CONFIRM KHÓA DỮ LIỆU */}
        {!isConfirmed && (
          <>
            <UpdateBuyerCriteriaButton
              criteriaId={criteria?.id}
              contractId={registration?.contractId}
              defaultValues={{
                minPurchaseQuantity: criteria?.minPurchaseQuantity,
                maxAllocationPercent: criteria?.maxAllocationPercent,
              }}
            />

            <ConfirmBuyerCriteriaButton
              registration={registration}
              contract={contract}
            />
          </>
        )}

        {isConfirmed && (
          <p className="text-xs font-medium text-emerald-700 bg-emerald-50/50 border border-emerald-100 px-3 py-1.5 rounded-md">
            ✓ Records sealed on decentralized storage ledger. Parameters
            immutable.
          </p>
        )}
      </div>
    </div>
  );
};

export default BuyerCriteriaItem;
