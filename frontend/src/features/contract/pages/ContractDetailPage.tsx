import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  FileText,
  Package,
  Layers,
  ShieldAlert,
  Calendar,
  Scale,
  Coins,
  AlertTriangle,
} from "lucide-react";
import { useContractDetail } from "../hooks/use-contract";
import { ContractActionControlHub } from "../components/ContractActionsControlHub";
import SupplierContractRecord from "../components/SupplierContractRecord";
import { useAuth } from "../../auth/providers/AuthProvider";

const ContractDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: response, isLoading, error } = useContractDetail(id || "");

  const contractData = response;
  const contract = contractData?.contract;
  const demand = contractData?.demand;
  const formattedDefectRate = useMemo(() => {
    const rawRate = Number(contract?.penaltyRates?.defect || 0);
    return (rawRate / 100).toFixed(2);
  }, [contract?.penaltyRates?.defect]);
  if (isLoading) {
    return (
      <div className="p-12 text-center font-medium text-gray-400">
        Syncing smart procurement parameters...
      </div>
    );
  }

  if (error || !contractData) {
    return (
      <div className="p-12 text-center font-medium text-rose-600">
        Failed to locate the targeted contract ledger entry.
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8 bg-gradient-to-br from-white to-blue-50/40 min-h-screen space-y-6 text-left">
      {/* HEADER NAVIGATION */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider hover:text-blue-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Operations Registry
      </button>

      {/* METADATA BANNER HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 bg-purple-50 text-purple-700 rounded font-semibold border border-purple-100">
              Contract Ref: {contract.id}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold border border-blue-100">
              Demand Ref: {contract.demandId}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mt-2">
            Procurement Contract Ledger
          </h1>
        </div>
        <div className="shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider bg-purple-900 text-white shadow-sm">
            Status: {contract.status?.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      {/* BLOCKCHAIN / SYSTEM METADATA ALERTS */}
      {contract.address === "" && (
        <div className="p-3 bg-amber-50 border border-amber-100 rounded text-amber-800 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            This contract profile currently lives as a local database{" "}
            <strong>DRAFT</strong>. Off-chain cryptographic token address
            assignment pending.
          </span>
        </div>
      )}

      {/* MAIN TWO-COLUMN SYSTEM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COMPONENT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION 1: CONTRACT DETAILS */}
          <div className="bg-white rounded-md p-5 md:p-6 shadow-sm border border-gray-100/60 space-y-5">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
              <FileText className="w-4 h-4 text-purple-700" /> Administrative
              Framework & Weights
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1 bg-gray-50/50 p-3 rounded border border-gray-100">
                <span className="text-xs text-gray-400 font-semibold block">
                  Required Escrow Deposit Amount
                </span>
                <span className="font-mono text-base font-bold text-gray-800 flex items-center gap-1">
                  <Coins className="w-4 h-4 text-amber-500" />
                  {contract.requiredDepositedAmount?.toLocaleString() || 0}{" "}
                  <span className="text-xs font-sans text-gray-400 font-medium">
                    wei
                  </span>
                </span>
              </div>

              <div className="space-y-1 bg-gray-50/50 p-3 rounded border border-gray-100">
                <span className="text-xs text-gray-400 font-semibold block">
                  System Architecture Created
                </span>
                <span className="font-medium text-gray-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {new Date(contract.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* WEIGHTS MATRIX BLOCK */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Scale className="w-3.5 h-3.5" /> Supplier Evaluation Strategy
                Weights
              </span>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(contract.evaluationWeights || {}).map(
                  ([key, val]) => (
                    <div
                      key={key}
                      className="p-2.5 bg-blue-50/20 border border-blue-100/50 rounded text-center"
                    >
                      <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wide">
                        {key}
                      </span>
                      <span className="text-sm font-mono font-bold text-blue-900">
                        {Number(val) / 100}%
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* PENALTY RATES MATRICES (UPDATED LOGIC) */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Default Non-Compliance
                Penalty Parameters
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Delay Penalty: Fixed Wei amount per day */}
                <div className="p-3 bg-rose-50/20 border border-rose-100/40 rounded flex flex-col justify-between gap-1.5 px-4">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase font-bold text-gray-500">
                      Delay Failure Rate
                    </span>
                    <span className="text-[10px] text-gray-400 italic">
                      Fixed penalty fine calculated per overdue day
                    </span>
                  </div>
                  <span className="text-sm font-mono font-bold text-rose-700">
                    {contract.penaltyRates?.delay?.toLocaleString() || 0}{" "}
                    <span className="text-xs font-sans text-gray-400 font-normal">
                      wei / day
                    </span>
                  </span>
                </div>

                {/* Defect Penalty: Fixed Wei amount per 1% excess defect rate */}
                <div className="p-4 bg-rose-50/30 border border-rose-100 rounded-xl flex flex-col justify-between gap-3 px-5 transition-all hover:border-rose-200">
                  <div className="flex flex-col space-y-0.5 text-left">
                    <span className="text-xs uppercase font-bold tracking-wider text-rose-900 font-sans">
                      Total Defect Penalty Rate
                    </span>
                    <span className="text-[11px] text-gray-400 leading-normal font-sans">
                      Fixed penalty rate applied cumulative across all detected
                      defective units (100.00% max).
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5 pt-1 border-t border-rose-100/50 text-left">
                    <span className="text-base font-mono font-black text-rose-700">
                      {formattedDefectRate}%
                    </span>
                    <span className="text-xs font-mono font-bold tracking-wide text-gray-400 uppercase">
                      per defective unit
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ContractActionControlHub contractData={contractData} />

          {contractData?.registration && (
            <SupplierContractRecord
              registration={contractData?.registration}
              contract={contract}
            />
          )}
          {contractData?.registrations &&
            contractData.registrations.map((item: unknown) => (
              <SupplierContractRecord registration={item} contract={contract} />
            ))}
        </div>

        {/* RIGHT COMPONENT COLUMN */}
        <div className="space-y-6">
          <div className="bg-white rounded-md p-5 md:p-6 shadow-sm border border-gray-100/60 space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
              <Package className="w-4 h-4 text-blue-800" /> Targeted Asset
              Profile
            </h3>

            <div className="space-y-3 text-xs text-gray-600">
              <div>
                <span className="text-gray-400 block font-semibold">
                  Material Designation Name
                </span>
                <span className="font-bold text-sm text-gray-800">
                  {demand.product?.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-gray-400 block font-semibold">
                    SKU Reference
                  </span>
                  <span className="font-mono text-gray-700 font-medium">
                    {demand.product?.sku}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">
                    Allocated Vol
                  </span>
                  <span className="font-mono text-gray-900 font-bold">
                    {demand.requestedQuantity?.toLocaleString()} Units
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <span className="text-gray-400 block font-semibold">
                  Target Delivery Deadline Horizon
                </span>
                <span className="font-mono text-blue-900 font-bold bg-blue-50/60 px-2 py-1 rounded inline-block mt-0.5">
                  {new Date(demand.requestedDeliveryDate).toLocaleDateString()}
                </span>
              </div>

              <div className="pt-1">
                <span className="text-gray-400 block font-semibold">
                  Scope of Work Context
                </span>
                <p className="text-gray-600 leading-relaxed mt-0.5 bg-gray-50/50 p-2 rounded border border-gray-100/50">
                  {demand.product?.description ||
                    "No description payload defined."}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Granular Material Matrices
                </span>
                <div className="space-y-1.5">
                  {Object.entries(demand.product?.specifications || {}).map(
                    ([key, val]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center bg-gray-50/50 px-2 py-1.5 rounded border border-gray-100/40 text-[11px]"
                      >
                        <span className="font-mono text-gray-400 font-bold uppercase">
                          {key}
                        </span>
                        <span className="font-semibold text-gray-700">
                          {String(val)}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailPage;
