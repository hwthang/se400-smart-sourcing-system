// hooks/use-demand.ts

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import demandService from "../services/demand.service";

// =========================================================
// QUERY KEYS
// =========================================================
export const demandKeys = {
  all: ["demands"] as const,

  lists: () =>
    [...demandKeys.all, "list"] as const,

  list: (params?: any) =>
    [...demandKeys.lists(), params] as const,

  details: () =>
    [...demandKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...demandKeys.details(), id] as const,
};

// =========================================================
// CREATE
// =========================================================
export const useCreateDemand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: demandService.createDemand,

    onSuccess: () => {
      toast.success(
        "Demand created successfully",
      );

      queryClient.invalidateQueries({
        queryKey: demandKeys.lists(),
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Create demand failed",
      );
    },
  });
};

// =========================================================
// LIST
// =========================================================
export const useDemandList = (
  params?: any,
) => {
  return useQuery({
    queryKey: demandKeys.list(params),

    queryFn: () =>
      demandService.getDemandList(params),
  });
};

// =========================================================
// DETAIL
// =========================================================
export const useDemandDetail = (
  id?: string,
) => {
  return useQuery({
    queryKey: demandKeys.detail(
      id as string,
    ),

    queryFn: () =>
      demandService.getDemandDetail(
        id as string,
      ),

    enabled: !!id,
  });
};

// =========================================================
// UPDATE
// =========================================================
export const useUpdateDemand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: demandService.updateDemand,

    onSuccess: (
      _,
      variables: any,
    ) => {
      toast.success(
        "Demand updated successfully",
      );

      queryClient.invalidateQueries({
        queryKey: demandKeys.detail(
          variables.id,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: demandKeys.lists(),
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Update demand failed",
      );
    },
  });
};

// =========================================================
// SUBMIT
// =========================================================
export const useSubmitDemand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:
      demandService.submitDemand,

    onSuccess: (
      _,
      id: string,
    ) => {
      toast.success(
        "Demand submitted successfully",
      );

      queryClient.invalidateQueries({
        queryKey:
          demandKeys.detail(id),
      });

      queryClient.invalidateQueries({
        queryKey:
          demandKeys.lists(),
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Submit demand failed",
      );
    },
  });
};

// =========================================================
// APPROVE
// =========================================================
export const useApproveDemand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:
      demandService.approveDemand,

    onSuccess: (
      _,
      id: string,
    ) => {
      toast.success(
        "Demand approved successfully",
      );

      queryClient.invalidateQueries({
        queryKey:
          demandKeys.detail(id),
      });

      queryClient.invalidateQueries({
        queryKey:
          demandKeys.lists(),
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Approve demand failed",
      );
    },
  });
};

// =========================================================
// REJECT
// =========================================================
export const useRejectDemand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:
      demandService.rejectDemand,

    onSuccess: (
      _,
      variables: any,
    ) => {
      toast.success(
        "Demand rejected successfully",
      );

      queryClient.invalidateQueries({
        queryKey: demandKeys.detail(
          variables.id,
        ),
      });

      queryClient.invalidateQueries({
        queryKey:
          demandKeys.lists(),
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Reject demand failed",
      );
    },
  });
};

// =========================================================
// ASSIGN EMPLOYEE
// =========================================================
export const useAssignEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:
      demandService.assignEmployee,

    onSuccess: (
      _,
      variables: any,
    ) => {
      toast.success(
        "Demand received successfully",
      );

      queryClient.invalidateQueries({
        queryKey: demandKeys.detail(
          variables.id,
        ),
      });

      queryClient.invalidateQueries({
        queryKey:
          demandKeys.lists(),
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Receive demand failed",
      );
    },
  });
};

// =========================================================
// CONFIRM DEMAND
// =========================================================
export const useConfirmDemand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;

      data: {
        txHash: string;
        contractAddress: string;
      };
    }) =>
      demandService.confirmDemand({
        id,
        data,
      }),

    onSuccess: (
      _,
      variables,
    ) => {

      // =====================================================
      // DEMAND DETAIL
      // =====================================================
      queryClient.invalidateQueries({
        queryKey: demandKeys.detail(
          variables.id,
        ),
      });

      // =====================================================
      // DEMAND LIST
      // =====================================================
      queryClient.invalidateQueries({
        queryKey:
          demandKeys.lists(),
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data
          ?.message ||
          "Confirm demand failed",
      );
    },
  });
};