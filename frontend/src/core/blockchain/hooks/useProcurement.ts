import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useProcurementContract } from "./useProcurementContract";

export const useProcurement = (contractAddress?: string) => {
  const contract = useProcurementContract(contractAddress);

  const safe = () => {
    if (!contract) throw new Error("Wallet or contract not ready");
    return contract;
  };

  const success = (txHash: string, msg: string) => {
    console.log("txHash:", txHash);
    toast.success(msg);
  };

  const error = (e: any) => {
    console.error(e);
    toast.error(e?.message || "Transaction failed");
  };

  // =========================================================
  // REGISTER
  // =========================================================
  const registerCustomer = useMutation({
    mutationFn: async (addr: string) => {
      {
        const tx = await safe().registerCustomer(addr);

        return tx;
      }
    },
    onSuccess: (tx) => success(tx, "Customer registered"),
    onError: error,
  });

  const registerSupplier = useMutation({
    mutationFn: (addr: string) => safe().registerSupplier(addr),
    onSuccess: (tx) => success(tx, "Supplier registered"),
    onError: error,
  });

  // =========================================================
  // PHASES
  // =========================================================
  const startOrderingPhase = useMutation({
    mutationFn: () => safe().startOrderingPhase(),
    onSuccess: (tx) => success(tx, "Ordering started"),
    onError: error,
  });

  const startAllocationPhase = useMutation({
    mutationFn: () => safe().startAllocationPhase(),
    onSuccess: (tx) => success(tx, "Allocation started"),
    onError: error,
  });

  const startExecutingPhase = useMutation({
    mutationFn: () => safe().startExecutingPhase(),
    onSuccess: (tx) => success(tx, "Executing started"),
    onError: error,
  });

  const finish = useMutation({
    mutationFn: () => safe().finish(),
    onSuccess: (tx) => success(tx, "Contract finished"),
    onError: error,
  });

  // =========================================================
  // ORDER FLOW
  // =========================================================
  const confirmDemand = useMutation({
    mutationFn: (input: { quantity: bigint; timestamp: bigint }) =>
      safe().confirmDemand(input.quantity, input.timestamp),
    onSuccess: (tx) => success(tx, "Demand confirmed"),
    onError: error,
  });

  const confirmSupplierQuotation = useMutation({
    mutationFn: (input: any) =>
      safe().confirmSupplierQuotation(
        input.unitPrice,
        input.minSupplyQuantity,
        input.maxSupplyQuantity,
        input.maxDefectRate,
        input.maxLeadTimeDays,
      ),
    onSuccess: (tx) => success(tx, "Quotation confirmed"),
    onError: error,
  });

  const confirmBuyerCriteria = useMutation({
    mutationFn: (input: any) =>
      safe().confirmBuyerCriteria(
        input.supplier,
        input.minPurchaseQuantity,
        input.maxAllocationPercent,
      ),
    onSuccess: (tx) => success(tx, "Criteria confirmed"),
    onError: error,
  });

  const createOrder = useMutation({
    mutationFn: (input: any) =>
      safe().createOrder(
        input.supplier,
        input.allocationScore,
        input.allocatedQuantity,
        input.estimatedAmount,
      ),
    onSuccess: (tx) => success(tx, "Order created"),
    onError: error,
  });

  const deposit = useMutation({
    mutationFn: (value: bigint) => safe().deposit(value),
    onSuccess: (tx) => success(tx, "Deposited"),
    onError: error,
  });

  // =========================================================
  // EXECUTION
  // =========================================================
  const completeDelivery = useMutation({
    mutationFn: (input: any) =>
      safe().completeDelivery(input.supplier, input.deliveryTimestamp),
    onSuccess: (tx) => success(tx, "Delivery completed"),
    onError: error,
  });

  const completeInspection = useMutation({
    mutationFn: (input: any) =>
      safe().completeInspection(input.supplier, input.defectRate),
    onSuccess: (tx) => success(tx, "Inspection completed"),
    onError: error,
  });

  const releaseSupplierPayment = useMutation({
    mutationFn: (supplier: string) => safe().releaseSupplierPayment(supplier),
    onSuccess: (tx) => success(tx, "Payment released"),
    onError: error,
  });

  const getOrder = useMutation({
    mutationFn: async (supplier: string) => {
      const result = await safe().getOrder(supplier);
      return result;
    },
  });

  return {
    registerCustomer,
    registerSupplier,

    startOrderingPhase,
    startAllocationPhase,
    startExecutingPhase,
    finish,

    confirmDemand,
    confirmSupplierQuotation,
    confirmBuyerCriteria,

    createOrder,
    deposit,

    completeDelivery,
    completeInspection,
    releaseSupplierPayment,
    getOrder,
  };
};
