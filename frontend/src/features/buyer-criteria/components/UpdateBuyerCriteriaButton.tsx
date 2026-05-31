// components/UpdateBuyerCriteriaButton.tsx

import { useState, useEffect } from "react";
import { Pencil, Info } from "lucide-react";
import Modal from "../../../shared/ui/modal/Modal";
import { useUpdateCriteria } from "../hooks/use-buyer-criteria";

type Props = {
  criteriaId: string;
  contractId: string;
  defaultValues?: {
    minPurchaseQuantity?: number;
    maxAllocationPercent?: number;
  };
};

const UpdateBuyerCriteriaButton = ({
  criteriaId,
  contractId,
  defaultValues,
}: Props) => {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    minPurchaseQuantity: 0,
    maxAllocationPercent: "", // Quản lý dạng chuỗi để kiểm soát chuỗi nhập từ Regex trực tiếp
  });

  const updateCriteria = useUpdateCriteria();

  // Regex kiểm tra định dạng số thập phân trực tiếp từ 0.00 đến 100.00
  const percentRegex = /^(100(\.0{0,2})?|[0-9]{0,2}(\.[0-9]{0,2})?)$/;

  // Đồng bộ lại dữ liệu form mỗi khi mở Modal hoặc dữ liệu mặc định được tải xong
  useEffect(() => {
    if (open && defaultValues) {
      setForm({
        minPurchaseQuantity: defaultValues.minPurchaseQuantity || 0,
        // Ép kiểu số mặc định từ DB sang chuỗi hiển thị trực tiếp (Không chia cơ số)
        maxAllocationPercent: defaultValues.maxAllocationPercent !== undefined 
          ? String(defaultValues.maxAllocationPercent) 
          : "",
      });
    }
  }, [open, defaultValues]);

  const handlePercentChange = (value: string) => {
    if (value === "") {
      setForm((prev) => ({ ...prev, maxAllocationPercent: "" }));
      return;
    }

    if (percentRegex.test(value)) {
      setForm((prev) => ({ ...prev, maxAllocationPercent: value }));
    }
  };

  const handleSubmit = async () => {
    const finalPercent = parseFloat(form.maxAllocationPercent) || 0;

    await updateCriteria.mutateAsync({
      id: criteriaId,
      contractId,
      data: {
        minPurchaseQuantity: form.minPurchaseQuantity,
        maxAllocationPercent: finalPercent,
      },
    });

    setOpen(false);
  };

  return (
    <>
      {/* TRIGGER BUTTON - Chuẩn Secondary Button phẳng không viền cứng */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 bg-white text-blue-800 font-medium px-4 py-2 rounded-md shadow-sm transition-all duration-200 hover:bg-blue-50 hover:shadow-md active:scale-[0.98] text-sm"
      >
        <Pencil className="w-4 h-4 text-current" strokeWidth={2} />
        <span>Update Criteria</span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Update Buyer Criteria">
        <div className="flex flex-col gap-5">
          
          {/* 1. MIN PURCHASE QUANTITY */}
          <div className="text-left space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Minimum Purchase Quantity
            </label>
            <input
              type="number"
              min={0}
              value={form.minPurchaseQuantity || ""}
              onChange={(e) => {
                const val = Math.max(0, Number(e.target.value));
                setForm((prev) => ({ ...prev, minPurchaseQuantity: val }));
              }}
              placeholder="Enter minimum quantity"
              className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-800/20 transition-all"
            />
          </div>

          {/* 2. MAX ALLOCATION PERCENT (Nhập thẳng không quy đổi) */}
          <div className="text-left space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Max Allocation Percent (%)
            </label>
            <div className="relative">
              <input
                type="text"
                value={form.maxAllocationPercent}
                onChange={(e) => handlePercentChange(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md pl-4 pr-8 py-2.5 text-sm font-mono shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-800/20 transition-all"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm font-mono font-bold text-gray-500 pointer-events-none">
                %
              </span>
            </div>
          </div>

          {/* 3. SYSTEM HINT BLOCK (Khối phẳng nhạt, loại bỏ border) */}
          <div className="rounded-md bg-blue-50/50 p-4 text-left space-y-2">
            <div className="flex items-center gap-2 text-blue-800">
              <Info className="w-4 h-4 text-current" strokeWidth={2} />
              <p className="text-xs font-bold uppercase tracking-wide">
                Direct Parameter Modifiers
              </p>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Modifying these values updates the active parameters on the staging layer. The configuration boundaries remain bounded strictly between <span className="font-semibold text-gray-900">0.00%</span> and <span className="font-semibold text-gray-900">100.00%</span>.
            </p>
          </div>

          {/* 4. ACTIONS AREA */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center bg-white text-blue-800 font-medium px-4 py-2 rounded-md transition-all duration-200 hover:bg-blue-50 active:scale-[0.98] text-sm"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={updateCriteria.isPending || !form.maxAllocationPercent}
              className="flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white font-medium px-5 py-2 rounded-md shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98] text-sm disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:pointer-events-none"
            >
              {updateCriteria.isPending ? "Updating..." : "Confirm"}
            </button>
          </div>

        </div>
      </Modal>
    </>
  );
};

export default UpdateBuyerCriteriaButton;