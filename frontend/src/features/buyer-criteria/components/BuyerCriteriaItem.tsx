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

  // Trạng thái criteria đã được xác thực on-chain hay chưa
  const isConfirmed =
    criteria?.status === "CONFIRMED" || criteria?.status === "ACTIVE";

  // =========================================================
  // 1. TRẠNG THÁI TRỐNG (EMPTY STATE)
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
            No allocation criteria has been created for this supplier registration record.
          </p>
        </div>

        {/* EMPTY VISUAL - Cấu trúc phẳng hoàn toàn không dùng Border */}
        <div className="rounded-md bg-blue-50/40 p-6 text-center space-y-2">
          <p className="text-sm font-bold text-blue-800">
            Buyer Criteria Not Initialized
          </p>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            Configure procurement allocation constraints, percentage thresholds, and smart sourcing filters for this supplier.
          </p>
        </div>

        {/* ACTION */}
        <div className="flex justify-end pt-2">
          <CreateBuyerCriteriaButton registration={registration} />
        </div>
      </div>
    );
  }

  // Lấy trực tiếp giá trị số thập phân từ form (không chia 100 theo yêu cầu nút Input mới)
  const allocationPercent = Number(criteria?.maxAllocationPercent || 0).toFixed(2);

  // =========================================================
  // 2. TRẠNG THÁI ĐÃ CÓ DỮ LIỆU (FILLED STATE)
  // =========================================================
  return (
    <div className="rounded-md bg-white p-4 md:p-6 shadow-sm space-y-6 text-left">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-blue-800" strokeWidth={2} />
            <h3 className="text-base font-bold text-gray-900">
              Buyer Criteria Configuration
            </h3>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Procurement allocation constraints and mathematical purchasing strategies defined for automation.
          </p>
        </div>

        {/* STATUS BADGE - Loại bỏ màu ngoại lai, đồng bộ token Blue-800/Blue-50 */}
        <div
          className={`self-start sm:self-center rounded-md px-2.5 py-1 text-xs font-bold tracking-wide uppercase font-mono ${
            isConfirmed
              ? "bg-blue-800 text-white shadow-sm"
              : "bg-blue-50 text-blue-800"
          }`}
        >
          {criteria?.status || "PENDING"}
        </div>
      </div>

      {/* METRICS DATA GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* MIN PURCHASE QUANTITY CARD */}
        <div className="rounded-md bg-gradient-to-br from-white to-blue-50/40 p-4 shadow-sm transition-all duration-200 hover:shadow-md space-y-2">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-800" strokeWidth={2} />
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Min Purchase Quantity
            </p>
          </div>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">
            {Number(criteria?.minPurchaseQuantity || 0).toLocaleString()}{" "}
            <span className="text-xs font-medium text-gray-500">units</span>
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Minimum required payload volume for execution optimization.
          </p>
        </div>

        {/* MAX ALLOCATION PERCENT CARD */}
        <div className="rounded-md bg-gradient-to-br from-white to-blue-50/40 p-4 shadow-sm transition-all duration-200 hover:shadow-md space-y-2">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-blue-800" strokeWidth={2} />
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Max Allocation Percent
            </p>
          </div>
          {/* Text Gradient độc quyền cho Metric lớn */}
          <p className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent tracking-tight">
            {allocationPercent}%
          </p>
          <div className="flex items-center gap-1 text-xs font-mono text-gray-500">
            <Layers className="w-3.5 h-3.5 text-gray-500" />
            <span>Direct Parameter Configured</span>
          </div>
        </div>
      </div>

      {/* ACTION CONTROLS BLOCK */}
      <div className="pt-2 flex flex-wrap justify-end items-center gap-2">
        {!isConfirmed ? (
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
        ) : (
          /* Khối thông báo thành công dạng phẳng (Subtle Alert Banner) */
          <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md w-full sm:w-auto">
            <span className="text-xs font-medium text-blue-800">
              ✓ Records sealed on decentralized storage ledger. Parameters immutable.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerCriteriaItem;