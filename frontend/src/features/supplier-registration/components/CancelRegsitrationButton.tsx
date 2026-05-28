import { useState } from "react";
import { X } from "lucide-react";
import Modal from "../../../shared/ui/modal/Modal";
import { useCancelRegistration } from "../hooks/use-supplier-registration";

type Props = {
  registrationId: string;
  contractId: string;
};

const CancelRegistrationButton = ({
  registrationId,
  contractId,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const cancelRegistration = useCancelRegistration();

  const handleCancel = async () => {
    await cancelRegistration.mutateAsync({
      id: registrationId,
      contractId,
      reason,
    });

    setOpen(false);
    setReason("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          flex items-center gap-2
          rounded-md bg-white
          px-4 py-2
          text-sm font-medium text-red-700
        "
      >
        <X className="w-4 h-4" />
        Cancel
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Cancel Registration"
      >
        <div className="flex flex-col gap-6">
          <div>
            <label className="text-sm font-medium text-gray-900">
              Reason
            </label>

            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="
                mt-2 w-full rounded-md border
                px-3 py-2 text-sm
              "
            />
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setOpen(false)}>
              Back
            </button>

            <button
              onClick={handleCancel}
              disabled={!reason.trim() || cancelRegistration.isPending}
              className="
                bg-red-700 text-white px-4 py-2 rounded-md
                disabled:opacity-50
              "
            >
              Confirm Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CancelRegistrationButton;