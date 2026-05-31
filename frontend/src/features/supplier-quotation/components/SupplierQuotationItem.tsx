import React from "react";
import {
  ClipboardList,
  CircleDollarSign,
  Truck,
  ShieldCheck,
  Layers,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import { formatEther } from "ethers";
import CreateQuotationButton from "./Button/CreateQuotationButton";
import SubmitQuotationButton from "./Button/SubmitQuotationButton";
import ApproveQuotationButton from "./Button/ApproveQuotationButton";
import RejectQuotationButton from "./Button/RejectQuotationButton";
import UpdateQuotationButton from "./Button/UpdateQuotationButton";
import RegisterSupplierButton from "../../supplier-registration/components/RegisterSupplierButton";
import ConfirmQuotationButton from "./Button/ConfirmQuotationButton";
import { useAuth } from "../../auth/providers/AuthProvider";

type SupplierQuotationItemProps = {
  registration: any;
  contract: any;
};

const SupplierQuotationItem = ({
  registration,
  contract,
}: SupplierQuotationItemProps) => {
  const quotation = registration?.quotation;
  const { user } = useAuth();

  // =========================================================
  // EMPTY STATE
  // =========================================================
  if (!quotation) {
    return (
      <div
        className="
          bg-white
          rounded-md
          shadow-sm
          p-4
          md:p-6
          space-y-6
          border
          border-slate-100
        "
      >
        {/* HEADER */}
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-800" strokeWidth={2} />
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              Supplier Quotation
            </h3>
          </div>
          <p className="text-sm text-gray-500">
            No quotation has been created for this supplier registration.
          </p>
        </div>

        {/* EMPTY VISUAL */}
        <div
          className="
            rounded-md
            bg-blue-50/50
            p-6
            text-center
            space-y-2
            border
            border-dashed
            border-blue-200
          "
        >
          <p className="text-sm font-semibold text-blue-900">
            Quotation draft not initialized
          </p>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Create a quotation proposal to declare your pricing, capacity
            limits, and lead time constraints to participate in the smart
            allocation system.
          </p>
        </div>

        {/* ACTION */}
        <div className="flex justify-end">
          <CreateQuotationButton registration={registration} />
        </div>
      </div>
    );
  }

  // =========================================================
  // QUOTATION STATE (Dữ liệu đã khởi tạo)
  // =========================================================
  return (
    <div
      className="
        bg-white
        rounded-md
        shadow-sm
        p-4
        md:p-6
        space-y-6
        border
        border-slate-100
      "
    >
      {/* HEADER */}
      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-start
          md:justify-between
          gap-4
        "
      >
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-800" strokeWidth={2} />
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              Supplier Quotation
            </h3>
          </div>
          <p className="text-sm text-gray-500">
            Supplier commercial proposal and supply capability declaration.
          </p>
        </div>

        <div
          className="
            self-start
            rounded-md
            bg-blue-50
            px-3
            py-1.5
            text-xs
            font-mono
            font-bold
            text-blue-800
            border
            border-blue-200
            uppercase
            tracking-wider
          "
        >
          {quotation.status || "DRAFT"}
        </div>
      </div>

      {/* QUOTATION DATA MATRIX */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          gap-4
        "
      >
        {/* UNIT PRICE */}
        {/* UNIT PRICE */}
        <div
          className="
    bg-gradient-to-br
    from-white
    to-blue-50/30
    rounded-md
    p-4
    border
    border-slate-100
    shadow-sm
    space-y-3
    text-left
  "
        >
          <div className="flex items-center gap-2">
            <CircleDollarSign
              className="w-4 h-4 text-blue-800"
              strokeWidth={2}
            />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Unit Price
            </p>
          </div>

          <div className="space-y-1">
            <p
              className="
        text-lg
        md:text-xl
        font-mono
        font-bold
        bg-gradient-to-r
        from-blue-900
        to-blue-700
        bg-clip-text
        text-transparent
        break-all
      "
            >
              {quotation?.unitPrice
                ? Number(quotation.unitPrice).toLocaleString()
                : "0"}{" "}
              <span className="text-xs font-sans font-normal text-slate-400 select-none">
                ETH
              </span>
            </p>

            <p className="text-[11px] text-gray-400">
              Pricing amount denominated in ETH.
            </p>
          </div>
        </div>

        {/* LEAD TIME */}
        <div
          className="
            bg-gradient-to-br
            from-white
            to-blue-50/30
            rounded-md
            p-4
            border
            border-slate-100
            shadow-sm
            space-y-3
            text-left
          "
        >
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-800" strokeWidth={2} />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Max Lead Time
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-lg md:text-xl font-bold text-gray-900">
              {quotation.maxLeadTimeDays || 0}{" "}
              <span className="text-xs font-normal text-gray-400">Days</span>
            </p>
            <p className="text-[11px] text-gray-400">
              Maximum delivery lead time commitment.
            </p>
          </div>
        </div>

        {/* SUPPLY RANGE */}
        <div
          className="
            bg-gradient-to-br
            from-white
            to-blue-50/30
            rounded-md
            p-4
            border
            border-slate-100
            shadow-sm
            space-y-3
            text-left
          "
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-800" strokeWidth={2} />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Supply Range
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-lg md:text-xl font-mono font-bold text-gray-900 tracking-tight">
              {(quotation.minSupplyQuantity || 0).toLocaleString()}{" "}
              <span className="text-xs font-normal text-slate-400">→</span>{" "}
              {(quotation.maxSupplyQuantity || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-gray-400">
              Guaranteed production capacity limits.
            </p>
          </div>
        </div>

        {/* DEFECT RATE */}
        <div
          className="
    bg-gradient-to-br
    from-white
    to-blue-50/30
    rounded-md
    p-4
    border
    border-slate-100
    shadow-sm
    space-y-3
    text-left
  "
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-800" strokeWidth={2} />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Max Defect Rate
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-lg md:text-xl font-bold text-gray-900">
              {/* Chia cho 100 để trả lại định dạng %, dùng toFixed(2) để cố định 2 chữ số thập phân */}
              {quotation?.maxDefectRate !== undefined &&
              quotation?.maxDefectRate !== null
                ? (Number(quotation.maxDefectRate)).toFixed(2)
                : "0.00"}
              %
            </p>
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] text-gray-400 leading-none">
                Maximum acceptable defect threshold.
              </p>
              {/* Dòng debug nhỏ hiển thị giá trị thực tế trong Smart Contract để tiện đối chiếu */}
              {quotation?.maxDefectRate && (
                <span className="text-[10px] font-mono text-slate-400">
                  Raw Contract Value: {quotation.maxDefectRate}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BLOCK */}

      <div
        className="
            border-t
            border-gray-100
            pt-4
            flex
            flex-wrap
            justify-end
            gap-2
          "
      >
        {quotation?.status === "CREATED" && user?.role == "SUPPLIER" && (
          <>
            <UpdateQuotationButton registration={registration} />
            <SubmitQuotationButton registration={registration} />
          </>
        )}

        {quotation?.status === "SUBMITTED" && user.role == "EMPLOYEE" && (
          <>
            <ApproveQuotationButton registration={registration} />
            <RejectQuotationButton registration={registration} />
          </>
        )}

        {quotation?.status === "PENDING_CONFIRMATION" &&
          user.role == "SUPPLIER" && (
            <>
              <ConfirmQuotationButton
                registration={registration}
                contract={contract}
              />
            </>
          )}
      </div>
    </div>
  );
};

export default SupplierQuotationItem;
