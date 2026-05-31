import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router"; // Tích hợp hook điều hướng
import {
  Search,
  Layers,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Wallet,
  X,
} from "lucide-react";
import { useContractList } from "../hooks/use-contract";

// Cấu hình nhãn hiển thị trùng khớp hoàn toàn với mã trạng thái hệ thống
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  ALL: { label: "ALL", color: "text-slate-600", bg: "bg-slate-100" },
  CREATED: {
    label: "CREATED",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  },
  SUPPLIER_REGISTRATION_OPENED: {
    label: "SUPPLIER_REGISTRATION_OPENED",
    color: "text-indigo-700",
    bg: "bg-indigo-50 border-indigo-200",
  },
  SUPPLIER_REGISTRATION_CLOSED: {
    label: "SUPPLIER_REGISTRATION_CLOSED",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
  },
  DEPLOYED: {
    label: "DEPLOYED",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  CUSTOMER_REGISTERED: {
    label: "CUSTOMER_REGISTERED",
    color: "text-cyan-700",
    bg: "bg-cyan-50 border-cyan-200",
  },
  SUPPLIERS_REGISTERED: {
    label: "SUPPLIERS_REGISTERED",
    color: "text-teal-700",
    bg: "bg-teal-50 border-teal-200",
  },
  PENDING_PARTY_CONFIRMATION: {
    label: "PENDING_PARTY_CONFIRMATION",
    color: "text-orange-700",
    bg: "bg-orange-50 border-orange-200",
  },
  DEMAND_CONFIRMED: {
    label: "DEMAND_CONFIRMED",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
  QUOTATIONS_CONFIRMED: {
    label: "QUOTATIONS_CONFIRMED",
    color: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
  },
  CRITERIA_PENDING: {
    label: "CRITERIA_PENDING",
    color: "text-rose-700",
    bg: "bg-rose-50 border-rose-200",
  },
  CRITERIA_SET: {
    label: "CRITERIA_SET",
    color: "text-violet-700",
    bg: "bg-violet-50 border-violet-200",
  },
  ALLOCATED: {
    label: "ALLOCATED",
    color: "text-fuchsia-700",
    bg: "bg-fuchsia-50 border-fuchsia-200",
  },
  FUNDING: {
    label: "FUNDING",
    color: "text-lime-700",
    bg: "bg-lime-50 border-lime-200",
  },
  FUNDED: {
    label: "FUNDED",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
  },
  EXECUTING: {
    label: "EXECUTING",
    color: "text-sky-700",
    bg: "bg-sky-50 border-sky-200 animate-pulse",
  },
  COMPLETED: {
    label: "COMPLETED",
    color: "text-slate-700",
    bg: "bg-slate-200/60 border-slate-300",
  },
};

const ContractsPage = () => {
  const navigate = useNavigate(); // Khởi tạo hàm điều hướng

  // =========================================================
  // STATE MANAGEMENT
  // =========================================================
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Kiểm tra xem bộ lọc (Search hoặc Status) có đang hoạt động hay không
  const isFilterActive = useMemo(() => {
    return search.trim() !== "" || statuses !== "ALL";
  }, [search, statuses]);

  // Hàm xóa toàn bộ bộ lọc, đưa view hệ thống về mặc định
  const handleClearFilters = () => {
    setSearch("");
    setStatuses("ALL");
    setPage(1);
  };

  // =========================================================
  // QUERY PARAMS
  // =========================================================
  const queryParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      statuses: statuses !== "ALL" ? statuses : undefined,
      page,
      limit,
    }),
    [search, statuses, page],
  );

  // =========================================================
  // QUERY EXECUTION
  // =========================================================
  const { data, isLoading } = useContractList(queryParams);

  const contractItems = data?.items || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0 };

  const handleStatusTabChange = (statusKey: string) => {
    setStatuses(statusKey);
    setPage(1);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 text-left antialiased min-h-screen bg-slate-50/50">
      {/* HEADER CONTROL GATEWAY */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-800" />
            Smart Sourcing Master Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor decentralized verification statuses, optimization weights,
            and cryptographically anchored milestones.
          </p>
        </div>
      </div>

      {/* SEARCH & FILTERS CORE */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          {/* Input Tìm kiếm */}
          <div className="relative flex-grow max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by Token ID, Demand ID or address..."
              className="
                w-full pl-9 pr-4 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-800
                placeholder:text-slate-400 focus:outline-none focus:border-blue-800 focus:ring-4 focus:ring-blue-800/5 transition-all
              "
            />
          </div>

          {/* Nút Clear Filter (Chỉ xuất hiện khi có thay đổi bộ lọc dữ liệu) */}
          {isFilterActive && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="
                inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-bold
                bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200
                transition-all active:scale-[0.98] self-start sm:self-center
              "
            >
              <X className="w-3.5 h-3.5" strokeWidth={2.5} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Slider các Tab trạng thái dạng chữ in hoa đồng bộ với Status */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100">
          {Object.keys(STATUS_CONFIG).map((statusKey) => {
            const isActive = statuses === statusKey;
            const cfg = STATUS_CONFIG[statusKey];
            return (
              <button
                key={statusKey}
                type="button"
                onClick={() => handleStatusTabChange(statusKey)}
                className={`
                  shrink-0 px-3 py-1.5 text-[10px] font-mono font-bold rounded border transition-all uppercase tracking-wider
                  ${
                    isActive
                      ? "bg-blue-900 border-blue-900 text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                  }
                `}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN DATA STORAGE TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              Synchronizing Node Matrix...
            </span>
          </div>
        ) : contractItems.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-full text-slate-400">
              <Inbox className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                No Pipelines Found
              </h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                No legal specs or cryptographic states align with your selected
                filters.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80">
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Pipeline Reference
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    State Cluster
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Constraint Weights
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Penalty Ratios
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Required Escrow
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">
                    Anchored Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contractItems.map((contract: any) => {
                  const statusCfg = STATUS_CONFIG[contract.status] || {
                    label: contract.status,
                    color: "text-slate-700",
                    bg: "bg-slate-100",
                  };

                  return (
                    <tr
                      key={contract.id}
                      onClick={() =>
                        navigate(`/console/contracts/${contract.id}`)
                      }
                      className="hover:bg-slate-50/40 transition-colors group cursor-pointer"
                    >
                      {/* NODE REFERENCE CELL */}
                      <td className="px-4 py-3.5 space-y-1 max-w-xs">
                        <div className="font-bold text-slate-900 text-xs truncate group-hover:text-blue-800 transition-colors">
                          {contract.name ||
                            `Procurement Registry [${contract.id.substring(0, 6)}]`}
                        </div>
                        <div className="flex flex-col gap-0.5 text-[10px] font-mono text-slate-400">
                          <span className="truncate">
                            CTR-ID: {contract.id}
                          </span>
                          <span className="truncate text-slate-500">
                            DEM-ID: {contract.demandId}
                          </span>
                          {contract.address && (
                            <span className="text-blue-700 font-semibold truncate flex items-center gap-0.5">
                              <Wallet className="w-2.5 h-2.5" />{" "}
                              {contract.address}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* BLOCKCHAIN STATUS BADGE */}
                      <td className="px-4 py-3.5 vertical-align-middle">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 border text-[10px] font-mono font-bold rounded uppercase tracking-wide ${statusCfg.bg} ${statusCfg.color}`}
                        >
                          {statusCfg.label}
                        </span>
                      </td>

                      {/* OPTIMIZATION CONSTRAINT WEIGHTS */}
                      <td className="px-4 py-3.5 text-[11px] text-slate-600 font-medium">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex justify-between max-w-[120px]">
                            <span className="text-slate-400 text-[10px]">
                              Price Matrix:
                            </span>
                            <span className="font-bold text-slate-700">
                              {contract.evaluationWeights?.price || 0}%
                            </span>
                          </div>
                          <div className="flex justify-between max-w-[120px]">
                            <span className="text-slate-400 text-[10px]">
                              Lead Time:
                            </span>
                            <span className="font-bold text-slate-700">
                              {contract.evaluationWeights?.leadTime || 0}%
                            </span>
                          </div>
                          <div className="flex justify-between max-w-[120px]">
                            <span className="text-slate-400 text-[10px]">
                              Defect Ratio:
                            </span>
                            <span className="font-bold text-slate-700">
                              {contract.evaluationWeights?.defect || 0}%
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SLA PENALTY RATES */}
                      <td className="px-4 py-3.5 text-[11px] text-slate-600 font-medium">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex justify-between max-w-[120px]">
                            <span className="text-slate-400 text-[10px]">
                              Delay / Day:
                            </span>
                            <span className="text-rose-700 font-bold">
                              {contract.penaltyRates?.delay || 0} wei
                            </span>
                          </div>
                          <div className="flex justify-between max-w-[120px]">
                            <span className="text-slate-400 text-[10px]">
                              Defect Item:
                            </span>
                            <span className="text-rose-700 font-bold">
                              {contract.penaltyRates?.defect || 0}%
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* ESCROW CAPITALIZATION */}
                      <td className="px-4 py-3.5">
                        <div className="text-xs font-bold text-slate-800">
                          {contract.requiredDepositedAmount?.toLocaleString() ||
                            0}
                          <span className="text-[9px] text-slate-400 uppercase ml-1 tracking-wider">
                            ETH
                          </span>
                        </div>
                      </td>

                      {/* TIME LOG MATRIX */}
                      <td className="px-4 py-3.5 text-right space-y-0.5">
                        <div className="text-xs font-bold text-slate-700 flex items-center justify-end gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(contract.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {new Date(contract.createdAt).toLocaleTimeString(
                            "en-US",
                            { hour12: false },
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION ARCHITECTURE */}
        {!isLoading && contractItems.length > 0 && (
          <div className="bg-slate-50/50 px-4 py-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-600">
            <div>
              Showing Page{" "}
              <span className="text-slate-900 font-bold">{meta.page}</span> of{" "}
              <span className="text-slate-900 font-bold">
                {meta.totalPages || 1}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="
                  p-1.5 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-600 shadow-sm
                  disabled:opacity-40 disabled:cursor-not-allowed transition-all
                "
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="
                  p-1.5 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-600 shadow-sm
                  disabled:opacity-40 disabled:cursor-not-allowed transition-all
                "
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractsPage;
