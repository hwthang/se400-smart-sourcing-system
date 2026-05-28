// components/Button/UpdateContractButton.tsx

import React, { useMemo, useState, useEffect } from "react";
import { Settings2, Scale, ShieldAlert, CheckCircle2, ArrowRight, CornerUpLeft } from "lucide-react";
import Modal from "../../../../shared/ui/modal/Modal";
import { useUpdateContract } from "../../hooks/use-contract";

type Props = {
  contractId: string;
  defaultValues?: {
    evaluationWeights?: {
      price: number;
      leadTime: number;
      defect: number;
    };
    penaltyRates?: {
      delay: number;
      defect: number;
    };
  };
};

// Utilities for basis point (bps) conversion (0 - 10000 => 0.00% - 100.00%)
const clamp = (v: number) => Math.max(0, Math.min(10000, v || 0));
const formatPercent = (v: number) => ((v / 10000) * 100).toFixed(2);
const formatBpsToPercent = (v: number) => (v / 100).toFixed(2);

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
  const [weights, setWeights] = useState({ price: 0, leadTime: 0, defect: 0 });
  const [penalty, setPenalty] = useState({ delay: 0, defect: 0 });

  // Sync state cleanly whenever the modal triggers or parameters change downstream
  useEffect(() => {
    if (open && defaultValues) {
      setWeights(
        defaultValues.evaluationWeights || { price: 0, leadTime: 0, defect: 0 }
      );
      setPenalty(
        defaultValues.penaltyRates || { delay: 0, defect: 0 }
      );
    }
  }, [open, defaultValues]);

  const totalWeight = useMemo(
    () => weights.price + weights.leadTime + weights.defect,
    [weights]
  );

  const isValid = totalWeight === 10000;
  const isProcessing = updateMutation.isPending;

  // =========================================================
  // HANDLERS
  // =========================================================
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
          evaluationWeights: weights,
          penaltyRates: penalty,
        },
      },
      {
        onSuccess: () => {
          setConfirmOpen(false);
        },
      }
    );
  };

  return (
    <>
      {/* TRIGGER CONTROL */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          flex items-center justify-center gap-2 rounded-md bg-gradient-to-br
          from-blue-900 to-indigo-900 px-4 py-2 text-xs
          font-medium text-white shadow-sm transition-all duration-200
          hover:brightness-110 hover:shadow-md active:scale-[0.98]
        "
      >
        <Settings2 className="w-4 h-4" strokeWidth={2} />
        <span>Update Contract</span>
      </button>

      {/* STEP 1: PARAMETER CONFIGURATION MODAL */}
      <Modal
        open={open}
        onClose={() => !isProcessing && setOpen(false)}
        title="Update Procurement Criteria"
      >
        <div className="space-y-5 text-left font-sans">
          {/* SECTION A: EVALUATION WEIGHTS */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <Scale className="w-4 h-4 text-blue-800" />
              <h4 className="text-sm font-bold text-slate-800">
                Automated Evaluation Weights
              </h4>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Define the impact matrix below. The total allocation sum across all variables must strictly equal **100.00%** ($10000$ basis points).
            </p>

            <div className="space-y-3">
              {(["price", "leadTime", "defect"] as const).map((key) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center px-0.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      {key === "leadTime" ? "Lead Time Weight" : `${key} Weight`}
                    </label>
                    <span className="text-xs font-mono font-bold text-blue-950 bg-blue-50 px-2 py-0.5 rounded border border-blue-100/50">
                      {formatPercent(weights[key])}%
                    </span>
                  </div>

                  <input
                    type="number"
                    min={0}
                    max={10000}
                    value={weights[key] || ""}
                    onChange={(e) =>
                      setWeights({
                        ...weights,
                        [key]: clamp(Number(e.target.value)),
                      })
                    }
                    placeholder="Basis Points (e.g., 4000)"
                    className="
                      w-full rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-mono text-gray-900 shadow-sm
                      transition-all focus:outline-none focus:ring-4 focus:ring-blue-800/10 focus:border-blue-800
                    "
                  />
                </div>
              ))}
            </div>

            {/* LIVE KPI TOTAL AUDITOR */}
            <div
              className={`flex items-center justify-between rounded-md border p-3 text-xs font-bold transition-colors ${
                isValid
                  ? "border-emerald-200 bg-emerald-50/60 text-emerald-800"
                  : "border-rose-200 bg-rose-50/60 text-rose-700"
              }`}
            >
              <span className="uppercase tracking-wider">Total Aggregated Configuration:</span>
              <span className="font-mono text-sm">
                {totalWeight} / 10000 ({formatPercent(totalWeight)}%)
              </span>
            </div>
          </div>

          {/* SECTION B: PENALTY MATRIX */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <h4 className="text-sm font-bold text-slate-800">
                SLA Penalty Configurations
              </h4>
            </div>

            {/* DELAY PENALTY */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Delay Penalty Rate <span className="normal-case text-gray-400 font-medium">(wei / day delayed)</span>
              </label>
              <input
                type="number"
                min={0}
                value={penalty.delay || ""}
                onChange={(e) =>
                  setPenalty({
                    ...penalty,
                    delay: Math.max(0, Number(e.target.value)),
                  })
                }
                placeholder="0"
                className="
                  w-full rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-mono text-gray-900 shadow-sm
                  transition-all focus:outline-none focus:ring-4 focus:ring-blue-800/10 focus:border-blue-800
                "
              />
            </div>

            {/* DEFECT PENALTY (UPDATED TO % BASIS POINTS) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center px-0.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Total Defect Penalty Rate <span className="normal-case text-gray-400 font-medium">(0 - 10000 BPS)</span>
                </label>
                <span className="text-xs font-mono font-bold text-amber-950 bg-amber-50 px-2 py-0.5 rounded border border-amber-100/50">
                  {formatBpsToPercent(penalty.defect)}%
                </span>
              </div>
              <input
                type="number"
                min={0}
                max={10000}
                value={penalty.defect || ""}
                onChange={(e) =>
                  setPenalty({
                    ...penalty,
                    defect: clamp(Number(e.target.value)),
                  })
                }
                placeholder="Basis Points (e.g., 250 = 2.50%)"
                className="
                  w-full rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-mono text-gray-900 shadow-sm
                  transition-all focus:outline-none focus:ring-4 focus:ring-blue-800/10 focus:border-blue-800
                "
              />
              <span className="text-[10px] text-gray-400 italic px-0.5">
                Fixed cumulative penalty rate applied per individual defective unit detected.
              </span>
            </div>
          </div>

          {/* FORM NAVIGATION ACTIONS */}
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!isValid}
              onClick={handleSubmitStep}
              className="
                flex items-center gap-1.5 rounded-md bg-gradient-to-br from-blue-900 to-indigo-900 
                px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:brightness-110
                disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
              "
            >
              <span>Verify & Next</span>
              <ArrowRight className="w-4 h-4" />
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
          
          <div className="rounded-md border border-blue-100 bg-blue-50/50 p-4 space-y-3">
            <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">
              Immutable Blueprint Preview
            </p>

            <div className="space-y-2.5 border-t border-blue-100/70 pt-2.5 text-sm">
              <div className="flex justify-between items-center border-b border-dashed border-blue-100 pb-2">
                <span className="text-xs text-slate-500 uppercase tracking-wider">Calculated Weight Weightage:</span>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded border border-emerald-200/50">
                  {formatPercent(totalWeight)}% Check Passed
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-dashed border-blue-100 pb-2">
                <span className="text-xs text-slate-500 uppercase tracking-wider">Delay Penalty:</span>
                <span className="font-mono font-black text-slate-800">
                  {Number(penalty.delay).toLocaleString()} <span className="text-xs text-gray-400 font-medium">wei/day</span>
                </span>
              </div>
              {/* UPDATED TO TOTAL DEFECT PENALTY RATE PREVIEW */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 uppercase tracking-wider">Total Defect Penalty:</span>
                <span className="font-mono font-black text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
                  {formatBpsToPercent(penalty.defect)}% <span className="text-xs text-gray-400 font-normal font-sans lowercase">per defective unit</span>
                </span>
              </div>
            </div>
          </div>

          {/* CONFIRM CONTROLS */}
          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => {
                setConfirmOpen(false);
                setOpen(true); // Return safely to Step 1 preserving changes
              }}
              className="
                flex items-center gap-1.5 rounded-md bg-white border border-gray-200 
                px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              <CornerUpLeft className="w-4 h-4" />
              <span>Back to Edit</span>
            </button>

            <button
              type="button"
              onClick={handleConfirmFinal}
              disabled={isProcessing}
              className="
                rounded-md bg-gradient-to-br from-emerald-700 to-emerald-600 px-5 py-2 text-sm
                font-bold text-white shadow-sm transition-all hover:brightness-110
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5
              "
            >
              {isProcessing ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                  <span>Sealing Contract...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
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