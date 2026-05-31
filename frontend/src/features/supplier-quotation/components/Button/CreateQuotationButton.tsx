import React, { useMemo, useState } from "react";
import { ClipboardPlus, CircleDollarSign, Boxes, Truck, ShieldCheck, ArrowRight, CornerUpLeft } from "lucide-react";
import Modal from "../../../../shared/ui/modal/Modal";
import { useCreateQuotation } from "../../hooks/use-supplier-quotation";

type Props = {
  registration: any;
};

// Hàm tiện ích: Loại bỏ chữ số 0 thừa ở cuối phần thập phân khi hiển thị (ví dụ: 2.50 -> 2.5, 5.00 -> 5)
const formatTrailingZeros = (value: number): string => {
  return (+value.toFixed(4)).toString();
};

const CreateQuotationButton = ({ registration }: Props) => {
  const createQuotation = useCreateQuotation();

  // =========================================================
  // NAVIGATION & FLOW STATES
  // =========================================================
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  // =========================================================
  // FORM PARAMETER STATES (Sử dụng string để tối ưu trải nghiệm gõ số thập phân)
  // =========================================================
  const [form, setForm] = useState({
    unitPriceEth: "",        // Nhập ETH dạng chuỗi thô (Ví dụ: "0.05")
    minSupplyQuantity: "",
    maxSupplyQuantity: "",
    maxDefectRate: "",       // Nhập % dạng chuỗi thô (Ví dụ: "2.5")
    maxLeadTimeDays: "",
  });

  // =========================================================
  // VALIDATION & REGEX PATTERNS
  // =========================================================
  const percentRegex = /^\d+(\.\d{0,2})?$/;  // Tối đa 2 chữ số thập phân cho tỷ lệ %
  const ethRegex = /^\d+(\.\d{0,4})?$/;      // Tối đa 4 chữ số thập phân cho ETH (bước nhảy 0.0001)

  const isEthValid = useMemo(() => {
    const val = Number(form.unitPriceEth);
    return form.unitPriceEth !== "" && !isNaN(val) && val >= 0;
  }, [form.unitPriceEth]);

  const isDefectRateValid = useMemo(() => {
    const val = Number(form.maxDefectRate);
    return form.maxDefectRate !== "" && !isNaN(val) && val >= 0 && val <= 100;
  }, [form.maxDefectRate]);

  const isFormValid = useMemo(() => {
    return (
      isEthValid &&
      isDefectRateValid &&
      form.minSupplyQuantity !== "" &&
      form.maxSupplyQuantity !== "" &&
      form.maxLeadTimeDays !== "" &&
      Number(form.maxSupplyQuantity) >= Number(form.minSupplyQuantity)
    );
  }, [form, isEthValid, isDefectRateValid]);

  // =========================================================
  // INPUT HANDLERS (Kiểm soát đầu vào thời gian thực)
  // =========================================================
  const handleEthChange = (val: string) => {
    if (val === "") {
      setForm((prev) => ({ ...prev, unitPriceEth: "" }));
      return;
    }
    if (ethRegex.test(val)) {
      setForm((prev) => ({ ...prev, unitPriceEth: val }));
    }
  };

  const handleEthBlur = () => {
    const numericVal = Number(form.unitPriceEth);
    if (isNaN(numericVal) || form.unitPriceEth === "") {
      setForm((prev) => ({ ...prev, unitPriceEth: "0" }));
    } else {
      setForm((prev) => ({ ...prev, unitPriceEth: numericVal.toString() }));
    }
  };

  const handleDefectChange = (val: string) => {
    if (val === "") {
      setForm((prev) => ({ ...prev, maxDefectRate: "" }));
      return;
    }
    if (percentRegex.test(val) && Number(val) <= 100) {
      setForm((prev) => ({ ...prev, maxDefectRate: val }));
    }
  };

  const handleDefectBlur = () => {
    const numericVal = Number(form.maxDefectRate);
    if (isNaN(numericVal) || form.maxDefectRate === "") {
      setForm((prev) => ({ ...prev, maxDefectRate: "0" }));
    } else {
      setForm((prev) => ({ ...prev, maxDefectRate: numericVal.toString() }));
    }
  };

  // =========================================================
  // SUBMISSION LOGIC (Gửi RAW dữ liệu không qua chia tách)
  // =========================================================
  const handleCreate = () => {
    if (!isFormValid) return;

    createQuotation.mutate(
      {
        registrationId: registration.id,
        contractId: registration.contractId,
        unitPrice: Number(form.unitPriceEth) || 0, // Gửi số thực raw của ETH
        minSupplyQuantity: Number(form.minSupplyQuantity) || 0,
        maxSupplyQuantity: Number(form.maxSupplyQuantity) || 0,
        maxDefectRate: Number(form.maxDefectRate) || 0, // Gửi raw phần trăm thu được từ ô nhập
        maxLeadTimeDays: Number(form.maxLeadTimeDays) || 0,
      },
      {
        onSuccess: () => {
          setOpenConfirm(false);
          setOpenForm(false);
          setForm({
            unitPriceEth: "",
            minSupplyQuantity: "",
            maxSupplyQuantity: "",
            maxDefectRate: "",
            maxLeadTimeDays: "",
          });
        },
      }
    );
  };

  // =========================================================
  // UI STYLES
  // =========================================================
  const inputClass = `w-full bg-white text-gray-900 placeholder-gray-400 rounded-md px-4 py-2.5 text-sm font-mono border border-gray-200 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-800/10 focus:border-blue-800`;
  const cardClass = `rounded-md bg-gradient-to-br from-white to-blue-50/40 p-4 border border-slate-100 shadow-sm space-y-2.5 text-left`;

  return (
    <>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setOpenForm(true)}
        className="flex items-center gap-2 rounded-md bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:brightness-110 hover:shadow-md active:scale-[0.98]"
      >
        <ClipboardPlus className="w-4 h-4" />
        <span>Create Quotation</span>
      </button>

      {/* STEP 1: INPUT FORM MODAL */}
      <Modal open={openForm} onClose={() => setOpenForm(false)} title="Create Supplier Quotation">
        <div className="space-y-5">
          <div className="rounded-md border border-blue-100 bg-blue-50/60 p-4 text-left space-y-1">
            <p className="text-sm font-bold text-blue-900">Supplier Commercial Proposal</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Configure supplier commercial conditions, manufacturing tolerance, and logistics capability before submitting the quotation proposal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* UNIT PRICE (ETH) */}
            <div className={`${cardClass} md:col-span-2`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="w-4 h-4 text-blue-800" />
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Unit Price (ETH)</label>
                </div>
                <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
                  {formatTrailingZeros(Number(form.unitPriceEth) || 0)} ETH
                </span>
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={form.unitPriceEth}
                onChange={(e) => handleEthChange(e.target.value)}
                onBlur={handleEthBlur}
                className={inputClass}
                placeholder="0.0000"
              />
              <span className="text-[10px] text-gray-400 italic block">
                Accepts standard ether values. Maximum of 4 decimal places allowed.
              </span>
            </div>

            {/* MIN SUPPLY QUANTITY */}
            <div className={cardClass}>
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-blue-800" />
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Min Supply Quantity</label>
              </div>
              <input
                type="number"
                min={0}
                value={form.minSupplyQuantity}
                onChange={(e) => setForm((prev) => ({ ...prev, minSupplyQuantity: e.target.value }))}
                className={inputClass}
                placeholder="100"
              />
            </div>

            {/* MAX SUPPLY QUANTITY */}
            <div className={cardClass}>
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-blue-800" />
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Max Supply Quantity</label>
              </div>
              <input
                type="number"
                min={0}
                value={form.maxSupplyQuantity}
                onChange={(e) => setForm((prev) => ({ ...prev, maxSupplyQuantity: e.target.value }))}
                className={inputClass}
                placeholder="5000"
              />
            </div>

            {/* MAX DEFECT RATE (%) */}
            <div className={`${cardClass} md:col-span-2`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-800" />
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Max Defect Rate (%)</label>
                </div>
                <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
                  {formatTrailingZeros(Number(form.maxDefectRate) || 0)}%
                </span>
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={form.maxDefectRate}
                onChange={(e) => handleDefectChange(e.target.value)}
                onBlur={handleDefectBlur}
                className={inputClass}
                placeholder="0.00"
              />
              <span className="text-[10px] text-gray-400 italic block">
                Accepts a max of 100% with up to 2 decimal places. Submitted raw to backend.
              </span>
            </div>

            {/* MAX LEAD TIME DAYS */}
            <div className={`${cardClass} md:col-span-2`}>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-800" />
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Max Lead Time (Days)</label>
              </div>
              <input
                type="number"
                min={0}
                value={form.maxLeadTimeDays}
                onChange={(e) => setForm((prev) => ({ ...prev, maxLeadTimeDays: e.target.value }))}
                className={inputClass}
                placeholder="30"
              />
            </div>
          </div>

          {/* FORM FOOTER NAV */}
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => setOpenForm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!isFormValid}
              onClick={() => { setOpenForm(false); setOpenConfirm(true); }}
              className="flex items-center gap-2 rounded-md bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none"
            >
              <span>Verify & Next</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </Modal>

      {/* STEP 2: PREVIEW & CONFIRMATION MODAL */}
      <Modal open={openConfirm} onClose={() => setOpenConfirm(false)} title="Confirm Quotation Creation">
        <div className="space-y-5">
          <div className="rounded-md border border-slate-100 bg-slate-50 p-4 text-left space-y-3 font-sans">
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">Quotation Blueprint Review</p>
            
            <div className="space-y-2.5 text-sm">
              {/* PRICE */}
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 py-1.5">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Unit Price</span>
                <span className="font-mono font-black text-gray-900">
                  {formatTrailingZeros(Number(form.unitPriceEth) || 0)} <span className="text-xs font-normal text-gray-500">ETH</span>
                </span>
              </div>

              {/* SUPPLY RANGE */}
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 py-1.5">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Supply Range</span>
                <span className="font-mono font-bold text-gray-900">
                  {Number(form.minSupplyQuantity).toLocaleString()} → {Number(form.maxSupplyQuantity).toLocaleString()} <span className="text-xs font-normal text-gray-500">units</span>
                </span>
              </div>

              {/* DEFECT RATE */}
              <div className="flex justify-between items-center border-b border-dashed border-slate-200 py-1.5">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Max Defect Rate</span>
                <span className="font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
                  {formatTrailingZeros(Number(form.maxDefectRate) || 0)}%
                </span>
              </div>

              {/* LEAD TIME */}
              <div className="flex justify-between items-center py-1.5">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Max Lead Time</span>
                <span className="font-mono font-bold text-gray-900">
                  {form.maxLeadTimeDays} <span className="text-xs font-normal text-gray-500">days</span>
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-left text-xs text-amber-900">
            Please verify all quotation parameters carefully before final submission to the Smart Sourcing engine.
          </div>

          {/* FINAL ACTIONS */}
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              disabled={createQuotation.isPending}
              onClick={() => { setOpenConfirm(false); setOpenForm(true); }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-800 bg-white rounded-md hover:bg-blue-50 transition-all"
            >
              <CornerUpLeft className="w-4 h-4" />
              <span>Back to Edit</span>
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={createQuotation.isPending}
              className="rounded-md bg-gradient-to-br from-blue-900 to-indigo-900 px-5 py-2 text-sm font-bold text-white shadow-sm transition-all hover:brightness-110 disabled:opacity-40"
            >
              {createQuotation.isPending ? "Sealing Proposal..." : "Confirm & Submit"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateQuotationButton;