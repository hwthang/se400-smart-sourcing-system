// hooks/use-buyer-criteria.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import buyerCriteriaService from "../services/buyer-criteria.service";

import { contractKeys } from "../../contract/hooks/use-contract";

export const useCreateCriteria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: buyerCriteriaService.createCriteria,

    onSuccess: (_, variables: any) => {
      toast.success("Buyer criteria created successfully");

      // =====================================================
      // BUYER CRITERIA CACHE
      // =====================================================
      queryClient.invalidateQueries({
        queryKey: ["buyer-criteria"],
      });

      // =====================================================
      // CONTRACT DETAIL
      // =====================================================
      if (variables?.contractId) {
        queryClient.invalidateQueries({
          queryKey: contractKeys.detail(variables.contractId),
        });
      }

      // =====================================================
      // CONTRACT LIST
      // =====================================================
      queryClient.invalidateQueries({
        queryKey: contractKeys.lists(),
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Create buyer criteria failed",
      );
    },
  });
};

export const useUpdateCriteria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: buyerCriteriaService.updateCriteria,

    onSuccess: (_, variables: any) => {
      toast.success("Buyer criteria updated successfully");

      // =====================================================
      // BUYER CRITERIA DETAIL
      // =====================================================
      queryClient.invalidateQueries({
        queryKey: ["buyer-criteria", variables.id],
      });

      // =====================================================
      // BUYER CRITERIA LIST
      // =====================================================
      queryClient.invalidateQueries({
        queryKey: ["buyer-criteria"],
      });

      // =====================================================
      // CONTRACT DETAIL
      // =====================================================
      if (variables?.contractId) {
        queryClient.invalidateQueries({
          queryKey: contractKeys.detail(variables.contractId),
        });
      }

      // =====================================================
      // CONTRACT LIST
      // =====================================================
      queryClient.invalidateQueries({
        queryKey: contractKeys.lists(),
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Update buyer criteria failed",
      );
    },
  });
};

// hooks/use-buyer-criteria.ts

export const useConfirmCriteria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: buyerCriteriaService.confirmCriteria,

    onSuccess: (_, variables: any) => {

      // =====================================================
      // BUYER CRITERIA CACHE
      // =====================================================
      queryClient.invalidateQueries({
        queryKey: ["buyer-criteria", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["buyer-criteria"],
      });

      // =====================================================
      // CONTRACT DETAIL
      // =====================================================
      if (variables?.contractId) {
        queryClient.invalidateQueries({
          queryKey: contractKeys.detail(variables.contractId),
        });
      }

      // =====================================================
      // CONTRACT LIST
      // =====================================================
      queryClient.invalidateQueries({
        queryKey: contractKeys.lists(),
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Confirm buyer criteria failed",
      );
    },
  });
};
