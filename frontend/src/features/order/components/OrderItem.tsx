// components/Order/OrderItem.tsx

import React, { useMemo } from "react";
import {
  FileText,
  Boxes,
  Calendar,
  DollarSign,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

type Props = {
  registration: any;
  contract: any; // Nhận vào để phục vụ cho các button hành động bên trong
  children?: React.ReactNode; // Chừa sẵn slot (Compound component / Children pattern) để map các Button hành động từ ngoài vào
};

const OrderItem: React.FC<Props> = ({ registration, contract, children }) => {
  const order = registration?.order;
  // Format hiển thị phần trăm điểm phân bổ (Allocation Score)
  const formattedScore = useMemo(() => {
    return ((order?.allocationScore || 0) * 100).toFixed(2);
  }, [order?.allocationScore]);

  // Format ngày tháng hiển thị tinh gọn
  const formattedDeliveryDate = useMemo(() => {
    if (!order?.deliveryDate) return "N/A";
    const date = new Date(order.deliveryDate);
    return isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  }, [order?.deliveryDate]);

  return (
    <div
      className="
        group relative rounded-xl border border-slate-100 bg-white p-5 shadow-sm 
        transition-all duration-200 hover:border-blue-100 hover:shadow-md
        flex flex-col  lg:justify-between gap-6 text-left
      "
    >
      {/* LEFT: MAIN ORDER DETAILS INFO */}
      <div className="space-y-3.5 flex-1 font-sans">
        {/* HEADER: ORDER ID & STATUS BADGE */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-slate-800">
            <FileText className="w-4 h-4 text-blue-800" strokeWidth={2} />
            <span className="text-xs font-mono font-bold tracking-wide text-gray-400">
              ORDER_ID:
            </span>
            <span className="text-sm font-mono font-black text-slate-700">
              {order?.id}
            </span>
          </div>

          <span
            className={`
              rounded-md px-2.5 py-0.5 text-xs font-bold font-mono tracking-wider border uppercase
              ${
                order?.status === "CONFIRMED"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-blue-50 border-blue-200 text-blue-800"
              }
            `}
          >
            {order?.status || "PENDING"}
          </span>
        </div>

        {/* DETAILS DATA GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
          {/* ASSIGNED QUANTITY */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-400">
              <Boxes className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Assigned Qty
              </span>
            </div>
            <p className="text-sm font-black text-slate-800 font-mono">
              {Number(order?.assignedQuantity || 0).toLocaleString()}{" "}
              <span className="text-xs font-medium text-gray-400">units</span>
            </p>
          </div>

          {/* ALLOCATION SCORE */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-400">
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Alloc Score
              </span>
            </div>
            <p className="text-sm font-bold text-blue-900 font-mono">
              {formattedScore}%
            </p>
          </div>

          {/* FINANCIALS: ESTIMATED AMOUNT */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-400">
              <DollarSign className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Est. Amount
              </span>
            </div>
            <p className="text-sm font-black text-slate-800 font-mono">
              ${Number(order?.estimatedAmount || 0).toLocaleString()}
            </p>
          </div>

          {/* TARGET DELIVERY DATE */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Delivery Date
              </span>
            </div>
            <p className="text-sm font-bold text-slate-700 font-mono">
              {formattedDeliveryDate}
            </p>
          </div>
        </div>

        {/* TECHNICAL BLOCKCHAIN SUBTEXT METADATA */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-400 font-mono pt-1 border-t border-slate-50">
          <div>
            <span>Reg. Link ID: </span>
            <span className="text-slate-500 font-medium">
              {order?.registrationId}
            </span>
          </div>
          <div className="hidden sm:block text-slate-200">|</div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-gray-300" />
            <span>Defect Bound: {order?.defectRate || 0}%</span>
          </div>
        </div>
      </div>

      {/* RIGHT: ACTION CONTROLS SLOT (CHỪA SẴN CHỖ CHO BUTTONS CỦA BẠN) */}
      <div
        className="
          flex items-center justify-start lg:justify-end gap-2 
          pt-3 lg:pt-0 border-t border-dashed border-slate-100 lg:border-none
          shrink-0 min-w-[140px]
        "
      >
        {children ? (
          children
        ) : (
          <span className="text-xs italic text-gray-300 font-mono">
            No actions injected
          </span>
        )}
      </div>
    </div>
  );
};

export default OrderItem;
