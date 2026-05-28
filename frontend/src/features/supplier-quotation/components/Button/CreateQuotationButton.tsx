import React, { useMemo, useState } from "react";

import {
  ClipboardPlus,
  CircleDollarSign,
  Boxes,
  Truck,
  ShieldCheck,
} from "lucide-react";

import { formatEther } from "ethers";

import Modal from "../../../../shared/ui/modal/Modal";

import { useCreateQuotation } from "../../hooks/use-supplier-quotation";

type Props = {
  registration: any;
};

const CreateQuotationButton = ({ registration }: Props) => {
  const createQuotation = useCreateQuotation();

  const [openForm, setOpenForm] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [form, setForm] = useState({
    unitPrice: "",
    minSupplyQuantity: "",
    maxSupplyQuantity: "",

    /**
     * Smart contract native value:
     * 0 -> 10000
     *
     * Example:
     * 250 = 2.50%
     * 10000 = 100%
     */
    maxDefectRate: "",

    maxLeadTimeDays: "",
  });

  // =========================================================
  // VALIDATION
  // =========================================================
  const defectRateError = useMemo(() => {
    if (!form.maxDefectRate) return null;

    const value = Number(form.maxDefectRate);

    if (isNaN(value)) return "Invalid number";

    if (value < 0 || value > 10000) {
      return "Value must be between 0 and 10000";
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
        maximumFractionDigits: 100,
      });
    } catch {
      return "0";
    }
  }, [form.unitPrice]);

  /**
   * Contract value:
   * 250 => 2.50%
   */
  const defectRatePercent = useMemo(() => {
    const value = Number(form.maxDefectRate);

    if (isNaN(value)) return "0.00";

    return (value / 100).toFixed(2);
  }, [form.maxDefectRate]);

  // =========================================================
  // PARSED VALUES
  // =========================================================
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
  const handleCreate = () => {
    createQuotation.mutate(
      {
        registrationId: registration.id,

        ...parsedValues,
        contractId: registration.contractId,
      },
      {
        onSuccess: () => {
          setOpenConfirm(false);
          setOpenForm(false);

          setForm({
            unitPrice: "",
            minSupplyQuantity: "",
            maxSupplyQuantity: "",
            maxDefectRate: "",
            maxLeadTimeDays: "",
          });
        },
      },
    );
  };

  // =========================================================
  // UI CLASSES
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
    shadow-sm
    outline-none
    border
    transition-all
    focus:ring-4
  `;

  const cardClass = `
    rounded-md
    bg-gradient-to-br
    from-white
    to-blue-50/40
    p-4
    border
    border-slate-100
    shadow-sm
    space-y-2
    text-left
  `;

  return (
    <>
      {/* =========================================================
          TRIGGER
      ========================================================= */}
      <button
        type="button"
        onClick={() => setOpenForm(true)}
        className="
          flex
          items-center
          gap-2
          rounded-md
          bg-gradient-to-br
          from-blue-900
          via-blue-800
          to-indigo-900
          px-4
          py-2
          text-sm
          font-medium
          text-white
          shadow-sm
          transition-all
          duration-200
          hover:brightness-110
          hover:shadow-md
          active:scale-[0.98]
        "
      >
        <ClipboardPlus className="w-4 h-4" strokeWidth={2} />
        Create Quotation
      </button>

      {/* =========================================================
          INPUT MODAL
      ========================================================= */}
      <Modal
        open={openForm}
        onClose={() => setOpenForm(false)}
        title="Create Supplier Quotation"
      >
        <div className="space-y-6">
          {/* INTRO */}
          <div
            className="
              rounded-md
              border
              border-blue-100
              bg-blue-50/60
              p-4
              text-left
              space-y-1
            "
          >
            <p className="text-sm font-semibold text-blue-900">
              Supplier Commercial Proposal
            </p>

            <p className="text-xs text-gray-500 leading-relaxed">
              Configure supplier commercial conditions, manufacturing tolerance,
              and logistics capability before submitting the quotation proposal.
            </p>
          </div>

          {/* FORM */}
          <div
            className="
              grid
              grid-cols-2
              gap-4
            "
          >
            {/* UNIT PRICE */}
            <div
              className={`
                ${cardClass}
                md:col-span-2
              `}
            >
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
                className={`
                  ${inputClass}
                  border-gray-200
                  focus:border-blue-800
                  focus:ring-blue-800/10
                  font-mono
                `}
                placeholder="1000000000000000000"
              />

              {form.unitPrice && (
                <div className="space-y-1">
                  <p
                    className="
                      inline-block
                      rounded-md
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

                  <p className="text-[11px] text-gray-500">
                    Input value is stored directly in wei.
                  </p>
                </div>
              )}
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
                className={`
                  ${inputClass}
                  border-gray-200
                  focus:border-blue-800
                  focus:ring-blue-800/10
                `}
                placeholder="100"
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
                className={`
                  ${inputClass}
                  border-gray-200
                  focus:border-blue-800
                  focus:ring-blue-800/10
                `}
                placeholder="5000"
              />
            </div>

            {/* DEFECT RATE */}
            <div
              className={`
                ${cardClass}
                md:col-span-2
              `}
            >
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
                      : `
                        border-gray-200
                        focus:border-blue-800
                        focus:ring-blue-800/10
                      `
                  }
                `}
                placeholder="250"
              />

              {defectRateError ? (
                <p
                  className="
                    inline-block
                    rounded-md
                    border
                    border-red-100
                    bg-red-50
                    px-2
                    py-0.5
                    text-[11px]
                    font-medium
                    text-red-600
                  "
                >
                  {defectRateError}
                </p>
              ) : form.maxDefectRate ? (
                <div className="space-y-1">
                  <p
                    className="
                      inline-block
                      rounded-md
                      border
                      border-blue-100
                      bg-blue-50
                      px-2
                      py-1
                      text-[11px]
                      font-medium
                      text-blue-900
                    "
                  >
                    ≈ {defectRatePercent}%
                  </p>

                  <p className="text-[11px] text-gray-500">
                    Contract stores percentage using base 10000.
                    <br />
                    Example: 250 = 2.50%
                  </p>
                </div>
              ) : null}
            </div>

            {/* LEAD TIME */}
            <div
              className={`
                ${cardClass}
                md:col-span-2
              `}
            >
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
                className={`
                  ${inputClass}
                  border-gray-200
                  focus:border-blue-800
                  focus:ring-blue-800/10
                `}
                placeholder="30"
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
                transition-colors
                hover:text-gray-700
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => setOpenConfirm(true)}
              disabled={!isFormValid}
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

      {/* =========================================================
          CONFIRM MODAL
      ========================================================= */}
      <Modal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Confirm Quotation Creation"
      >
        <div className="space-y-6">
          <div
            className="
              rounded-md
              border
              border-slate-100
              bg-slate-50
              p-4
              text-left
              space-y-3
            "
          >
            {/* UNIT PRICE */}
            <div
              className="
                flex
                flex-col
                gap-1
                border-b
                border-dashed
                border-slate-200
                py-2
                sm:flex-row
                sm:items-center
                sm:justify-between
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
                    font-mono
                    text-gray-900
                  "
                >
                  {parsedValues.unitPrice.toLocaleString()} wei
                </p>

                <p className="text-xs font-semibold text-emerald-700">
                  ≈ {ethPreview} ETH
                </p>
              </div>
            </div>

            {/* SUPPLY */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
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

              <span className="text-sm font-bold text-gray-900">
                {parsedValues.minSupplyQuantity.toLocaleString()} →{" "}
                {parsedValues.maxSupplyQuantity.toLocaleString()} units
              </span>
            </div>

            {/* DEFECT RATE */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
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
                <span className="text-sm font-bold text-gray-900">
                  {defectRatePercent}%
                </span>

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

            {/* LEAD TIME */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
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
                Max Lead Time
              </span>

              <span className="text-sm font-bold text-gray-900">
                {parsedValues.maxLeadTimeDays} days
              </span>
            </div>
          </div>

          {/* WARNING */}
          <div
            className="
              rounded-md
              border
              border-amber-200
              bg-amber-50
              p-4
              text-left
              text-xs
              text-amber-900
            "
          >
            Please verify all quotation parameters carefully before final
            submission.
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
              onClick={() => setOpenConfirm(false)}
              className="
                rounded-md
                bg-white
                px-4
                py-2
                text-sm
                font-medium
                text-gray-500
                transition-colors
                hover:text-gray-700
              "
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleCreate}
              disabled={createQuotation.isPending}
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
                transition-all
                disabled:opacity-40
              "
            >
              {createQuotation.isPending ? "Creating..." : "Confirm Create"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateQuotationButton;
