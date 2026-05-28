import Modal from "../../../shared/ui/modal/Modal";
import { Check, X } from "lucide-react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export const ConfirmModal = ({
  open,
  title,
  children,
  loading,
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4">
        {children}

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-800 border border-blue-800 rounded-md hover:bg-blue-50"
          >
            <X className="w-4 h-4" strokeWidth={2} />
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white rounded-md shadow-sm disabled:opacity-40"
          >
            <Check className="w-4 h-4" strokeWidth={2} />
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};