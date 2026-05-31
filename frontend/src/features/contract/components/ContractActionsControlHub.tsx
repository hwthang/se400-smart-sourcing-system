import React from "react";
import { User, Store, ShieldAlert, CheckSquare } from "lucide-react";
import { useAuth } from "../../auth/providers/AuthProvider";
import { DeployButton } from "./Button/DeployButton";
import { OpenSupplierButton } from "./Button/OpenRegistrationButton";
import { DepositButton } from "./Button/DepositButton";
import { CloseRegistrationButton } from "./Button/CloseRegistrationButton";
import { FinishButton } from "./Button/FinishButton";
import { StartOrderingButton } from "./Button/StartOrderingButton";
import { RegisterCustomerButton } from "./Button/RegisterCustomerButton";
import { StartAllocationButton } from "./Button/StartAllocationButton";
import { RunAllocationButton } from "./Button/RunAllocationButton";
import { StartExecutingButton } from "./Button/StartExecutingButton";
import CreateRegistrationButton from "../../supplier-registration/components/CreateRegistrationButton";
import { UpdateContractButton } from "./Button/UpdateContractButton";
import { RequestFundButton } from "./Button/RequestFundButton";
import { Link } from "react-router";

interface ActionSectionsProps {
  contractData: any;
}

export const ContractActionControlHub: React.FC<ActionSectionsProps> = ({
  contractData,
}) => {
  const { user } = useAuth();
  const contract = contractData?.contract;
  const customer = contractData?.demand?.customer;
  console.log(customer);

  // ============================================================================
  // IDENTITY & ROLE DETECTION (Dựa trên thông tin user hiện tại và contract)
  // ============================================================================
  const isCustomer = user?.role == "CUSTOMER";
  const isSupplier = user?.role == "SUPPLIER";
  const isEmployee = user?.role == "EMPLOYEE";

  // Safe fallback guard: Nếu account không thuộc phân quyền nào thì không render hub
  if (!isCustomer && !isSupplier && !isEmployee) return null;

  return (
    <div className="space-y-6 text-left">
      {/* Tiêu đề vùng - Loại bỏ border-b, dùng khoảng cách và font size chuẩn hệ thống */}
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
        Role-Based Transaction Execution Gateways
      </h2>

      <div className="flex flex-col gap-6">
        {/* =========================================================
        1. CUSTOMER ACTIONS SECTION (Client Terminal)
       ========================================================= */}
        {isCustomer && (
          <div className="bg-white bg-gradient-to-br from-white to-blue-50/40 rounded-md p-4 md:p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                <User size={16} className="text-gray-900" />
                <span>Client Terminal</span>
                <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md font-mono normal-case font-bold">
                  Your Role
                </span>
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Escrow funds execution handlers, settlement controls, and
                milestone delivery clearances managed by the purchasing client.
              </p>
            </div>

            {/* Khối tương tác - Chuyển đổi sang Premium Primary Button Template */}
            <div className="flex flex-col justify-end sm:flex-row gap-2 pt-4">
             {contract.status == "PENDING_PARTY_CONFIRMATION" &&  <Link
                to={`/console/demands/${contractData?.demand?.id}`}
                className="flex items-center justify-center gap-2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white font-medium px-4 py-2 rounded-md shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-110 active:scale-[0.98] text-sm text-center w-full sm:w-auto"
              >
                {/* Lucide Icon: CheckSquare (size={16}) */}
                <CheckSquare size={16}/> 
                <span>Confirm Your Demand</span>
              </Link>}
            </div>
          </div>
        )}

        {/* =========================================================
        2. SUPPLIER ACTIONS SECTION (Supplier Terminal)
       ========================================================= */}
        {isSupplier && (
          <div className="bg-white bg-gradient-to-br from-white to-blue-50/40 rounded-md p-4 md:p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                {/* Lucide Icon: Store (size={16}) */}
                <svg
                  className="w-4 h-4 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
                  <path d="M2 7h20"></path>
                  <path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"></path>
                  <path d="M14 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"></path>
                  <path d="M6 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"></path>
                </svg>
                <span>Supplier Terminal</span>
                <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md font-mono normal-case font-bold">
                  Your Role
                </span>
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Interactive operations dashboard for manufacturing vendors to
                register bidding tenders, upload asset proofing, and claim
                cleared assets.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              {!contractData?.registration && (
                <CreateRegistrationButton contractId={contract.id} />
              )}
            </div>
          </div>
        )}

        {/* =========================================================
        3. AUDITOR / EMPLOYEE ACTIONS SECTION (Auditor Terminal)
       ========================================================= */}
        {isEmployee && contract?.status !== "COMPLETED" && (
          <div className="bg-white bg-gradient-to-br from-white to-blue-50/40 rounded-md p-4 md:p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                {/* Lucide Icon: ShieldAlert (size={16}) */}
                <svg
                  className="w-4 h-4 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>Auditor Terminal</span>
                <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md font-mono normal-case font-bold">
                  Your Role
                </span>
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Supervisory monitoring authority reserved for logistics
                dispatchers: pipeline instantiation, validation processing, and
                non-compliance dispute settlements.
              </p>
            </div>

            {/* Khu vực nút chức năng của Admin: Đồng bộ hóa gap-2 (8px) */}
            <div className="flex flex-wrap gap-2 pt-4">
              <DepositButton contract={contract} />
              <DeployButton contract={contract} />
              <OpenSupplierButton contract={contract} />
              <FinishButton contract={contract} />
              <CloseRegistrationButton contract={contract} />
              <StartOrderingButton contract={contract} />
              <RegisterCustomerButton contract={contract} customer={customer} />
              <StartAllocationButton contract={contract} />
              <RunAllocationButton contract={contract} />
              <StartExecutingButton contract={contract} />
              {contract?.status === "CREATED" && (
                <UpdateContractButton
                  contractId={contract.id}
                  defaultValues={{
                    evaluationWeights: contract?.evaluationWeights,
                    penaltyRates: contract?.penaltyRates,
                  }}
                />
              )}
              <RequestFundButton contract={contract} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
