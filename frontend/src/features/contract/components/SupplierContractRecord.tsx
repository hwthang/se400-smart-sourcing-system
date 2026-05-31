import React, { useState } from "react";
import {
  CalendarDays,
  FileText,
  User,
  Layers,
  ChevronRight,
  ClipboardList,
  FileCheck,
  Truck,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import SupplierQuotationItem from "../../supplier-quotation/components/SupplierQuotationItem";
import RegisterSupplierButton from "../../supplier-registration/components/RegisterSupplierButton";
import BuyerCriteriaItem from "../../buyer-criteria/components/BuyerCriteriaItem";
import OrderItem from "../../order/components/OrderItem";
import StartDeliveryButton from "../../order/components/StartDeliveryButton";
import CompleteDeliveryButton from "../../order/components/CompleteDeliveryButton";
import StartInspectionButton from "../../order/components/StartInspectionButton";
import CompleteInspectionButton from "../../order/components/CompleteInspectionButton";
import ReleasePaymentButton from "../../order/components/ReleasePaymentButton";
import { useAuth } from "../../auth/providers/AuthProvider";

type SupplierContractRecordProps = {
  registration: any;
  contract: any;
};

type TabKey = "quotation" | "criteria" | "order";

const SupplierContractRecord = ({
  registration,
  contract,
}: SupplierContractRecordProps) => {
  const supplier = registration?.supplier;
  const quotation = registration?.quotation;
  const order = registration?.order;
  const { user } = useAuth();

  // State quản lý ẩn/hiện thông tin chi tiết Supplier
  const [showSupplierDetails, setShowSupplierDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("quotation");

  const showCriteriaTab = user?.role === "EMPLOYEE" && [
    "CRITERIA_PENDING",
    "CRITERIA_SET",
    "ALLOCATED",
    "FUNDING",
    "FUNDED",
    "EXECUTING",
    "COMPLETED",
  ].includes(contract?.status);

  return (
    <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl border border-slate-100 shadow-sm p-4 md:p-6 space-y-6">
      
      {/* ========================================================= */}
      {/* HEADER SECTION */}
      {/* ========================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-blue-800" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900">
              Supplier Registration Record
            </h2>
            <p className="text-sm text-gray-500">
              On-chain registration execution record and ledger tracking state.
            </p>
          </div>
        </div>

        <div className="self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-blue-800 border border-blue-200 uppercase tracking-wider">
          {registration?.status || "PENDING"}
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUPPLIER INFO SECTION (WITH SHOW/HIDE TOGGLE) */}
      {/* ========================================================= */}
      <div className="bg-white rounded-lg border border-slate-200/60 shadow-sm overflow-hidden text-left">
        {/* Thanh tiêu đề quản lý Đóng/Mở */}
        <div 
          onClick={() => setShowSupplierDetails(!showSupplierDetails)}
          className="flex items-center justify-between px-4 py-3 bg-slate-50/60 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-100"
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-800" />
            <h3 className="text-sm font-bold text-slate-900">
              Supplier Enterprise Profile 
              <span className="text-xs font-normal text-gray-400 ml-2">
                ({supplier?.username || "Unknown"})
              </span>
            </h3>
          </div>
          
          {/* Nút Trigger hành động toggle */}
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-white hover:bg-blue-50 px-2.5 py-1 rounded-md border border-slate-200 shadow-sm transition-all"
          >
            <span>{showSupplierDetails ? "Hide Details" : "Show Details"}</span>
            {showSupplierDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Khung chứa thông tin động dựa trên state showSupplierDetails */}
        <div 
          className={`
            transition-all duration-300 ease-in-out overflow-hidden
            ${showSupplierDetails ? "max-h-[500px] border-t border-slate-100 p-4" : "max-h-0"}
          `}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Chi tiết liên hệ */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase">Identity Name</p>
                <p className="font-semibold text-gray-800 mt-0.5">{supplier?.username || "-"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase">Communication Email</p>
                <p className="font-semibold text-gray-800 break-all mt-0.5">{supplier?.email || "-"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-medium text-gray-400 uppercase">Cryptographic Wallet Node</p>
                <p className="font-mono text-xs font-bold text-blue-700 bg-blue-50/50 px-2 py-1 rounded border border-blue-100 break-all mt-1 inline-block">
                  {supplier?.walletAddress || "-"}
                </p>
              </div>
            </div>

            {/* Khối Metadata đi kèm */}
            <div className="border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Registration ID:</span>
                <span className="font-mono font-semibold text-gray-700 bg-slate-50 px-1.5 py-0.5 rounded border">
                  {registration?.id ? `${registration.id.slice(0,8)}...` : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Contract Hash:</span>
                <span className="font-mono font-semibold text-gray-700 bg-slate-50 px-1.5 py-0.5 rounded border">
                  {registration?.contractId ? `${registration.contractId.slice(0,8)}...` : "-"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 pt-1">
                <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                <span>Created: {registration?.createdAt ? new Date(registration.createdAt).toLocaleDateString() : "-"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BLOCK: REGISTER SUPPLIER */}
      {registration?.status === "CREATED" &&
        user?.role === "EMPLOYEE" &&
        contract?.status === "CUSTOMER_REGISTERED" && (
          <div className="flex justify-end bg-blue-50/40 border border-dashed border-blue-200 p-3 rounded-lg">
            <RegisterSupplierButton registration={registration} contract={contract} />
          </div>
        )}

      {/* ========================================================= */}
      {/* TABS NAVIGATION BAR */}
      {/* ========================================================= */}
      <div className="border-b border-slate-200 pt-2">
        <nav className="flex space-x-2" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab("quotation")}
            className={`
              flex items-center gap-2 px-4 py-2.5 font-semibold text-sm border-b-2 transition-all rounded-t-md
              ${activeTab === "quotation"
                ? "border-blue-800 text-blue-800 bg-white shadow-sm font-bold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-slate-50"
              }
            `}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Quotation Package</span>
          </button>

          {showCriteriaTab && (
            <button
              type="button"
              onClick={() => setActiveTab("criteria")}
              className={`
                flex items-center gap-2 px-4 py-2.5 font-semibold text-sm border-b-2 transition-all rounded-t-md
                ${activeTab === "criteria"
                  ? "border-blue-800 text-blue-800 bg-white shadow-sm font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-slate-50"
                }
              `}
            >
              <FileCheck className="w-4 h-4" />
              <span>Evaluation Criteria</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab("order")}
            className={`
              flex items-center gap-2 px-4 py-2.5 font-semibold text-sm border-b-2 transition-all rounded-t-md relative
              ${activeTab === "order"
                ? "border-blue-800 text-blue-800 bg-white shadow-sm font-bold"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-slate-50"
              }
            `}
          >
            <Truck className="w-4 h-4" />
            <span>Order Fulfillment</span>
            {order && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            )}
          </button>
        </nav>
      </div>

      {/* ========================================================= */}
      {/* TABS VIEWPORT */}
      {/* ========================================================= */}
      <div className="mt-4">
        {activeTab === "quotation" && (
          <div className="bg-white p-2 rounded-lg">
            <SupplierQuotationItem registration={registration} contract={contract} />
          </div>
        )}

        {activeTab === "criteria" && showCriteriaTab && (
          <div className="bg-white p-2 rounded-lg">
            <BuyerCriteriaItem registration={registration} contract={contract} />
          </div>
        )}

        {activeTab === "order" && (
          <div className="bg-white p-2 rounded-lg">
            {order ? (
              <OrderItem registration={registration} contract={contract}>
                {registration?.order?.status === "CONFIRMED" && user?.role === "SUPPLIER" && (
                  <StartDeliveryButton orderId={registration?.order?.id} contractId={contract?.id} />
                )}
                {registration?.order?.status === "DELIVERING" && user?.role === "EMPLOYEE" && (
                  <CompleteDeliveryButton registration={registration} contract={contract} />
                )}
                {registration?.order?.status === "DELIVERED" && user?.role === "EMPLOYEE" && (
                  <StartInspectionButton registration={registration} contract={contract} />
                )}
                {registration?.order?.status === "INSPECTING" && user?.role === "EMPLOYEE" && (
                  <CompleteInspectionButton registration={registration} contract={contract} />
                )}
                {registration?.order?.status === "INSPECTED" && user?.role === "EMPLOYEE" && (
                  <ReleasePaymentButton registration={registration} contract={contract} />
                )}
              </OrderItem>
            ) : (
              <div className="text-center py-10 border border-dashed rounded-xl text-sm text-gray-400 italic bg-gray-50/50">
                No active production procurement order dispatched for this supplier yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierContractRecord;