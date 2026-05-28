import React from "react";
import { User, Store, ShieldAlert } from "lucide-react";
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
    <div className="space-y-6 mt-6 text-left">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
        Role-Based Transaction Execution Gateways
      </h2>

      <div className="flex flex-col gap-6">
        {/* =========================================================
            1. CUSTOMER ACTIONS SECTION
           ========================================================= */}
        {isCustomer && (
          <div
            className={`bg-white rounded-md p-5 shadow-sm border flex flex-col justify-between space-y-4 transition-all ${
              isCustomer
                ? "border-blue-200 ring-1 ring-blue-50"
                : "border-gray-100 opacity-60"
            }`}
          >
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-blue-900 flex items-center gap-1.5 uppercase tracking-wide">
                <User className="w-4 h-4 text-blue-800" /> Client Terminal
                {isCustomer && (
                  <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono normal-case">
                    Your Role
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-gray-400 leading-normal">
                Escrow funds execution handlers, settlement controls, and
                milestone delivery clearances managed by the purchasing client.
              </p>
            </div>

            <div className="flex flex-col md:flex-row flex-wrap gap-2 pt-2">
              {isCustomer ? (
                <>
                  {/* 👉 ADD YOUR CUSTOMER BUTTONS HERE 
                  Example: 
                  <WorkflowActionButton actionName="Deposit Escrow Funds" ... />
                */}
                </>
              ) : (
                <span className="text-xs text-gray-400 italic text-center py-2 bg-gray-50/50 rounded border border-dashed border-gray-100 w-full">
                  Access restricted to purchasing clients.
                </span>
              )}
            </div>
          </div>
        )}
        {/* =========================================================
            2. SUPPLIER ACTIONS SECTION
           ========================================================= */}
        {isSupplier && (
          <div
            className={`bg-white rounded-md p-5 shadow-sm border flex flex-col justify-between space-y-4 transition-all ${
              isSupplier
                ? "border-amber-200 ring-1 ring-amber-50"
                : "border-gray-100 opacity-60"
            }`}
          >
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
                <Store className="w-4 h-4 text-amber-700" /> Supplier Terminal
                {isSupplier && (
                  <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono normal-case">
                    Your Role
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-gray-400 leading-normal">
                Interactive operations dashboard for manufacturing vendors to
                register bidding tenders, upload asset proofing, and claim
                cleared assets.
              </p>
            </div>

            <div className="flex flex-col md:flex-row flex-wrap gap-2 pt-2">
              {isSupplier ? (
                <>
                  {!contractData?.registration && (
                    <CreateRegistrationButton contractId={contract.id} />
                  )}
                </>
              ) : (
                <span className="text-xs text-gray-400 italic text-center py-2 bg-gray-50/50 rounded border border-dashed border-gray-100 w-full">
                  Access restricted to verified suppliers.
                </span>
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            3. AUDITOR / EMPLOYEE ACTIONS SECTION (WORKFLOW CONTROL)
           ========================================================= */}
        {isEmployee && contract?.status !== "COMPLETED" && (
          <div
            className={`bg-white rounded-md p-5 shadow-sm border flex flex-col justify-between space-y-4 transition-all ${
              isEmployee
                ? "border-purple-200 ring-1 ring-purple-50"
                : "border-gray-100 opacity-60"
            }`}
          >
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-purple-900 flex items-center gap-1.5 uppercase tracking-wide">
                <ShieldAlert className="w-4 h-4 text-purple-700" /> Auditor
                Terminal
                {isEmployee && (
                  <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-mono normal-case">
                    Your Role
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-gray-400 leading-normal">
                Supervisory monitoring authority reserved for logistics
                dispatchers: pipeline instantiation, validation processing, and
                non-compliance dispute settlements.
              </p>
            </div>

            <div className="flex flex-col md:flex-row flex-wrap gap-2 pt-2">
              {isEmployee  ? (
                <>
                  <DepositButton contract={contract} />
                  <DeployButton contract={contract} />
                  <OpenSupplierButton contract={contract} />
                  <FinishButton contract={contract} />
                  <CloseRegistrationButton contract={contract} />
                  <StartOrderingButton contract={contract} />
                  <RegisterCustomerButton
                    contract={contract}
                    customer={customer}
                  />
                  <StartAllocationButton contract={contract} />
                  <RunAllocationButton contract={contract} />
                  <StartExecutingButton contract={contract} />
                  {contract?.status == "CREATED" && (
                    <UpdateContractButton
                      contractId={contract.id}
                      defaultValues={{
                        evaluationWeights: contract?.evaluationWeights,
                        penaltyRates: contract?.penaltyRates,
                      }}
                    />
                  )}
                  <RequestFundButton contract={contract} />
                </>
              ) : (
                <span className="text-xs text-gray-400 italic text-center py-2 bg-gray-50/50 rounded border border-dashed border-gray-100 w-full">
                  Access restricted to authorized personnel.
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
