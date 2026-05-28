import { useEffect } from "react";
import { createPortal } from "react-dom";

import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

const Modal = ({ open, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);

      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = "auto";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        p-4
      "
      onMouseDown={onClose}
    >
      {/* OVERLAY */}
      <div
        className="
          absolute
          inset-0
          bg-black/30
          backdrop-blur-sm
        "
      />

      {/* MODAL */}
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="
          relative
          z-50
          w-full
          max-w-xl
          max-h-[90vh]
          overflow-hidden
          rounded-md
          border
          border-gray-200
          bg-white
          shadow-lg
          flex
          flex-col
        "
      >
        {/* HEADER */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b-2
            border-blue-800
            px-6
            py-4
            bg-white
            shrink-0
          "
        >
          <div className="text-left">
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
              {title || "Modal"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="
              w-10
              h-10
              rounded-md
              border
              border-gray-200
              bg-white
              text-gray-500
              flex
              items-center
              justify-center
              shadow-sm
              transition-all
              duration-200
              hover:border-blue-800
              hover:text-blue-800
              hover:bg-blue-50
              hover:shadow-md
              active:scale-[0.98]
            "
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* SCROLL CONTENT */}
        <div
          className="
            flex-1
            overflow-y-auto
            px-6
            py-4
          "
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
