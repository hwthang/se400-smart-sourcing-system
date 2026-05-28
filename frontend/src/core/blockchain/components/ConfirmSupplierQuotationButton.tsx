import { useState } from "react";
import { useProcurement } from "../hooks/useProcurement";
import { ConfirmModal } from "../../../shared/ui/modal/ConfirmModal";

type Props = {
  contractAddress?: string;
};

export const ConfirmSupplierQuotationButton = ({ contractAddress }: Props) => {
  const p = useProcurement(contractAddress);

  const [open, setOpen] = useState(false);

  const [unitPrice, setUnitPrice] = useState(""); // wei
  const [minSupplyQuantity, setMinSupplyQuantity] = useState("");
  const [maxSupplyQuantity, setMaxSupplyQuantity] = useState("");
  const [maxDefectRate, setMaxDefectRate] = useState(""); // %
  const [maxLeadTimeDays, setMaxLeadTimeDays] = useState(""); // days

  const reset = () => {
    setUnitPrice("");
    setMinSupplyQuantity("");
    setMaxSupplyQuantity("");
    setMaxDefectRate("");
    setMaxLeadTimeDays("");
  };

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 border border-blue-800 text-blue-800 rounded-md hover:bg-blue-50"
      >
        Confirm Supplier Quotation
      </button>

      {/* MODAL */}
      <ConfirmModal
        open={open}
        title="Confirm Supplier Quotation"
        loading={p.confirmSupplierQuotation.isPending}
        onClose={() => setOpen(false)}
        onConfirm={async () => {
          const tx = await p.confirmSupplierQuotation.mutateAsync({
            unitPrice: BigInt(unitPrice || "0"),
            minSupplyQuantity: BigInt(minSupplyQuantity || "0"),
            maxSupplyQuantity: BigInt(maxSupplyQuantity || "0"),
            maxDefectRate: Number(maxDefectRate || "0"),
            maxLeadTimeDays: Number(maxLeadTimeDays || "0"),
          });

          console.log("txHash:", tx);

          reset();
          setOpen(false);
        }}
      >
        <div className="flex flex-col gap-3">

          {/* UNIT PRICE (WEI) */}
          <div>
            <label className="text-sm text-gray-500">Unit Price (wei)</label>
            <input
              className="w-full border border-gray-200 rounded-md p-2"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              placeholder="e.g. 1000000000000000000"
            />
          </div>

          {/* MIN QTY */}
          <div>
            <label className="text-sm text-gray-500">Min Supply Quantity</label>
            <input
              className="w-full border border-gray-200 rounded-md p-2"
              value={minSupplyQuantity}
              onChange={(e) => setMinSupplyQuantity(e.target.value)}
              placeholder="uint256"
            />
          </div>

          {/* MAX QTY */}
          <div>
            <label className="text-sm text-gray-500">Max Supply Quantity</label>
            <input
              className="w-full border border-gray-200 rounded-md p-2"
              value={maxSupplyQuantity}
              onChange={(e) => setMaxSupplyQuantity(e.target.value)}
              placeholder="uint256"
            />
          </div>

          {/* DEFECT RATE (%) */}
          <div>
            <label className="text-sm text-gray-500">Max Defect Rate (%)</label>
            <input
              className="w-full border border-gray-200 rounded-md p-2"
              value={maxDefectRate}
              onChange={(e) => setMaxDefectRate(e.target.value)}
              placeholder="0 - 100"
            />
            <p className="text-xs text-gray-400 mt-1">
              Stored as percentage (converted to uint16)
            </p>
          </div>

          {/* LEAD TIME (DAYS) */}
          <div>
            <label className="text-sm text-gray-500">Max Lead Time (days)</label>
            <input
              className="w-full border border-gray-200 rounded-md p-2"
              value={maxLeadTimeDays}
              onChange={(e) => setMaxLeadTimeDays(e.target.value)}
              placeholder="days"
            />
          </div>
        </div>
      </ConfirmModal>
    </>
  );
};