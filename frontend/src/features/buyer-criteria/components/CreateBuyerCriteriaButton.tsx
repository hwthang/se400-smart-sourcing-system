// components/CreateBuyerCriteriaButton.tsx

import { useState } from "react";
import { Plus, Info } from "lucide-react";
import Modal from "../../../shared/ui/modal/Modal";
import { useCreateCriteria } from "../hooks/use-buyer-criteria";

type Props = {
  registration: any;
};

const CreateBuyerCriteriaButton = ({ registration }: Props) => {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    minPurchaseQuantity: 0,
    maxAllocationPercent: "", // Chuyển thành chuỗi để kiểm soát chuỗi nhập từ Regex trực tiếp
  });

  const createCriteria = useCreateCriteria();

  // Regex kiểm tra định dạng số thập phân tối đa 2 chữ số sau dấu phẩy (Ví dụ: 0, 12, 45.5, 100.00)
  const percentRegex = /^(100(\.0{0,2})?|[0-9]{0,2}(\.[0-9]{0,2})?)$/;

  const handlePercentChange = (value: string) => {
    // Nếu ô nhập trống, cho phép xóa để người dùng nhập mới
    if (value === "") {
      setForm((prev) => ({ ...prev, maxAllocationPercent: "" }));
      return;
    }

    // Chỉ cập nhật trạng thái nếu chuỗi nhập khớp chính xác với cấu trúc Regex
    if (percentRegex.test(value)) {
      setForm((prev) => ({ ...prev, maxAllocationPercent: value }));
    }
  };

  const handleSubmit = async () => {
    // Chuyển đổi chuỗi phần trăm về dạng float khi gửi lên API backend
    const finalPercent = parseFloat(form.maxAllocationPercent) || 0;

    await createCriteria.mutateAsync({
      registrationId: registration?.id,
      contractId: registration?.contractId,
      minPurchaseQuantity: form.minPurchaseQuantity,
      maxAllocationPercent: finalPercent, 
    });

    setOpen(false);
    // Khôi phục trạng thái ban đầu sau khi tác vụ hoàn thành
    setForm({ minPurchaseQuantity: 0, maxAllocationPercent: "" });
  };

  return (
    <>
      {/* Nút kích hoạt Modal - Chuẩn Premium Primary Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white font-medium px-4 py-2 rounded-md shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-110 active:scale-[0.98] text-sm"
      >
        <Plus className="w-4 h-4 text-white" strokeWidth={2} />
        <span>Create Criteria</span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Buyer Criteria">
        <div className="flex flex-col gap-5">
          
          {/* 1. MIN PURCHASE QUANTITY (Solid Flat Input Field) */}
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
              placeholder="Enter minimum quantity (e.g., 500)"
              className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-800/20 transition-all"
            />
          </div>

          {/* 2. MAX ALLOCATION PERCENT (Direct Input with Regex validation) */}
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

          {/* 3. SYSTEM HINT BLOCK (Borderless Information Block) */}
          <div className="rounded-md bg-blue-50/50 p-4 text-left space-y-2">
            <div className="flex items-center gap-2 text-blue-800">
              <Info className="w-4 h-4 text-current" strokeWidth={2} />
              <p className="text-xs font-bold uppercase tracking-wide">
                Direct Input System
              </p>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Please enter the percentage value directly using numbers and a decimal point. The system limits the configuration target to a range from <span className="font-semibold text-gray-900">0.00%</span> up to <span className="font-semibold text-gray-900">100.00%</span>.
            </p>
          </div>

          {/* 4. MODAL INTERACTIONS AREA (Flat Footnote Rules) */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setForm({ minPurchaseQuantity: 0, maxAllocationPercent: "" });
              }}
              className="flex items-center justify-center gap-2 bg-white text-blue-800 font-medium px-4 py-2 rounded-md transition-all duration-200 hover:bg-blue-50 active:scale-[0.98] text-sm"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={createCriteria.isPending || !form.maxAllocationPercent}
              className="flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white font-medium px-5 py-2 rounded-md shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98] text-sm disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:pointer-events-none"
            >
              {createCriteria.isPending ? "Creating..." : "Confirm"}
            </button>
          </div>

        </div>
      </Modal>
    </>
  );
};

export default CreateBuyerCriteriaButton;