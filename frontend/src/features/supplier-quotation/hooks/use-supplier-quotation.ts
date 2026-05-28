// hooks/use-supplier-quotation.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import supplierQuotationService from "../services/supplier-quotation.service";

import { contractKeys } from "../../contract/hooks/use-contract";

// =========================================================
// SHARED INVALIDATION
// =========================================================
const invalidateContractCaches = (queryClient: any, contractId?: string) => {
  queryClient.invalidateQueries({
    queryKey: ["quotations"],
  });

  queryClient.invalidateQueries({
    queryKey: contractKeys.lists(),
  });

  if (contractId) {
    queryClient.invalidateQueries({
      queryKey: contractKeys.detail(contractId),
    });
  }
};

// =========================================================
// CREATE
// =========================================================
export const useCreateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supplierQuotationService.createQuotation,

    onSuccess: (_, variables: any) => {
      toast.success("Quotation created successfully");

      invalidateContractCaches(queryClient, variables?.contractId);
    },

    onError: (error: any) => {
      toast.error(error?.data?.message || "Create quotation failed");
    },
  });
};

// =========================================================
// UPDATE
// =========================================================
export const useUpdateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supplierQuotationService.updateQuotation,

    onSuccess: (_, variables: any) => {
      toast.success("Quotation updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["quotation", variables.id],
      });

      invalidateContractCaches(queryClient, variables?.contractId);
    },

    onError: (error: any) => {
      toast.error(error?.data?.message || "Update quotation failed");
    },
  });
};

// =========================================================
// SUBMIT
// =========================================================
export const useSubmitQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supplierQuotationService.submitQuotation,

    onSuccess: (_, variables: any) => {
      toast.success("Quotation submitted successfully");

      queryClient.invalidateQueries({
        queryKey: ["quotation", variables.quotationId],
      });

      invalidateContractCaches(queryClient, variables?.contractId);
    },

    onError: (error: any) => {
      toast.error(error?.data?.message || "Submit quotation failed");
    },
  });
};

// =========================================================
// APPROVE
// =========================================================
export const useApproveQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supplierQuotationService.approveQuotation,

    onSuccess: (_, variables: any) => {
      toast.success("Quotation approved successfully");

      queryClient.invalidateQueries({
        queryKey: ["quotation", variables.quotationId],
      });

      invalidateContractCaches(queryClient, variables?.contractId);
    },

    onError: (error: any) => {
      toast.error(error?.data?.message || "Approve quotation failed");
    },
  });
};

// =========================================================
// REJECT
// =========================================================
export const useRejectQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supplierQuotationService.rejectQuotation,

    onSuccess: (_, variables: any) => {
      toast.success("Quotation rejected successfully");

      queryClient.invalidateQueries({
        queryKey: ["quotation", variables.id],
      });

      invalidateContractCaches(queryClient, variables?.contractId);
    },

    onError: (error: any) => {
      toast.error(error?.data?.message || "Reject quotation failed");
    },
  });
};

export const useConfirmQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      contractId,
    }: {
      id: string;

      data: {
        txHash: string;
        contractAddress: string;
      };

      contractId: string;
    }) =>
      supplierQuotationService.confirmQuotation({
        id,
        data,
        contractId,
      }),

    onSuccess: (_, variables) => {
      // =====================================================
      // CONTRACT DETAIL
      // =====================================================
      queryClient.invalidateQueries({
        queryKey: contractKeys.detail(variables.contractId),
      });

      // =====================================================
      // CONTRACT LIST
      // =====================================================
      queryClient.invalidateQueries({
        queryKey: contractKeys.lists(),
      });

      // =====================================================
      // QUOTATION CACHE
      // =====================================================
      queryClient.invalidateQueries({
        queryKey: ["quotation", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["quotations"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Confirm quotation failed");
    },
  });
};
