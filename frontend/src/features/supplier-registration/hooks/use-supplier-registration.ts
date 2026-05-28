// hooks/use-supplier-registration.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import supplierRegistrationService from "../services/supplier-registration.service";

import { contractKeys } from "../../contract/hooks/use-contract";

// =========================================================
// CREATE REGISTRATION
// =========================================================
export const useCreateRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supplierRegistrationService.createRegistration,

    onSuccess: (_, variables: any) => {
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

      // =====================================================
      // REGISTRATION LIST
      // =====================================================
      queryClient.invalidateQueries({
        queryKey: ["supplier-registrations"],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Create registration failed",
      );
    },
  });
};

// =========================================================
// CONFIRM REGISTRATION
// =========================================================
export const useConfirmRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supplierRegistrationService.confirmRegistration,

    onSuccess: (_, variables: any) => {
      toast.success("Registration confirmed successfully");

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

      // =====================================================
      // REGISTRATION LIST
      // =====================================================
      queryClient.invalidateQueries({
        queryKey: ["supplier-registrations"],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Confirm registration failed",
      );
    },
  });
};

// =========================================================
// CANCEL REGISTRATION
// =========================================================
export const useCancelRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supplierRegistrationService.cancelRegistration,

    onSuccess: (_, variables: any) => {
      toast.success("Registration cancelled successfully");

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

      // =====================================================
      // REGISTRATION LIST
      // =====================================================
      queryClient.invalidateQueries({
        queryKey: ["supplier-registrations"],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Cancel registration failed",
      );
    },
  });
};
