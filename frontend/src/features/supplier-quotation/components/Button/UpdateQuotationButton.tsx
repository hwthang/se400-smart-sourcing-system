// components/Button/UpdateQuotationButton.tsx

import React, { useMemo, useState } from "react";

import {
  Pencil,
  CircleDollarSign,
  Boxes,
  Truck,
  ShieldCheck,
} from "lucide-react";

import { formatEther } from "ethers";

import Modal from "../../../../shared/ui/modal/Modal";

import { useUpdateQuotation } from "../../hooks/use-supplier-quotation";

type Props = {
  registration: any;
};

const UpdateQuotationButton = ({ registration }: Props) => {
  const updateQuotation = useUpdateQuotation();

  const quotation = registration?.quotation;

  const [openForm, setOpenForm] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [form, setForm] = useState({
    unitPrice: quotation?.unitPrice?.toString() || "",

    minSupplyQuantity: quotation?.minSupplyQuantity?.toString() || "",

    maxSupplyQuantity: quotation?.maxSupplyQuantity?.toString() || "",

    maxDefectRate: quotation?.maxDefectRate?.toString() || "",

    maxLeadTimeDays: quotation?.maxLeadTimeDays?.toString() || "",
  });

  // =========================================================
  // VALIDATION
  // =========================================================
  const defectRateError = useMemo(() => {
    if (!form.maxDefectRate) return null;

    const val = Number(form.maxDefectRate);

    if (isNaN(val)) return "Invalid number";

    if (val < 0 || val > 10000) {
      return "Rate must be between 0 and 10000";
    }

    return null;
  }, [form.maxDefectRate]);

  const isFormValid = useMemo(() => {
    return (
      form.unitPrice &&
      form.minSupplyQuantity &&
      form.maxSupplyQuantity &&
      form.maxDefectRate &&
      form.maxLeadTimeDays &&
      !defectRateError
    );
  }, [form, defectRateError]);

  // =========================================================
  // HELPERS
  // =========================================================
  const ethPreview = useMemo(() => {
    if (!form.unitPrice || isNaN(Number(form.unitPrice))) {
      return "0";
    }

    try {
      return Number(formatEther(form.unitPrice)).toLocaleString(undefined, {
        maximumFractionDigits: 9,
      });
    } catch {
      return "0";
    }
  }, [form.unitPrice]);

  const defectRatePercent = useMemo(() => {
    const raw = Number(form.maxDefectRate) || 0;

    return (raw / 100).toFixed(2);
  }, [form.maxDefectRate]);

  const parsedValues = useMemo(() => {
    return {
      unitPrice: Number(form.unitPrice) || 0,

      minSupplyQuantity: Number(form.minSupplyQuantity) || 0,

      maxSupplyQuantity: Number(form.maxSupplyQuantity) || 0,

      maxDefectRate: Number(form.maxDefectRate) || 0,

      maxLeadTimeDays: Number(form.maxLeadTimeDays) || 0,
    };
  }, [form]);

  // =========================================================
  // ACTION
  // =========================================================
  const handleUpdate = () => {
    updateQuotation.mutate(
      {
        data: parsedValues,
        id: quotation.id,
        contractId: registration.contractId,
      },
      {
        onSuccess: () => {
          setOpenConfirm(false);
          setOpenForm(false);
        },
      },
    );
  };

  // =========================================================
  // UI
  // =========================================================
  const inputClass = `
    w-full
    rounded-md
    bg-white
    px-3
    py-2
    text-sm
    text-gray-900
    placeholder-gray-400
    border
    border-gray-200
    shadow-sm
    outline-none
    transition-all
    focus:border-blue-800
    focus:ring-4
    focus:ring-blue-800/10
  `;

  const cardClass = `
    rounded-md
    border
    border-slate-100
    bg-gradient-to-br
    from-white
    to-blue-50/40
    p-4
    shadow-sm
    space-y-2
  `;

  return (
    <>
      {/* BUTTON */}
      <button
        type="button"
        onClick={() => setOpenForm(true)}
        className="
          rounded-md
          bg-white
          px-4
          py-2
          text-sm
          font-medium
          text-blue-900
          shadow-sm
          transition-all
          hover:bg-blue-50
        "
      >
        <div className="flex items-center gap-2">
          <Pencil className="w-4 h-4" strokeWidth={2} />
          Update
        </div>
      </button>

      {/* FORM MODAL */}
      <Modal
        open={openForm}
        onClose={() => setOpenForm(false)}
        title="Update Supplier Quotation"
      >
        <div className="space-y-6">
          <div
            className="
              rounded-md
              border
              border-blue-100
              bg-blue-50/60
              p-4
              space-y-1
            "
          >
            <p className="text-sm font-semibold text-blue-900">
              Supplier Commercial Update
            </p>

            <p className="text-xs text-gray-500">
              Modify quotation pricing, logistics capability and manufacturing
              tolerance.
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
            "
          >
            {/* UNIT PRICE */}
            <div className={cardClass}>
              <div className="flex items-center gap-2">
                <CircleDollarSign
                  className="w-4 h-4 text-blue-800"
                  strokeWidth={2}
                />

                <label className="text-sm font-medium text-gray-900">
                  Unit Price (wei)
                </label>
              </div>

              <input
                type="number"
                min={0}
                value={form.unitPrice}
                onChange={(e) =>
                  setForm({
                    ...form,
                    unitPrice: e.target.value,
                  })
                }
                className={`${inputClass} font-mono`}
              />

              <p
                className="
                  inline-block
                  rounded
                  border
                  border-emerald-100
                  bg-emerald-50
                  px-2
                  py-1
                  text-[11px]
                  font-medium
                  text-emerald-700
                "
              >
                ≈ {ethPreview} ETH
              </p>
            </div>

            {/* MIN SUPPLY */}
            <div className={cardClass}>
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-blue-800" strokeWidth={2} />

                <label className="text-sm font-medium text-gray-900">
                  Min Supply Quantity
                </label>
              </div>

              <input
                type="number"
                min={0}
                value={form.minSupplyQuantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    minSupplyQuantity: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>

            {/* MAX SUPPLY */}
            <div className={cardClass}>
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-blue-800" strokeWidth={2} />

                <label className="text-sm font-medium text-gray-900">
                  Max Supply Quantity
                </label>
              </div>

              <input
                type="number"
                min={0}
                value={form.maxSupplyQuantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    maxSupplyQuantity: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>

            {/* DEFECT RATE */}
            <div className={cardClass}>
              <div className="flex items-center gap-2">
                <ShieldCheck
                  className={`w-4 h-4 ${
                    defectRateError ? "text-red-600" : "text-blue-800"
                  }`}
                  strokeWidth={2}
                />

                <label className="text-sm font-medium text-gray-900">
                  Max Defect Rate
                </label>
              </div>

              <input
                type="number"
                min={0}
                max={10000}
                step="1"
                value={form.maxDefectRate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    maxDefectRate: e.target.value,
                  })
                }
                className={`
                  ${inputClass}
                  ${
                    defectRateError
                      ? `
                        border-red-300
                        bg-red-50/30
                        text-red-900
                        focus:border-red-500
                        focus:ring-red-500/10
                      `
                      : ""
                  }
                `}
              />

              {defectRateError ? (
                <p
                  className="
                    inline-block
                    rounded
                    border
                    border-red-100
                    bg-red-50
                    px-2
                    py-1
                    text-[11px]
                    font-medium
                    text-red-600
                  "
                >
                  {defectRateError}
                </p>
              ) : (
                <p
                  className="
                    text-[11px]
                    font-mono
                    text-slate-500
                  "
                >
                  ≈{" "}
                  <span className="font-bold text-blue-900">
                    {defectRatePercent}%
                  </span>
                </p>
              )}
            </div>

            {/* LEAD TIME */}
            <div className={`${cardClass} md:col-span-2`}>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-800" strokeWidth={2} />

                <label className="text-sm font-medium text-gray-900">
                  Max Lead Time (Days)
                </label>
              </div>

              <input
                type="number"
                min={0}
                value={form.maxLeadTimeDays}
                onChange={(e) =>
                  setForm({
                    ...form,
                    maxLeadTimeDays: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* ACTION */}
          <div
            className="
              flex
              justify-end
              gap-2
              border-t
              border-gray-100
              pt-4
            "
          >
            <button
              type="button"
              onClick={() => setOpenForm(false)}
              className="
                px-4
                py-2
                text-sm
                font-medium
                text-gray-500
              "
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!isFormValid}
              onClick={() => setOpenConfirm(true)}
              className="
                rounded-md
                bg-blue-800
                px-4
                py-2
                text-sm
                font-medium
                text-white
                shadow-sm
                transition-colors
                hover:bg-blue-900
                disabled:cursor-not-allowed
                disabled:bg-slate-200
                disabled:text-slate-400
              "
            >
              Continue
            </button>
          </div>
        </div>
      </Modal>

      {/* CONFIRM */}
      <Modal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Confirm Quotation Update"
      >
        <div className="space-y-6">
          <div
            className="
              rounded-md
              border
              border-slate-100
              bg-slate-50
              p-4
              space-y-3
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-dashed
                border-slate-200
                py-2
              "
            >
              <span
                className="
                  text-xs
                  font-medium
                  uppercase
                  tracking-wider
                  text-gray-500
                "
              >
                Unit Price
              </span>

              <div className="text-right">
                <p
                  className="
                    text-sm
                    font-bold
                    text-gray-900
                    font-mono
                  "
                >
                  {parsedValues.unitPrice.toLocaleString()} wei
                </p>

                <p
                  className="
                    text-xs
                    font-semibold
                    text-emerald-700
                  "
                >
                  ≈ {ethPreview} ETH
                </p>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-dashed
                border-slate-200
                py-2
              "
            >
              <span
                className="
                  text-xs
                  font-medium
                  uppercase
                  tracking-wider
                  text-gray-500
                "
              >
                Supply Range
              </span>

              <span
                className="
                  text-sm
                  font-bold
                  text-gray-900
                "
              >
                {parsedValues.minSupplyQuantity} →{" "}
                {parsedValues.maxSupplyQuantity}
              </span>
            </div>

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-dashed
                border-slate-200
                py-2
              "
            >
              <span
                className="
                  text-xs
                  font-medium
                  uppercase
                  tracking-wider
                  text-gray-500
                "
              >
                Max Defect Rate
              </span>

              <div className="text-right">
                <p
                  className="
                    text-sm
                    font-bold
                    text-gray-900
                  "
                >
                  {defectRatePercent}%
                </p>

                <p
                  className="
                    text-[10px]
                    font-mono
                    text-gray-400
                  "
                >
                  Contract Value: {parsedValues.maxDefectRate}
                </p>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                justify-between
                py-1
              "
            >
              <span
                className="
                  text-xs
                  font-medium
                  uppercase
                  tracking-wider
                  text-gray-500
                "
              >
                Lead Time
              </span>

              <span
                className="
                  text-sm
                  font-bold
                  text-gray-900
                "
              >
                {parsedValues.maxLeadTimeDays} days
              </span>
            </div>
          </div>

          <div
            className="
              rounded-md
              border
              border-amber-200
              bg-amber-50
              p-4
              text-xs
              text-amber-900
            "
          >
            Please review all updated quotation parameters before final
            confirmation.
          </div>

          <div
            className="
              flex
              justify-end
              gap-2
              border-t
              border-gray-100
              pt-4
            "
          >
            <button
              type="button"
              onClick={() => setOpenConfirm(false)}
              className="
                rounded-md
                bg-white
                px-4
                py-2
                text-sm
                font-medium
                text-gray-500
              "
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleUpdate}
              disabled={updateQuotation.isPending}
              className="
                rounded-md
                bg-gradient-to-br
                from-blue-900
                to-indigo-900
                px-4
                py-2
                text-sm
                font-medium
                text-white
                shadow-sm
                disabled:opacity-40
              "
            >
              {updateQuotation.isPending ? "Updating..." : "Confirm Update"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UpdateQuotationButton;
