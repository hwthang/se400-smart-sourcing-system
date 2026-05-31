import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDemandList } from "../hooks/use-demand"; // Adjust this import statement based on your file path
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Layers,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../auth/providers/AuthProvider";

// Explicit demand status enum values matching your specifications
enum DemandStatus {
  CREATED = "CREATED",
  SUBMITTED = "SUBMITTED",
  IN_REVIEW = "IN_REVIEW",
  REJECTED = "REJECTED",
  APPROVED = "APPROVED",
  CONTRACTED = "CONTRACTED",
  PENDING_CONFIRMATION = "PENDING_CONFIRMATION",
  CONFIRMED = "CONFIRMED",
}

// Visual mapping helper for badge status colors
const statusStyles: Record<DemandStatus, string> = {
  [DemandStatus.CREATED]: "bg-blue-50 text-blue-700",
  [DemandStatus.SUBMITTED]: "bg-indigo-50 text-indigo-700",
  [DemandStatus.IN_REVIEW]: "bg-amber-50 text-amber-700",
  [DemandStatus.APPROVED]: "bg-emerald-50 text-emerald-700",
  [DemandStatus.CONTRACTED]: "bg-purple-50 text-purple-700",
  [DemandStatus.PENDING_CONFIRMATION]: "bg-cyan-50 text-cyan-700",
  [DemandStatus.CONFIRMED]: "bg-green-100 text-green-800",
  [DemandStatus.REJECTED]: "bg-rose-50 text-rose-700",
};

const DemandListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State variables handling client filter configurations
  const [search, setSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<DemandStatus[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  // React Query hook tracking network states
  const { data: response, isLoading } = useDemandList({
    page,
    limit,
    search: search || undefined,
    statuses:
      selectedStatuses.length > 0 ? selectedStatuses.join(",") : undefined,
  });

  const demandItems = response?.items || [];
  const meta = response?.data?.meta || { page: 1, totalPages: 1, total: 0 };

  // Appends or drops targeted filter pills
  const handleToggleStatus = (status: DemandStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
    setPage(1); // Reset to first page on filtering change
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 bg-gradient-to-br from-white to-blue-50/40 min-h-screen space-y-6">
      {/* 1. TOP HEADER PANEL */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
            Sourcing Demands Log
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review material procurement, check current execution statuses, and
            verify client requirement flows.
          </p>
        </div>

        {/* Create CTA Button routing to target form layout */}
        {user?.role == "CUSTOMER" && (
          <button
            onClick={() => navigate("create")}
            className="
    flex items-center justify-center gap-2 
    bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-900 
    text-white font-bold px-5 py-2.5 rounded-lg shadow-md 
    transition-all duration-200 hover:shadow-lg hover:brightness-110 
    active:scale-[0.98] w-full sm:w-auto text-xs uppercase tracking-wider
  "
          >
            <Plus className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            <span>Create Demand</span>
          </button>
        )}
      </div>

      {/* 2. ADVANCED CONTROL PANEL & STATUS PILLS */}
      <div className="bg-white rounded-md p-4 shadow-sm space-y-4 text-left">
        {/* Integrated Text Filter Input */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-md pl-9 pr-4 py-2 text-sm shadow-sm border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-800/10 focus:border-blue-800/40 transition-all"
            placeholder="Search matching items by product name, SKU strings..."
          />
        </div>

        {/* Multiple Selector Badges Loop */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filters:
          </span>
          {Object.values(DemandStatus).map((status) => {
            const isSelected = selectedStatuses.includes(status);
            return (
              <button
                key={status}
                onClick={() => handleToggleStatus(status)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 unselectable border ${
                  isSelected
                    ? "bg-blue-900 text-white border-blue-900 shadow-sm scale-105"
                    : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {status.replace(/_/g, " ")}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. LOG LIST DATASHEET CONTAINER */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-sm text-gray-400 font-medium">
            Fetching distribution requirements log stream...
          </div>
        ) : demandItems.length === 0 ? (
          <div className="p-16 text-center text-sm text-gray-400 font-medium">
            No matching procurement records loaded for the selected query
            filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[11px] font-bold border-b border-gray-100">
                  <th className="py-3 px-4 md:px-6">Material SKU / ID</th>
                  <th className="py-3 px-4 md:px-6">Product Details</th>
                  <th className="py-3 px-4 md:px-6 text-right">
                    Requested Qty
                  </th>
                  <th className="py-3 px-4 md:px-6">Target Horizon</th>
                  <th className="py-3 px-4 md:px-6">Execution Pipeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs md:text-sm text-gray-900">
                {demandItems.map((item: any) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`${item.id}`)}
                    className="hover:bg-blue-50/20 cursor-pointer transition-colors duration-150 group"
                  >
                    {/* System Tracking Hash */}
                    <td className="py-4 px-4 md:px-6 font-mono font-semibold text-blue-800">
                      <div className="flex items-center gap-1 group-hover:underline">
                        <span>{item.product?.sku}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-800" />
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5 truncate max-w-[110px]">
                        {item.id}
                      </div>
                    </td>

                    {/* Specifications Nested Info */}
                    <td className="py-4 px-4 md:px-6 text-left">
                      <div className="font-semibold text-gray-900">
                        {item.product?.name}
                      </div>
                      <div className="text-xs text-gray-400 truncate max-w-xs mt-0.5">
                        {item.product?.description}
                      </div>
                    </td>

                    {/* Quantity Clamped to Right Grid Align */}
                    <td className="py-4 px-4 md:px-6 text-right font-mono font-bold text-gray-900">
                      {item.requestedQuantity?.toLocaleString()}
                    </td>

                    {/* Delivery Targets */}
                    <td className="py-4 px-4 md:px-6 text-left text-gray-600 font-medium">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>
                          {new Date(
                            item.requestedDeliveryDate,
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </td>

                    {/* Semantic Component Status badge */}
                    <td className="py-4 px-4 md:px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          statusStyles[item.status as DemandStatus] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.status === DemandStatus.APPROVED && (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        <span>{item.status?.replace(/_/g, " ")}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. BALANCED PAGINATION CONTROL COMPONENT */}
        {meta.totalPages > 1 && (
          <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Showing Page {meta.page} of {meta.totalPages} ({meta.total} Total
              Items)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="p-1.5 bg-white border border-gray-100 text-gray-600 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page === meta.totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
                className="p-1.5 bg-white border border-gray-100 text-gray-600 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm"
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

export default DemandListPage;
