import React, { useState } from "react";
import { ethers } from "ethers";
import { Search } from "lucide-react";

import { RegisterCustomerButton } from "../components/RegisterCustomerButton";
import { RegisterSupplierButton } from "../components/RegisterSupplierButton";
import { StartOrderingButton } from "../components/StartOrderingButton";
import { ConfirmDemandButton } from "../components/ConfirmDemandButton";
import { ConfirmSupplierQuotationButton } from "../components/ConfirmSupplierQuotationButton";
import { StartAllocationButton } from "../components/StartAllocationButton";
import { ConfirmBuyerCriteriaButton } from "../components/ConfirmBuyerCriteriaButton";
import { CreateOrderButton } from "../components/CreateOrderButton";
import { DepositButton } from "../components/DepositButton";
import { StartExecutingButton } from "../components/StartExecutingButton";
import { CompleteDeliveryButton } from "../components/CompleteDeliveryButton";
import { CompleteInspectionButton } from "../components/CompleteInspectionButton";
import { ReleasePaymentButton } from "../components/ReleaseSupplierPaymentButton";
import { FinishButton } from "../components/FinishButton";

import { useProcurement } from "../hooks/useProcurement";
import { useProcurementContract } from "../hooks/useProcurementContract";

// Định nghĩa địa chỉ Smart Contract mặc định chuẩn hóa bằng Ethers v6
const defaultContractAddress = ethers.getAddress(
  "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
);

// Hàm tuần tự hóa an toàn (Triệt tiêu lỗi vỡ giao diện do kiểu dữ liệu BigInt On-chain)
const safeSerialize = (data: any) =>
  JSON.parse(
    JSON.stringify(data, (_, v) => (typeof v === "bigint" ? v.toString() : v)),
  );

const BlockchainTestPage = () => {
  return (
    <div className="p-8 bg-white min-h-screen space-y-8 font-sans">
      
      {/* HEADER SECTION */}
      <div className="pb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
          Blockchain Procurement Test Panel
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          14 Smart Contract Actions Isolated Environment Testing Interface
        </p>
      </div>

      {/* CORE PIPELINE MATRIX GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* PHASE 1: REGISTRATION */}
        <div className="rounded-md bg-gradient-to-br from-white to-blue-50/20 p-5 space-y-4 shadow-2xs border border-gray-100">
          <h2 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
            1. Registration Phase
          </h2>
          <div className="flex flex-col gap-2">
            <RegisterCustomerButton contractAddress={defaultContractAddress} />
            <RegisterSupplierButton contractAddress={defaultContractAddress} />
          </div>
        </div>

        {/* PHASE 2: ORDERING */}
        <div className="rounded-md bg-gradient-to-br from-white to-blue-50/20 p-5 space-y-4 shadow-2xs border border-gray-100">
          <h2 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
            2. Ordering Phase
          </h2>
          <div className="flex flex-col gap-2">
            <StartOrderingButton contractAddress={defaultContractAddress} />
            <ConfirmDemandButton contractAddress={defaultContractAddress} />
            <ConfirmSupplierQuotationButton contractAddress={defaultContractAddress} />
          </div>
        </div>

        {/* PHASE 3: ALLOCATION */}
        <div className="rounded-md bg-gradient-to-br from-white to-blue-50/20 p-5 space-y-4 shadow-2xs border border-gray-100">
          <h2 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
            3. Allocation Phase
          </h2>
          <div className="flex flex-col gap-2">
            <StartAllocationButton contractAddress={defaultContractAddress} />
            <ConfirmBuyerCriteriaButton contractAddress={defaultContractAddress} />
            <CreateOrderButton contractAddress={defaultContractAddress} />
            <DepositButton contractAddress={defaultContractAddress} />
          </div>
        </div>

        {/* PHASE 4: EXECUTION & SETTLEMENT */}
        <div className="rounded-md bg-gradient-to-br from-white to-blue-50/20 p-5 space-y-4 shadow-2xs border border-gray-100">
          <h2 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
            4. Execution & Settlement
          </h2>
          <div className="flex flex-col gap-2">
            <StartExecutingButton contractAddress={defaultContractAddress} />
            <CompleteDeliveryButton contractAddress={defaultContractAddress} />
            <CompleteInspectionButton contractAddress={defaultContractAddress} />
            <ReleasePaymentButton contractAddress={defaultContractAddress} />
          </div>
        </div>

        {/* PHASE 5: TERMINATION LIFECYCLE */}
        <div className="md:col-span-2 xl:col-span-4 rounded-md bg-gradient-to-br from-white to-blue-50/20 p-5 space-y-3 shadow-2xs border border-gray-100">
          <h2 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
            5. Final Termination Phase
          </h2>
          <FinishButton contractAddress={defaultContractAddress} />
        </div>
      </div>

      {/* INSPECTOR & STATE QUERY SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4">
        <ContractInspectorSection />
        <BlockchainOrderLookupPanel />
      </div>
    </div>
  );
};

// =========================================================
// SUB-COMPONENT: CONTRACT STATE STATEFUL INSPECTOR
// =========================================================
const ContractInspectorSection = () => {
  const [address, setAddress] = useState("");
  const [supplier, setSupplier] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const contract = useProcurementContract(address);

  const fetchAllStates = async () => {
    if (!address) return;
    try {
      setLoading(true);
      if (!contract) throw new Error("Target Contract Instance uninitialized");

      const [
        owner,
        buyer,
        customer,
        demand,
        weights,
        penalties,
        phase,
        quotation,
        criteria,
        order,
      ] = await Promise.all([
        contract.getOwner(),
        contract.getBuyer(),
        contract.getCustomer(),
        contract.getDemand(),
        contract.getEvaluationWeights(),
        contract.getPenaltyRates(),
        contract.getCurrentPhase(),
        supplier ? contract.getQuotation(supplier) : Promise.resolve(null),
        supplier ? contract.getBuyerCriteria(supplier) : Promise.resolve(null),
        supplier ? contract.getOrder(supplier) : Promise.resolve(null),
      ]);

      setData(
        safeSerialize({
          owner,
          buyer,
          customer,
          demand,
          weights,
          penalties,
          phase,
          quotation,
          criteria,
          order,
        }),
      );
    } catch (err) {
      console.error("Inspector state pipeline extraction collapsed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-md bg-white p-5 space-y-4 shadow-xs border border-gray-100 text-left">
      <div className="text-sm font-bold text-gray-800">Smart Contract Inspector</div>
      
      <div className="space-y-3">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Contract cryptographic hex address"
          className="w-full bg-white text-gray-900 font-mono rounded-md px-3 py-2 text-sm shadow-2xs border border-gray-200/80 focus:outline-none focus:ring-4 focus:ring-blue-800/10 transition-all"
        />
        <input
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          placeholder="Supplier wallet identity (Optional contextual scope)"
          className="w-full bg-white text-gray-900 font-mono rounded-md px-3 py-2 text-sm shadow-2xs border border-gray-200/80 focus:outline-none focus:ring-4 focus:ring-blue-800/10 transition-all"
        />
      </div>

      <button
        onClick={fetchAllStates}
        disabled={!address || loading}
        className="flex items-center gap-2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white font-medium px-4 py-2 rounded-md shadow-2xs text-xs uppercase tracking-wider transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:pointer-events-none"
      >
        <Search className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
        <span>{loading ? "Extracting Data..." : "Fetch All Data"}</span>
      </button>

      {data && (
        <pre className="text-xs bg-blue-50/30 text-blue-950 font-mono p-4 rounded-md overflow-auto max-h-[400px] shadow-inner leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

// =========================================================
// SUB-COMPONENT: ISOLATED BLOCKCHAIN ORDER LOOKUP PANEL
// =========================================================
const BlockchainOrderLookupPanel = () => {
  const [address, setAddress] = useState("");
  const [supplier, setSupplier] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const procurement = useProcurement(address);

  const handleFetchOrder = async () => {
    if (!supplier || !address) return;
    try {
      setLoading(true);
      const data = await procurement.getOrder.mutateAsync(supplier);
      setResult(safeSerialize(data));
    } catch (err) {
      console.error("Isolated Order Ledger synchronization failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-md bg-white p-5 space-y-4 shadow-xs border border-gray-100 text-left">
      <div className="text-sm font-bold text-gray-800">Blockchain Order Lookup</div>
      
      <div className="space-y-3">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Contract cryptographic hex address"
          className="w-full bg-white text-gray-900 font-mono rounded-md px-3 py-2 text-sm shadow-2xs border border-gray-200/80 focus:outline-none focus:ring-4 focus:ring-blue-800/10 transition-all"
        />
        <input
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          placeholder="Supplier identity hex lookup target"
          className="w-full bg-white text-gray-900 font-mono rounded-md px-3 py-2 text-sm shadow-2xs border border-gray-200/80 focus:outline-none focus:ring-4 focus:ring-blue-800/10 transition-all"
        />
      </div>

      <button
        onClick={handleFetchOrder}
        disabled={loading || !supplier || !address}
        className="flex items-center gap-2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white font-medium px-4 py-2 rounded-md shadow-2xs text-xs uppercase tracking-wider transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:pointer-events-none"
      >
        <Search className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
        <span>{loading ? "Querying Ledger..." : "Get Order Data"}</span>
      </button>

      {result && (
        <pre className="text-xs bg-blue-50/30 text-blue-950 font-mono p-4 rounded-md overflow-auto max-h-[400px] shadow-inner leading-relaxed">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default BlockchainTestPage;