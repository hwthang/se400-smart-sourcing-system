import React from "react";
import {
  CalendarDays,
  FileText,
  PackageCheck,
  ShoppingCart,
  User,
  DollarSign,
  Clock,
  AlertTriangle,
  Layers,
  ChevronRight,
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

const SupplierContractRecord = ({
  registration,
  contract,
}: SupplierContractRecordProps) => {
  const supplier = registration?.supplier;
  const quotation = registration?.quotation;
  const order = registration?.order;

  const { user } = useAuth();

  return (
    <div
      className="
        bg-gradient-to-br
        from-white
        to-blue-50/40
        rounded-md
        shadow-sm
        p-4
        md:p-6
        space-y-6
      "
    >
      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}
      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-start
          lg:justify-between
          gap-4
        "
      >
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <div
              className="
                w-10
                h-10
                rounded-full
                bg-blue-50
                flex
                items-center
                justify-center
              "
            >
              <User className="w-5 h-5 text-blue-800" strokeWidth={2} />
            </div>

            <div>
              <h2
                className="
                  text-lg
                  md:text-xl
                  font-bold
                  bg-gradient-to-r
                  from-blue-900
                  to-blue-700
                  bg-clip-text
                  text-transparent
                "
              >
                Supplier Registration
              </h2>

              <p className="text-sm text-gray-500">
                Registration execution record and supplier participation state.
              </p>
            </div>
          </div>
        </div>

        <div
          className="
            self-start
            rounded-md
            bg-blue-50
            px-3
            py-2
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
          {registration?.status || "PENDING"}
        </div>
      </div>

      {/* ========================================================= */}
      {/* REGISTRATION INFO */}
      {/* ========================================================= */}
      <div
        className="
          grid
          grid-cols-1
          gap-4
          md:gap-6
        "
      >
        {/* SUPPLIER */}
        <div
          className="
            bg-white
            rounded-md
            p-4
            shadow-sm
            space-y-4
            border
            border-slate-100
          "
        >
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-800" strokeWidth={2} />

            <h3 className="text-sm font-semibold text-gray-900">
              Supplier Information
            </h3>
          </div>

          <div
            className="space-y-3 text-left  grid
            grid-cols-2"
          >
            <div>
              <p className="text-xs text-gray-500">Username</p>

              <p className="text-sm font-medium text-gray-900">
                {supplier?.username || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Email Address</p>

              <p className="text-sm font-medium text-gray-900 break-all">
                {supplier?.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 col-span-2">Wallet Address</p>

              <p
                className="
                  text-sm
                  font-mono
                  font-semibold
                  text-blue-700
                  break-all
                "
              >
                {supplier?.walletAddress || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* REGISTRATION METADATA */}
        <div
          className="
            bg-white
            rounded-md
            p-4
            shadow-sm
            space-y-4
            border
            border-slate-100
          "
        >
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-800" strokeWidth={2} />

            <h3 className="text-sm font-semibold text-gray-900">
              Registration Metadata
            </h3>
          </div>

          <div
            className="space-y-3 text-left  grid
            grid-cols-2"
          >
            <div>
              <p className="text-xs text-gray-500">Registration ID</p>

              <p className="text-sm font-mono text-gray-900 break-all">
                {registration?.id}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Contract ID</p>

              <p className="text-sm font-mono text-gray-900 break-all">
                {registration?.contractId}
              </p>
            </div>

            <div className="flex items-start gap-2">
              <CalendarDays
                className="w-4 h-4 text-gray-500 mt-0.5"
                strokeWidth={2}
              />

              <div>
                <p className="text-xs text-gray-500">Created At</p>

                <p className="text-sm font-medium text-gray-900">
                  {registration?.createdAt
                    ? new Date(registration.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CalendarDays
                className="w-4 h-4 text-gray-500 mt-0.5"
                strokeWidth={2}
              />

              <div>
                <p className="text-xs text-gray-500">Last Updated</p>

                <p className="text-sm font-medium text-gray-900">
                  {registration?.updatedAt
                    ? new Date(registration.updatedAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {registration.status === "CREATED" &&
        user?.role == "EMPLOYEE" &&
        contract?.status == "CUSTOMER_REGISTERED" && (
          <>
            <div className="flex justify-end">
              <RegisterSupplierButton
                registration={registration}
                contract={contract}
              />
            </div>
          </>
        )}
      {/* ========================================================= */}
      {/* QUOTATION SECTION */}
      {/* ========================================================= */}

      <SupplierQuotationItem registration={registration} contract={contract} />
      {user?.role == "EMPLOYEE" &&
        [
          "CRITERIA_PENDING",
          "CRITERIA_SET",
          "ALLOCATED",
          "FUNDING",
          "FUNDED",
          "EXECUTING",
          "COMPLETED",
        ].includes(contract.status) && (
          <BuyerCriteriaItem registration={registration} contract={contract} />
        )}

      {/* ========================================================= */}
      {/* ORDER SECTION */}
      {/* ========================================================= */}
      {order && (
        <OrderItem registration={registration} contract={contract}>
          {registration?.order?.status == "CONFIRMED" &&
            user.role == "SUPPLIER" && (
              <StartDeliveryButton
                orderId={registration?.order?.id}
                contractId={contract?.id}
              />
            )}
          {registration?.order?.status == "DELIVERING" &&
            user.role == "EMPLOYEE" && (
              <CompleteDeliveryButton
                registration={registration}
                contract={contract}
              />
            )}
          {registration?.order?.status == "DELIVERED" &&
            user.role == "EMPLOYEE" && (
              <StartInspectionButton
                registration={registration}
                contract={contract}
              />
            )}
          {registration?.order?.status == "INSPECTING" &&
            user.role == "EMPLOYEE" && (
              <CompleteInspectionButton
                registration={registration}
                contract={contract}
              />
            )}
          {registration?.order?.status == "INSPECTED" &&
            user.role == "EMPLOYEE" && (
              <ReleasePaymentButton
                registration={registration}
                contract={contract}
              />
            )}
        </OrderItem>
      )}
    </div>
  );
};

export default SupplierContractRecord;
