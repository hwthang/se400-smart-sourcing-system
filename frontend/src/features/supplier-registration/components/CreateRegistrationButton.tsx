// components/CreateRegistrationButton.tsx

import { useState } from "react";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import Modal from "../../../shared/ui/modal/Modal";
import { useCreateRegistration } from "../hooks/use-supplier-registration";
import toast from "react-hot-toast";

type Props = {
  contractId: string;
  contractName?: string;
};

const CreateRegistrationButton = ({ contractId }: Props) => {
  const [open, setOpen] = useState(false);
  const createRegistration = useCreateRegistration();

  const handleCreate = async () => {
    try {
      await createRegistration.mutateAsync({
        contractId,
      });
      toast.success("Registration node submitted successfully");
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit supplier registration");
    }
  };

  const isButtonDisabled = createRegistration.isPending;

  return (
    <>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        disabled={isButtonDisabled}
        onClick={() => setOpen(true)}
        className="
          w-full md:w-auto flex-grow
          bg-white hover:bg-blue-50/80
          text-blue-800 border border-blue-200
          rounded-md px-4 py-2 text-xs font-bold
          shadow-sm transition-all duration-200
          flex items-center justify-center gap-1.5
          disabled:opacity-40 disabled:cursor-not-allowed
          active:scale-[0.99]
        "
      >
        {isButtonDisabled ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
        )}
        Register as Supplier
      </button>

      {/* CONFIRMATION PORTAL MODAL */}
      <Modal
        open={open}
        onClose={() => !isButtonDisabled && setOpen(false)}
        title="Submit Vendor Bidding Node"
      >
        <div className="flex flex-col space-y-4 text-left">
          {/* Business Info Banner */}
          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-md flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                Supplier Commitment Term
              </h4>
              <p className="text-[11px] text-blue-800/90 leading-normal">
                You are connecting your organization identity to this
                procurement gateway. Once registered, your capacity profile will
                lock into the smart optimization pool for upcoming line-item
                quantity allocations.
              </p>
            </div>
          </div>

          {/* Target Metadata Display */}
          <div className="space-y-1.5 px-1 py-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Target Procurement Pipeline
            </div>
            <div className="text-sm font-bold text-blue-900 bg-blue-50/30 border border-blue-100 rounded px-3 py-2">
              {"Unnamed Procurement Instance"}
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed pt-0.5">
              By confirming, you agree to comply with the distribution
              constraints, cost ceilings, and execution milestones specified in
              the master blueprint.
            </p>
          </div>

          {/* Action Control Gateway Footers */}
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4 mt-2">
            <button
              type="button"
              disabled={isButtonDisabled}
              onClick={() => setOpen(false)}
              className="
                px-4 py-2 border border-gray-200 hover:border-gray-300 
                text-gray-600 hover:text-gray-800 text-xs font-bold 
                rounded shadow-sm transition-all bg-white disabled:opacity-40
              "
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isButtonDisabled}
              onClick={handleCreate}
              className="
                px-4 py-2 text-xs font-bold rounded shadow-sm transition-all
                bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 
                hover:from-blue-950 hover:to-indigo-950 text-white 
                flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              {isButtonDisabled ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Registering...
                </>
              ) : (
                "Confirm & Initialize"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateRegistrationButton;
