import React, { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router";
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
    return (rawRate).toFixed(2);
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
<div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 gap-4">
  <div>
    {/* Tags Hệ thống & Tương tác - Sử dụng gap-2 (8px) theo bộ token */}
    <div className="flex flex-wrap items-center gap-2">
      {/* 1. Mã định danh hợp đồng (Dữ liệu tĩnh) */}
      <span className="text-xs font-mono px-2 py-0.5 bg-blue-50 text-blue-800 rounded-md font-semibold">
        ID: {contract.id}
      </span>
      
      {/* 2. Liên kết tới Nhu cầu cung ứng (Demand Link) - Naming rõ ràng */}
      <Link 
        to={`/console/demands/${contract.demandId}`}
        className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 text-blue-800 font-semibold rounded-md transition-colors hover:bg-blue-50"
      >
        {/* Lucide Icon: FileText (size={16}) kế thừa màu chữ */}
        <svg className="w-4 h-4 text-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
        <span>Demand: #{contract.demandId}</span>
      </Link>

      {/* 3. Địa chỉ Smart Contract - Định dạng phẳng, có truncate an toàn */}
      <Link 
        to={`/console/transactions?contractAddress=${contract?.address}`}
        className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 text-blue-800 font-semibold rounded-md transition-colors hover:bg-blue-50"
      >
        {/* Lucide Icon: Link2 (size={16}) */}
        <svg className="w-4 h-4 text-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 0 1 0 10h-2"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        <span className="truncate max-w-[150px] sm:max-w-none">Address: {contract.address}</span>
      </Link>
    </div>

    {/* Page Title (H1) - Khối text gradient thương hiệu */}
    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mt-2">
      Procurement Contract Ledger
    </h1>
  </div>

  {/* Status Badge - Khối Brand Gradient ưu tiên cao */}
  <div className="shrink-0">
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white shadow-sm">
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
          <div className="bg-white rounded-md p-4 md:p-6 shadow-sm space-y-5">
            {/* TITLE BLOCK */}
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5 pb-1">
              <FileText className="w-4 h-4 text-blue-800" />
              <span>Administrative Framework & Weights</span>
            </h3>

            {/* MAIN ACCOUNTING GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1 bg-gray-50/50 p-4 rounded-md shadow-sm">
                <span className="text-xs text-gray-500 font-semibold block">
                  Required Escrow Deposit Amount
                </span>
                <span className="font-mono text-base font-bold text-gray-900 flex items-center gap-1">
                  <Coins className="w-4 h-4 text-blue-800" />
                  {contract.requiredDepositedAmount?.toLocaleString() || 0}{" "}
                  <span className="text-xs font-sans text-gray-500 font-medium">
                    ETH
                  </span>
                </span>
              </div>

              <div className="space-y-1 bg-gray-50/50 p-4 rounded-md shadow-sm">
                <span className="text-xs text-gray-500 font-semibold block">
                  System Architecture Created
                </span>
                <span className="font-medium text-gray-900 flex items-center gap-1.5 pt-0.5">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {new Date(contract.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>

            {/* WEIGHTS MATRIX BLOCK */}
            <div className="space-y-3 pt-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Scale className="w-4 h-4 text-blue-800" />
                <span>Supplier Evaluation Strategy Weights</span>
              </span>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(contract.evaluationWeights || {}).map(
                  ([key, val]) => (
                    <div
                      key={key}
                      className="p-3 bg-blue-50/40 rounded-md text-center shadow-sm"
                    >
                      <span className="text-[10px] uppercase font-bold text-gray-500 block tracking-wide">
                        {key === "leadTime" ? "Lead Time" : key}
                      </span>
                      <span className="text-sm font-mono font-bold text-blue-800">
                        {(Number(val)).toFixed(2)}%
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* PENALTY RATES MATRICES */}
            <div className="space-y-3 pt-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-4 h-4 text-blue-800" />
                <span>Default Non-Compliance Penalty Parameters</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Delay Penalty: Converted and formatted safely to ETH / day */}
                <div className="p-4 bg-gray-50/50 rounded-md flex flex-col justify-between gap-3 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase font-bold text-gray-900">
                      Delay Failure Rate
                    </span>
                    <span className="text-[10px] text-gray-500 italic mt-0.5">
                      Fixed penalty fine calculated per overdue day
                    </span>
                  </div>
                  <span className="text-sm font-mono font-bold text-gray-900 pt-1 border-t border-gray-100">
                    {/* Logic mới: Giới hạn tối đa 4 chữ số thập phân và xóa 0 thừa ở đuôi */}
                    {+Number(contract.penaltyRates?.delay || 0).toFixed(4)}{" "}
                    <span className="text-xs font-sans text-gray-500 font-normal">
                      ETH / day
                    </span>
                  </span>
                </div>

                {/* Defect Penalty: Enforced 2 decimal percentage display */}
                <div className="p-4 bg-gray-50/50 rounded-md flex flex-col justify-between gap-3 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase font-bold tracking-wider text-gray-900">
                      Total Defect Penalty Rate
                    </span>
                    <span className="text-[10px] text-gray-500 italic mt-0.5">
                      Fixed penalty rate applied cumulative across all detected
                      defective units.
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5 pt-1 border-t border-gray-100 text-left">
                    <span className="text-base font-mono font-bold text-blue-800">
                      {Number(formattedDefectRate || 0).toFixed(2)}%
                    </span>
                    <span className="text-[10px] font-mono font-bold tracking-wide text-gray-500 uppercase">
                      per defective unit
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                  {new Date(demand.requestedDeliveryDate).toLocaleDateString(
                    "vi-VN",
                  )}
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
      <div className="flex w-full flex-col">
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
    </div>
  );
};

export default ContractDetailPage;
