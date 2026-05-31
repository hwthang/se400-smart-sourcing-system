import React, { useMemo, useState, useEffect } from "react";
import {
  Settings2,
  Scale,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  CornerUpLeft,
} from "lucide-react";
import Modal from "../../../../shared/ui/modal/Modal";
import { useUpdateContract } from "../../hooks/use-contract";

type Props = {
  contractId: string;
  defaultValues?: {
    evaluationWeights?: {
      price: number; // Lưu trữ BPS (0 - 10000) ở Backend
      leadTime: number;
      defect: number;
    };
    penaltyRates?: {
      delay: number; // Lưu trữ dạng ETH (số thực)
      defect: number; // Lưu trữ BPS ở Backend
    };
  };
};

const formatTrailingZeros = (value: number): string => {
  return (+value.toFixed(2)).toString();
};

export const UpdateContractButton: React.FC<Props> = ({
  contractId,
  defaultValues,
}) => {
  const updateMutation = useUpdateContract();

  // =========================================================
  // NAVIGATION & FLOW STATES
  // =========================================================
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // =========================================================
  // FORM PARAMETER STATES
  // =========================================================
  const [weightsInput, setWeightsInput] = useState({
    price: "0",
    leadTime: "0",
    defect: "0",
  });
  const [defectPenaltyInput, setDefectPenaltyInput] = useState<string>("0");
  const [delayInput, setDelayInput] = useState<string>("0");

  // Đồng bộ dữ liệu on-chain/api khi kích hoạt mở Modal
  useEffect(() => {
    if (open && defaultValues) {
      const initWeights = defaultValues.evaluationWeights || {
        price: 0,
        leadTime: 0,
        defect: 0,
      };
      setWeightsInput({
        price: initWeights.price.toString(),
        leadTime: initWeights.leadTime.toString(),
        defect: initWeights.defect.toString(),
      });

      const initDefectPenalty = defaultValues.penaltyRates?.defect || 0;
      setDefectPenaltyInput(initDefectPenalty.toString());

      const initialDelay = defaultValues.penaltyRates?.delay || 0;
      setDelayInput(initialDelay.toString());
    }
  }, [open, defaultValues]);

  // Kiểm tra tổng trọng số đánh giá (Bắt buộc giữ Invariant = 100%)
  const totalWeightPercent = useMemo(() => {
    const p = Number(weightsInput.price) || 0;
    const l = Number(weightsInput.leadTime) || 0;
    const d = Number(weightsInput.defect) || 0;
    return +(p + l + d).toFixed(2);
  }, [weightsInput]);

  const isWeightsValid = totalWeightPercent === 100;

  const isDelayPenaltyValid = useMemo(() => {
    const val = Number(delayInput);
    return val === 0 || val >= 0.0001;
  }, [delayInput]);

  // Form hợp lệ khi trọng số bằng 100% và tiền phạt delay thỏa mãn điều kiện biên
  const isValid = isWeightsValid && isDelayPenaltyValid;
  const isProcessing = updateMutation.isPending;

  // =========================================================
  // HANDLERS & REGEX CONTROL
  // =========================================================

  // Regex kiểm soát số thập phân tối đa 2 chữ số
  const percentRegex = /^\d+(\.\d{0,2})?$/;

  const handleWeightChange = (
    key: "price" | "leadTime" | "defect",
    val: string,
  ) => {
    if (val === "") {
      setWeightsInput((prev) => ({ ...prev, [key]: "" }));
      return;
    }
    // Trọng số đánh giá (Weights) vẫn giữ chặn giới hạn trần <= 100%
    if (percentRegex.test(val) && Number(val) <= 100) {
      setWeightsInput((prev) => ({ ...prev, [key]: val }));
    }
  };

  const handleWeightBlur = (key: "price" | "leadTime" | "defect") => {
    const numericVal = Number(weightsInput[key]);
    if (isNaN(numericVal) || weightsInput[key] === "") {
      setWeightsInput((prev) => ({ ...prev, [key]: "0" }));
    } else {
      setWeightsInput((prev) => ({ ...prev, [key]: numericVal.toString() }));
    }
  };

  const handleDefectPenaltyChange = (val: string) => {
    if (val === "") {
      setDefectPenaltyInput("");
      return;
    }
    // ĐÃ SỬA: Loại bỏ điều kiện `Number(val) <= 100` để cho phép nhập tùy ý (ví dụ: 120%, 300%)
    if (percentRegex.test(val)) {
      setDefectPenaltyInput(val);
    }
  };

  const handleDefectPenaltyBlur = () => {
    const numericVal = Number(defectPenaltyInput);
    if (isNaN(numericVal) || defectPenaltyInput === "") {
      setDefectPenaltyInput("0");
    } else {
      setDefectPenaltyInput(numericVal.toString());
    }
  };

  const handleDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setDelayInput("");
      return;
    }
    const decimalRegex = /^\d+(\.\d{0,4})?$/;
    if (decimalRegex.test(val)) {
      setDelayInput(val);
    }
  };

  const handleDelayBlur = () => {
    const numericVal = Number(delayInput);
    if (numericVal > 0 && numericVal < 0.0001) {
      setDelayInput("0.0001");
    } else if (isNaN(numericVal) || delayInput === "") {
      setDelayInput("0");
    }
  };

  const handleSubmitStep = () => {
    if (!isValid) return;
    setOpen(false);
    setConfirmOpen(true);
  };

  const handleConfirmFinal = () => {
    updateMutation.mutate(
      {
        id: contractId,
        data: {
          evaluationWeights: {
            price: Number(weightsInput.price),
            leadTime: Number(weightsInput.leadTime),
            defect: Number(weightsInput.defect),
          },
          penaltyRates: {
            delay: Number(delayInput),
            defect: Number(defectPenaltyInput),
          },
        },
      },
      {
        onSuccess: () => {
          setConfirmOpen(false);
        },
      },
    );
  };

  return (
    <>
      {/* TRIGGER CONTROL */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 rounded-md bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:brightness-110 hover:shadow-md active:scale-[0.98]"
      >
        <Settings2 className="w-4 h-4 text-white" />
        <span>Update Contract</span>
      </button>

      {/* STEP 1: CONFIGURATION MODAL */}
      <Modal
        open={open}
        onClose={() => !isProcessing && setOpen(false)}
        title="Update Procurement Criteria"
      >
        <div className="space-y-5 text-left font-sans">
          {/* SECTION A: EVALUATION WEIGHTS */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 pb-2">
              <Scale className="w-4 h-4 text-blue-800" />
              <h4 className="text-sm font-bold text-gray-900">
                Automated Evaluation Weights
              </h4>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Define the impact matrix below. The total allocation sum across
              all variables must strictly equal **100.00%**.
            </p>

            <div className="space-y-3">
              {(["price", "leadTime", "defect"] as const).map((key) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center px-0.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      {key === "leadTime" ? "Lead Time Weight" : `${key} Weight`}
                    </label>
                    <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
                      {formatTrailingZeros(Number(weightsInput[key]) || 0)}%
                    </span>
                  </div>

                  <input
                    type="text"
                    inputMode="decimal"
                    value={weightsInput[key]}
                    onChange={(e) => handleWeightChange(key, e.target.value)}
                    onBlur={() => handleWeightBlur(key)}
                    placeholder="0.00"
                    className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-md px-4 py-2.5 text-sm font-mono shadow-2xs border border-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-800/10 transition-all"
                  />
                </div>
              ))}
            </div>

            {/* LIVE KPI TOTAL AUDITOR */}
            <div
              className={`flex items-center justify-between rounded-md p-3 text-xs font-bold transition-all ${
                isWeightsValid
                  ? "bg-emerald-50/60 text-emerald-800"
                  : "bg-rose-50/60 text-rose-700"
              }`}
            >
              <span className="uppercase tracking-wider">
                Total Aggregated Configuration:
              </span>
              <span className="font-mono text-sm">
                {formatTrailingZeros(totalWeightPercent)}% / 100%
              </span>
            </div>
          </div>

          {/* SECTION B: PENALTY MATRIX */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-2 pb-2">
              <ShieldAlert className="w-4 h-4 text-blue-800" />
              <h4 className="text-sm font-bold text-gray-900">
                SLA Penalty Configurations
              </h4>
            </div>

            {/* DELAY PENALTY */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center px-0.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Delay Penalty Rate{" "}
                  <span className="normal-case text-gray-400 font-medium">
                    (ETH / day delayed)
                  </span>
                </label>
                {!isDelayPenaltyValid && (
                  <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    Min limit: 0.0001 ETH
                  </span>
                )}
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={delayInput}
                onChange={handleDelayChange}
                onBlur={handleDelayBlur}
                placeholder="0.0000"
                className={`w-full bg-white text-gray-900 placeholder-gray-400 rounded-md px-4 py-2.5 text-sm font-mono shadow-2xs border border-gray-100 transition-all focus:outline-none focus:ring-4 ${
                  !isDelayPenaltyValid
                    ? "focus:ring-rose-500/10 border-rose-500"
                    : "focus:ring-blue-800/10"
                }`}
              />
              <span className="text-[10px] text-gray-400 italic px-0.5">
                Accepts 0 or a minimum of 0.0001 ETH. Maximum of 4 decimal places allowed.
              </span>
            </div>

            {/* DEFECT PENALTY - ĐÃ GỠ BỎ GIỚI HẠN CHẶN TRẦN 100% */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center px-0.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Total Defect Penalty Rate{" "}
                  <span className="normal-case text-gray-400 font-medium">
                    (% per defective unit)
                  </span>
                </label>
                <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
                  {formatTrailingZeros(Number(defectPenaltyInput) || 0)}%
                </span>
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={defectPenaltyInput}
                onChange={(e) => handleDefectPenaltyChange(e.target.value)}
                onBlur={handleDefectPenaltyBlur}
                placeholder="0.00"
                className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-md px-4 py-2.5 text-sm font-mono shadow-2xs border border-gray-100 transition-all focus:outline-none focus:ring-4 focus:ring-blue-800/10"
              />
              <span className="text-[10px] text-gray-400 italic px-0.5">
                Accepts any positive percentage value with up to 2 decimal places (Uncapped multiplier).
              </span>
            </div>
          </div>

          {/* FORM NAVIGATION ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 bg-white text-blue-800 font-medium px-4 py-2 rounded-md transition-all duration-200 hover:bg-blue-50 active:scale-[0.98] text-sm w-full sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!isValid}
              onClick={handleSubmitStep}
              className="flex items-center justify-center gap-2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white font-medium px-5 py-2 rounded-md shadow-2xs transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none text-sm w-full sm:w-auto"
            >
              <span>Verify & Next</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </Modal>

      {/* STEP 2: AUDIT & CONFIRMATION MODAL */}
      <Modal
        open={confirmOpen}
        onClose={() => !isProcessing && setConfirmOpen(false)}
        title="Confirm Governance Parameters"
      >
        <div className="space-y-5 text-left font-sans">
          <div className="bg-gradient-to-br from-white to-blue-50/20 rounded-md p-4 shadow-2xs border border-gray-100/70 space-y-3">
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">
              Immutable Blueprint Preview
            </p>

            <div className="space-y-2.5 pt-1 text-sm">
              <div className="flex justify-between items-center pb-2">
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Calculated Weight Weightage:
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-emerald-50 text-emerald-800">
                  {formatTrailingZeros(totalWeightPercent)}% Check Passed
                </span>
              </div>

              {/* WEIGHTS BREAKDOWN PREVIEW */}
              <div className="pl-3 border-l-2 border-gray-100 space-y-1.5 my-2 text-xs text-gray-500 font-mono">
                <div className="flex justify-between">
                  <span>• Price Weight:</span>
                  <span className="font-bold text-gray-900">
                    {formatTrailingZeros(Number(weightsInput.price) || 0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>• Lead Time Weight:</span>
                  <span className="font-bold text-gray-900">
                    {formatTrailingZeros(Number(weightsInput.leadTime) || 0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>• Defect Weight:</span>
                  <span className="font-bold text-gray-900">
                    {formatTrailingZeros(Number(weightsInput.defect) || 0)}%
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pb-2 border-t border-dashed border-gray-100 pt-2">
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Delay Penalty:
                </span>
                <span className="font-mono font-bold text-gray-900">
                  {+Number(delayInput).toFixed(4)}{" "}
                  <span className="text-xs text-gray-400 font-medium font-sans">
                    ETH / day
                  </span>
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Total Defect Penalty:
                </span>
                {/* Đang render preview giá trị vô cấp mượt mà */}
                <span className="font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
                  {formatTrailingZeros(Number(defectPenaltyInput) || 0)}%{" "}
                  <span className="text-xs text-gray-400 font-normal font-sans lowercase">
                    per unit
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* CONFIRM CONTROLS */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => {
                setConfirmOpen(false);
                setOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-white text-blue-800 font-medium px-4 py-2 rounded-md transition-all duration-200 hover:bg-blue-50 active:scale-[0.98] text-sm w-full sm:w-auto disabled:opacity-30"
            >
              <CornerUpLeft className="w-4 h-4 text-blue-800" />
              <span>Back to Edit</span>
            </button>

            <button
              type="button"
              onClick={handleConfirmFinal}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white font-bold px-5 py-2 rounded-md shadow-2xs transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none text-sm w-full sm:w-auto"
            >
              {isProcessing ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  <span>Sealing Contract...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};