import { ethers } from "ethers";
import { CompleteDeliveryButton } from "../components/CompleteDeliveryButton";
import { CompleteInspectionButton } from "../components/CompleteInspectionButton";
import { ConfirmBuyerCriteriaButton } from "../components/ConfirmBuyerCriteriaButton";
import { ConfirmDemandButton } from "../components/ConfirmDemandButton";
import { ConfirmSupplierQuotationButton } from "../components/ConfirmSupplierQuotationButton";
import { CreateOrderButton } from "../components/CreateOrderButton";
import { DepositButton } from "../components/DepositButton";
import { FinishButton } from "../components/FinishButton";
import { RegisterCustomerButton } from "../components/RegisterCustomerButton";
import { RegisterSupplierButton } from "../components/RegisterSupplierButton";
import { ReleasePaymentButton } from "../components/ReleaseSupplierPaymentButton";
import { StartAllocationButton } from "../components/StartAllocationButton";
import { StartExecutingButton } from "../components/StartExecutingButton";
import { StartOrderingButton } from "../components/StartOrderingButton";
import { Search } from "lucide-react";
import { useProcurement } from "../hooks/useProcurement";
import { useState } from "react";
import { useProcurementContract } from "../hooks/useProcurementContract";
const contractAddress = ethers.getAddress(
  "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
);
const BlockchainTestPage = () => {
  return (
    <div className="p-8 bg-white min-h-screen">
      {/* HEADER */}
      <div className="border-b-2 border-blue-800 pb-4 mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
          Blockchain Procurement Test Panel
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          14 Smart Contract Actions Testing Interface
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* REGISTER PHASE */}
        <div className="border border-gray-200 rounded-md p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">
            REGISTRATION PHASE
          </h2>
          <div className="flex flex-col gap-2">
            <RegisterCustomerButton contractAddress={contractAddress} />
            <RegisterSupplierButton contractAddress={contractAddress} />
          </div>
        </div>

        {/* ORDERING PHASE */}
        <div className="border border-gray-200 rounded-md p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">
            ORDERING PHASE
          </h2>
          <div className="flex flex-col gap-2">
            <StartOrderingButton contractAddress={contractAddress} />
            <ConfirmDemandButton contractAddress={contractAddress} />
            <ConfirmSupplierQuotationButton contractAddress={contractAddress} />
          </div>
        </div>

        {/* ALLOCATION PHASE */}
        <div className="border border-gray-200 rounded-md p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">
            ALLOCATION PHASE
          </h2>
          <div className="flex flex-col gap-2">
            <StartAllocationButton contractAddress={contractAddress} />
            <ConfirmBuyerCriteriaButton contractAddress={contractAddress} />
            <CreateOrderButton contractAddress={contractAddress} />
            <DepositButton contractAddress={contractAddress} />
          </div>
        </div>

        {/* EXECUTION PHASE */}
        <div className="border border-gray-200 rounded-md p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">
            EXECUTION PHASE
          </h2>
          <div className="flex flex-col gap-2">
            <StartExecutingButton contractAddress={contractAddress} />
            <CompleteDeliveryButton contractAddress={contractAddress} />
            <CompleteInspectionButton contractAddress={contractAddress} />
            <ReleasePaymentButton contractAddress={contractAddress} />
          </div>
        </div>

        {/* FINAL */}
        <div className="border border-gray-200 rounded-md p-4 shadow-sm md:col-span-2 xl:col-span-3">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">
            FINAL PHASE
          </h2>
          <FinishButton contractAddress={contractAddress} />
        </div>
      </div>

      <ContractInspectorSection />
    </div>
  );
};

const GetOrderPanel = () => {
  const [supplier, setSupplier] = useState("");
  const [contractAddress, setContractAddress] = useState("");

  const procurement = useProcurement(contractAddress);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // SAFE SERIALIZER (fix BigInt crash)
  // =========================================================
  const safeSerialize = (data: any) =>
    JSON.parse(
      JSON.stringify(data, (_, v) =>
        typeof v === "bigint" ? v.toString() : v,
      ),
    );

  // =========================================================
  // FETCH ORDER
  // =========================================================
  const handleFetch = async () => {
    try {
      if (!supplier || !contractAddress) return;

      setLoading(true);

      const data = await procurement.getOrder.mutateAsync(supplier);

      setResult(safeSerialize(data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-md p-4 space-y-4 bg-white">
      {/* TITLE */}
      <div className="text-sm font-bold text-gray-700">
        Blockchain Order Lookup
      </div>

      {/* CONTRACT ADDRESS */}
      <input
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
        placeholder="Contract address"
        className="w-full border px-3 py-2 text-sm rounded"
      />

      {/* SUPPLIER ADDRESS */}
      <input
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
        placeholder="Supplier address"
        className="w-full border px-3 py-2 text-sm rounded"
      />

      {/* BUTTON */}
      <button
        onClick={handleFetch}
        disabled={loading || !supplier || !contractAddress}
        className="
          flex items-center gap-2
          bg-blue-900 text-white
          px-4 py-2 rounded
          disabled:opacity-40
        "
      >
        <Search className="w-4 h-4" />
        {loading ? "Loading..." : "Get Order"}
      </button>

      {/* RESULT */}
      {result && (
        <pre className="text-xs bg-slate-50 p-3 rounded border overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default BlockchainTestPage;

const safeSerialize = (data: any) =>
  JSON.parse(
    JSON.stringify(data, (_, v) => (typeof v === "bigint" ? v.toString() : v)),
  );

const ContractInspectorSection = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [supplier, setSupplier] = useState("");

  const contract = useProcurementContract(contractAddress);

  const safe = () => {
    if (!contract) throw new Error("Contract not ready");
    return contract;
  };

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    try {
      setLoading(true);

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
        safe().getOwner(),
        safe().getBuyer(),
        safe().getCustomer(),
        safe().getDemand(),
        safe().getEvaluationWeights(),
        safe().getPenaltyRates(),
        safe().getCurrentPhase(),

        supplier ? safe().getQuotation(supplier) : null,
        supplier ? safe().getBuyerCriteria(supplier) : null,
        supplier ? safe().getOrder(supplier) : null,
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-md p-4 space-y-4 bg-white">
      {/* TITLE */}
      <div className="text-sm font-bold text-gray-700">
        Smart Contract Inspector
      </div>

      {/* CONTRACT ADDRESS */}
      <input
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
        placeholder="Contract address"
        className="w-full border px-3 py-2 text-sm rounded"
      />

      {/* SUPPLIER ADDRESS */}
      <input
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
        placeholder="Supplier address (optional)"
        className="w-full border px-3 py-2 text-sm rounded"
      />

      {/* BUTTON */}
      <button
        onClick={fetchAll}
        disabled={!contractAddress || loading}
        className="
          flex items-center gap-2
          bg-blue-900 text-white
          px-4 py-2 rounded
          disabled:opacity-40
        "
      >
        <Search className="w-4 h-4" />
        {loading ? "Loading..." : "Fetch All Data"}
      </button>

      {/* RESULT */}
      {data && (
        <pre className="text-xs bg-slate-50 p-3 rounded border overflow-auto max-h-[500px]">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};
