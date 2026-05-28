import { useMutation, useQueryClient } from "@tanstack/react-query";
import orderService from "../services/order.service";
import { contractKeys } from "../../contract/hooks/use-contract";

// ===============================
// CONFIRM ORDER
// ===============================
export const useConfirmOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, contractId }: any) =>
      orderService.confirmOrder(id, contractId),

    onSuccess: async (_, variables) => {
      const { id, contractId } = variables;

      queryClient.invalidateQueries({
        queryKey: ["order", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      // 🔥 REFETCH CONTRACT
      if (contractId) {
        queryClient.invalidateQueries({
          queryKey: contractKeys.detail(contractId),
        });
      }
    },
  });
};

export const useStartDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, contractId }: any) =>
      orderService.startDelivery(id, contractId),

    onSuccess: (_, variables) => {
      const { id, contractId } = variables;

      queryClient.invalidateQueries({
        queryKey: ["order", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      if (contractId) {
        queryClient.invalidateQueries({
          queryKey: contractKeys.detail(contractId),
        });
      }
    },
  });
};

export const useStartInspection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, contractId }: any) =>
      orderService.startInspection(id, contractId),

    onSuccess: (_, variables) => {
      const { id, contractId } = variables;

      queryClient.invalidateQueries({
        queryKey: ["order", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      if (contractId) {
        queryClient.invalidateQueries({
          queryKey: contractKeys.detail(contractId),
        });
      }
    },
  });
};

export const useCompleteDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, contractId, data }: any) =>
      orderService.completeDelivery(id, data, contractId),

    onSuccess: (_, variables) => {
      const { id, contractId } = variables;

      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      if (contractId) {
        queryClient.invalidateQueries({
          queryKey: contractKeys.detail(contractId),
        });
      }
    },
  });
};

export const useCompleteInspection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, contractId }: any) => {
      console.log(data);
      return orderService.completeInspection(id, data, contractId);
    },

    onSuccess: (_, variables) => {
      const { id, contractId } = variables;

      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      if (contractId) {
        queryClient.invalidateQueries({
          queryKey: contractKeys.detail(contractId),
        });
      }
    },
  });
};

export const useReleaseSupplierPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, contractId, data }: any) =>
      orderService.releaseSupplierPayment(id, contractId, data),

    onSuccess: (_, variables) => {
      const { id, contractId } = variables;

      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      if (contractId) {
        queryClient.invalidateQueries({
          queryKey: contractKeys.detail(contractId),
        });
      }
    },
  });
};
