import Modal from "./Modal";
type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function LeaveConfirmModal({
  open,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal open={open} onClose={onCancel} title="Discard changes?">
      <div className="flex flex-col gap-4">
        <div className="border border-black p-4 bg-yellow-50">
          <p className="text-center">You have unsaved changes.</p>
          <p className="text-center text-sm text-gray-600 mt-2">
            Do you want to leave this page?
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="border border-black px-5 py-2 hover:border-2 transition-all"
          >
            Stay
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="border border-black px-5 py-2 hover:border-2 hover:bg-red-50 transition-all"
          >
            Leave
          </button>
        </div>
      </div>
    </Modal>
  );
}
