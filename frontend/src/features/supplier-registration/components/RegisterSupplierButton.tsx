import React, { useState } from "react";

import { UserPlus, AlertTriangle } from "lucide-react";
import { useProcurement } from "../../../core/blockchain/hooks/useProcurement";
import { useRegisterSupplier } from "../../contract/hooks/use-contract";
import Modal from "../../../shared/ui/modal/Modal";

type Props = {
  registration: any;
  contract: any;
};

const RegisterSupplierButton = ({ registration, contract }: Props) => {
  // =========================================================
  // SMART CONTRACT
  // =========================================================
  const { registerSupplier } = useProcurement(contract?.address);

  // =========================================================
  // BACKEND
  // =========================================================
  const registerSupplierApi = useRegisterSupplier();

  // =========================================================
  // STATE
  // =========================================================
  const [openConfirm, setOpenConfirm] = useState(false);

  // =========================================================
  // HANDLER
  // =========================================================
  const handleConfirm = async () => {
    try {
      // =====================================================
      // 1. SEND BLOCKCHAIN TX
      // =====================================================
      const txHash = await registerSupplier.mutateAsync(
        registration?.supplier?.walletAddress,
      );

      // =====================================================
      // 2. UPDATE BACKEND
      // =====================================================
      await registerSupplierApi.mutateAsync({
        id: contract.id,

        data: {
          contractAddress: contract.address,

          txHash,
        },
      });

      setOpenConfirm(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* BUTTON */}
      <button
        type="button"
        onClick={() => setOpenConfirm(true)}
        className="
          flex
          items-center
          gap-2
          rounded-md
          bg-gradient-to-br
          from-blue-900
          via-blue-800
          to-indigo-900
          px-4
          py-2
          text-sm
          font-medium
          text-white
          shadow-sm
          transition-all
          duration-200
          hover:brightness-110
          hover:shadow-md
          active:scale-[0.98]
        "
      >
        <UserPlus className="w-4 h-4" strokeWidth={2} />
        Register Supplier
      </button>

      {/* CONFIRM MODAL */}
      <Modal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Confirm Supplier Registration"
      >
        <div className="space-y-6">
          {/* INFO */}
          <div
            className="
              rounded-md
              border
              border-amber-200
              bg-amber-50
              p-4
              space-y-3
            "
          >
            <div className="flex items-start gap-2">
              <AlertTriangle
                className="
                  w-4
                  h-4
                  text-amber-700
                  mt-0.5
                "
                strokeWidth={2}
              />

              <div className="space-y-1">
                <p
                  className="
                    text-sm
                    font-semibold
                    text-amber-900
                  "
                >
                  Blockchain Supplier Registration
                </p>

                <p
                  className="
                    text-xs
                    leading-relaxed
                    text-amber-800
                  "
                >
                  This action will register the supplier wallet into the
                  procurement smart contract and synchronize the transaction
                  result with backend services.
                </p>
              </div>
            </div>
          </div>

          {/* CONTRACT INFO */}
          <div
            className="
              rounded-md
              border
              border-slate-100
              bg-slate-50
              p-4
              space-y-3
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                border-b
                border-dashed
                border-slate-200
                pb-2
              "
            >
              <span
                className="
                  text-xs
                  uppercase
                  tracking-wider
                  text-gray-500
                  font-medium
                "
              >
                Supplier
              </span>

              <span
                className="
                  text-sm
                  font-semibold
                  text-gray-900
                "
              >
                {registration?.supplier?.username}
              </span>
            </div>

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <span
                className="
                  text-xs
                  uppercase
                  tracking-wider
                  text-gray-500
                  font-medium
                "
              >
                Wallet
              </span>

              <span
                className="
                  text-xs
                  font-mono
                  text-blue-900
                  break-all
                  text-right
                "
              >
                {registration?.supplier?.walletAddress}
              </span>
            </div>
          </div>

          {/* ACTION */}
          <div
            className="
              flex
              justify-end
              gap-2
              border-t
              border-gray-100
              pt-4
            "
          >
            <button
              type="button"
              onClick={() => setOpenConfirm(false)}
              className="
                rounded-md
                bg-white
                px-4
                py-2
                text-sm
                font-medium
                text-gray-500
                transition-colors
                hover:text-gray-700
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={
                registerSupplier.isPending || registerSupplierApi.isPending
              }
              className="
                rounded-md
                bg-gradient-to-br
                from-blue-900
                to-indigo-900
                px-4
                py-2
                text-sm
                font-medium
                text-white
                shadow-sm
                transition-all
                disabled:opacity-40
              "
            >
              {registerSupplier.isPending || registerSupplierApi.isPending
                ? "Registering..."
                : "Confirm Register"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RegisterSupplierButton;
