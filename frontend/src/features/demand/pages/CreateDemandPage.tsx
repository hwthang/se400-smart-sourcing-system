// pages/Dashboard/Demand/CreateDemandPage.tsx

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  FilePlus2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Modal from "../../../shared/ui/modal/Modal";
import { useCreateDemand } from "../hooks/use-demand";

interface SpecItem {
  id: string;
  name: string;
  value: string;
}

interface DemandFormData {
  sku: string;
  name: string;
  description: string;
  requestedQuantity: string;
  requestedDeliveryDate: string;
  specifications: SpecItem[];
}

const CreateDemandPage = () => {
  const { mutate: createDemand, isPending } = useCreateDemand();

  const [formData, setFormData] = useState<DemandFormData>({
    sku: "",
    name: "",
    description: "",
    requestedQuantity: "",
    requestedDeliveryDate: "",
    specifications: [{ id: "1", name: "", value: "" }],
  });

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Lấy ngày hiện tại theo định dạng YYYY-MM-DD để truyền vào thuộc tính min
  // Giúp chặn toàn bộ các ngày trong quá khứ trực tiếp từ UI lịch nội sinh
  const todayString = new Date().toISOString().split("T")[0];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        { id: crypto.randomUUID(), name: "", value: "" },
      ],
    }));
  };

  const removeSpecification = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((spec) => spec.id !== id),
    }));
  };

  const handleSpecChange = (
    id: string,
    field: "name" | "value",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec) =>
        spec.id === id ? { ...spec, [field]: value } : spec,
      ),
    }));
  };

  const handleOpenConfirmation = (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra dự phòng bằng Logic thực thi (Validation Guard)
    const selectedDate = new Date(formData.requestedDeliveryDate);
    const todaysDate = new Date(todayString);

    if (selectedDate < todaysDate) {
      alert("Target SLA Timeline must be a future operational date.");
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const handleFinalConfirm = () => {
    const apiSpecs: Record<string, string> = {};
    formData.specifications.forEach((spec) => {
      if (spec.name.trim()) {
        apiSpecs[spec.name.trim()] = spec.value;
      }
    });

    const finalPayload = {
      product: {
        sku: formData.sku,
        name: formData.name,
        description: formData.description,
        specifications: apiSpecs,
      },
      requestedQuantity: Number(formData.requestedQuantity),
      requestedDeliveryDate: new Date(formData.requestedDeliveryDate),
    };

    createDemand(finalPayload, {
      onSuccess: () => {
        setIsConfirmModalOpen(false);
        setFormData({
          sku: "",
          name: "",
          description: "",
          requestedQuantity: "",
          requestedDeliveryDate: "",
          specifications: [{ id: "1", name: "", value: "" }],
        });
      },
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8 bg-gradient-to-br from-white to-slate-50/50 min-h-screen antialiased">
      {/* Page Header Area */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-slate-950 via-indigo-950 to-indigo-900 bg-clip-text text-transparent tracking-tight">
            Create Procurement Demand
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">
            Log dynamic smart-sourcing product requirements and allocation
            parameters.
          </p>
        </div>
      </div>

      {/* Main Creation Form Block */}
      <form onSubmit={handleOpenConfirmation} className="space-y-6">
        {/* Section: Core Product Details */}
        <div className="bg-white rounded-xl p-5 md:p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-sm md:text-base font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Product Logistics Data
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="w-full text-left">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Product SKU
              </label>
              <input
                type="text"
                name="sku"
                required
                disabled={isPending}
                value={formData.sku}
                onChange={handleInputChange}
                className="w-full bg-white text-slate-900 placeholder-slate-400 rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-2xs focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600/50 transition-all disabled:opacity-40"
                placeholder="e.g., SKU-ETH-9902"
              />
            </div>
            <div className="w-full md:col-span-2 text-left">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                required
                disabled={isPending}
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-white text-slate-900 placeholder-slate-400 rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-2xs focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600/50 transition-all disabled:opacity-40"
                placeholder="Enter formal product tracking designation"
              />
            </div>
          </div>

          <div className="w-full text-left">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              disabled={isPending}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-white text-slate-900 placeholder-slate-400 rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-2xs focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600/50 transition-all resize-none disabled:opacity-40"
              placeholder="Detailed supply properties, manufacturer guidelines, etc."
            />
          </div>
        </div>

        {/* Section: Specifications Grid Loop */}
        <div className="bg-white rounded-xl p-5 md:p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2">
            <h2 className="text-sm md:text-base font-bold text-slate-900 uppercase tracking-wider">
              Product Specifications
            </h2>
            <button
              type="button"
              disabled={isPending}
              onClick={addSpecification}
              className="flex items-center gap-1 bg-indigo-50/60 text-indigo-950 font-bold px-3 py-1.5 rounded-lg border border-indigo-100/60 transition-all duration-200 hover:bg-indigo-100 active:scale-[0.98] disabled:opacity-40 text-xs uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-700" strokeWidth={2.5} />
              <span>Add Set</span>
            </button>
          </div>

          {formData.specifications.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs font-medium text-slate-400">
                No specifications added. Click "Add Set" to initialize custom
                keys.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.specifications.map((spec, index) => (
                <div
                  key={spec.id}
                  className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col md:flex-row items-start md:items-center gap-4 relative transition-all"
                >
                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                    <div className="w-full">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Spec Name #{index + 1}
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isPending}
                        value={spec.name}
                        onChange={(e) =>
                          handleSpecChange(spec.id, "name", e.target.value)
                        }
                        className="w-full bg-white text-slate-900 placeholder-slate-400 rounded-lg border border-slate-200 px-3 py-1.5 text-xs shadow-2xs focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600/50 transition-all disabled:opacity-40"
                        placeholder="e.g., Material Grade"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Spec Value #{index + 1}
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isPending}
                        value={spec.value}
                        onChange={(e) =>
                          handleSpecChange(spec.id, "value", e.target.value)
                        }
                        className="w-full bg-white text-slate-900 placeholder-slate-400 rounded-lg border border-slate-200 px-3 py-1.5 text-xs shadow-2xs focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600/50 transition-all disabled:opacity-40"
                        placeholder="e.g., Titanium G5"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => removeSpecification(spec.id)}
                    className="p-2 text-slate-400 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors duration-150 self-end md:self-center mt-2 md:mt-4 disabled:opacity-40"
                    title="Remove configuration set"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Fulfillment Bounds */}
        <div className="bg-white rounded-xl p-5 md:p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-sm md:text-base font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Fulfillment Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="w-full">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Requested Quantity
              </label>
              <input
                type="number"
                name="requestedQuantity"
                required
                min={1}
                disabled={isPending}
                value={formData.requestedQuantity}
                onChange={handleInputChange}
                className="w-full bg-white text-slate-900 placeholder-slate-400 rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-2xs focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600/50 transition-all disabled:opacity-40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Units required"
              />
            </div>
            <div className="w-full">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Requested Delivery Date
              </label>
              <input
                type="date"
                name="requestedDeliveryDate"
                required
                min={todayString} /* BLOCK TOÀN BỘ NGÀY TRONG QUÁ KHỨ */
                disabled={isPending}
                value={formData.requestedDeliveryDate}
                onChange={handleInputChange}
                className="w-full bg-white text-slate-900 placeholder-slate-400 rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-2xs focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600/50 transition-all disabled:opacity-40"
              />
            </div>
          </div>
        </div>

        {/* Action Button Trigger */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="
              flex items-center justify-center gap-2 bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-900 
              text-white font-bold px-6 py-3.5 rounded-lg shadow-md transition-all duration-200 
              hover:shadow-lg hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto text-xs uppercase tracking-wider
            "
          >
            {isPending ? (
              <>
                <Loader2
                  className="w-4 h-4 text-white animate-spin"
                  strokeWidth={2.5}
                />
                <span>Processing Network Dispatch...</span>
              </>
            ) : (
              <>
                <FilePlus2 className="w-4 h-4 text-white" strokeWidth={2.5} />
                <span>Initialize Supply Demand</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <Modal
        open={isConfirmModalOpen}
        onClose={() => !isPending && setIsConfirmModalOpen(false)}
        title="Verify Allocation Requirements"
      >
        <div className="space-y-4 text-left">
          <div className="flex items-start gap-3 p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-lg text-indigo-950">
            <AlertCircle
              className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5"
              strokeWidth={2.5}
            />
            <p className="text-xs font-medium leading-relaxed">
              Please inspect procurement criteria thoroughly. Confirmed
              operational demands trigger automatic supplier route matching
              logic.
            </p>
          </div>

          <div className="space-y-3 text-xs md:text-sm font-medium">
            <div>
              <span className="text-slate-400 block font-bold text-[10px] uppercase tracking-wider mb-0.5">
                Product Summary
              </span>
              <p className="text-slate-900 font-bold">
                {formData.name || "—"}{" "}
                <span className="text-slate-400 font-mono font-normal">
                  ({formData.sku || "No SKU"})
                </span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase tracking-wider mb-0.5">
                  Requested Output
                </span>
                <p className="text-slate-900 font-bold">
                  {formData.requestedQuantity || 0} Units
                </p>
              </div>
              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase tracking-wider mb-0.5">
                  Target SLA Timeline
                </span>
                <p className="text-slate-900 font-bold">
                  {new Date(formData.requestedDeliveryDate).toLocaleDateString(
                    "vi-VN",
                  ) || "Unassigned"}
                </p>
              </div>
            </div>

            {formData.specifications.some((s) => s.name.trim()) && (
              <div className="pt-1">
                <span className="text-slate-400 block font-bold text-[10px] uppercase tracking-wider mb-1">
                  Verified Structural Specs
                </span>
                <div className="max-h-24 overflow-y-auto bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5 text-xs">
                  {formData.specifications.map(
                    (spec) =>
                      spec.name.trim() && (
                        <div
                          key={spec.id}
                          className="flex justify-between border-b border-slate-200/40 pb-1 last:border-b-0 last:pb-0"
                        >
                          <span className="text-slate-400 font-semibold">
                            {spec.name}:
                          </span>
                          <span className="text-slate-900 font-bold">
                            {spec.value || "—"}
                          </span>
                        </div>
                      ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Modal Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={isPending}
              onClick={() => setIsConfirmModalOpen(false)}
              className="flex items-center justify-center bg-white text-slate-600 border border-slate-200 font-bold px-4 py-2.5 rounded-lg transition-all duration-200 hover:bg-slate-50 active:scale-[0.98] disabled:opacity-40 w-full sm:w-auto text-xs uppercase tracking-wider shadow-2xs"
            >
              Review Corrections
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={handleFinalConfirm}
              className="
                flex items-center justify-center gap-2 bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-900 
                text-white font-bold px-4 py-2.5 rounded-lg shadow-md transition-all duration-200 
                hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto text-xs uppercase tracking-wider
              "
            >
              {isPending ? (
                <Loader2
                  className="w-3.5 h-3.5 text-white animate-spin"
                  strokeWidth={2.5}
                />
              ) : (
                <CheckCircle2
                  className="w-3.5 h-3.5 text-white"
                  strokeWidth={2.5}
                />
              )}
              <span>{isPending ? "Broadcasting..." : "Broadcast Demand"}</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateDemandPage;
