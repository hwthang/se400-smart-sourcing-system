import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import contractService from "../services/contract.service";
import toast from "react-hot-toast";

// =========================================================
// QUERY KEYS
// =========================================================
export const contractKeys = {
  all: ["contracts"] as const,
  lists: () => [...contractKeys.all, "list"] as const,
  list: (params: any) => [...contractKeys.lists(), params] as const,
  detail: (id: string) => [...contractKeys.all, "detail", id] as const,
};

// =========================================================
// 1. LIST
// =========================================================
export const useContractList = (params?: any) => {
  return useQuery({
    queryKey: contractKeys.list(params),
    queryFn: () => contractService.getContractList(params),
  });
};

// =========================================================
// 2. DETAIL
// =========================================================
export const useContractDetail = (id: string) => {
  return useQuery({
    queryKey: contractKeys.detail(id),
    queryFn: () => contractService.getContractDetail(id),
    enabled: !!id,
  });
};

// =========================================================
// 3. CREATE
// =========================================================
export const useCreateContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractService.createContract,

    onSuccess: () => {
      toast.success("Contract created");
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Create failed");
    },
  });
};

// =========================================================
// 4. UPDATE
// =========================================================
export const useUpdateContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) => contractService.updateContract(id, data),

    onSuccess: (_, variables) => {
      toast.success("Contract updated");
      queryClient.invalidateQueries({
        queryKey: contractKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: contractKeys.lists(),
      });
    },
  });
};

// =========================================================
// 5. DEPLOY
// =========================================================
export const useDeployContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractService.deployContract,

    onSuccess: () => {
      toast.success("Contract deployed");
      queryClient.invalidateQueries({
        queryKey: contractKeys.all,
      });
    },
  });
};

// =========================================================
// 6. REGISTER CUSTOMER
// =========================================================
export const useRegisterCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: any) => {
      return await contractService.registerCustomer(id, data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contractKeys.all,
      });
    },
  });
};

// =========================================================
// 7. REGISTER SUPPLIER
// =========================================================
export const useRegisterSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) =>
      contractService.registerSupplier(id, data),

    onSuccess: (_, variables: any) => {

      // =====================================================
      // CONTRACT DETAIL
      // =====================================================
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: contractKeys.detail(variables.id),
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
      toast.error(error?.response?.data?.message || "Register supplier failed");
    },
  });
};

// =========================================================
// 9. PHASE HOOKS
// =========================================================
export const useOpenSupplierRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractService.openSupplierRegistration,
    onSuccess: () => {
      toast.success("Supplier registration opened");
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },
  });
};

export const useCloseSupplierRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractService.closeSupplierRegistration,
    onSuccess: () => {
      toast.success("Supplier registration closed");
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },
  });
};

export const useStartOrderingPhase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) =>
      contractService.startOrderingPhase(id, data),
    onSuccess: () => {
      toast.success("Ordering phase started");
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },
  });
};

export const useStartAllocationPhase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) =>
      contractService.startAllocationPhase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },
  });
};

export const useRunAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractService.runAllocation,
    onSuccess: () => {
      toast.success("Allocation executed");
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },
  });
};

export const useRequestFund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractService.requestFund,
    onSuccess: () => {
      toast.success("Fund requested");
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },
  });
};

export const useDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) => contractService.deposit(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },
  });
};

export const useStartExecutingPhase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) =>
      contractService.startExecutingPhase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },
  });
};

export const useFinishContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) => contractService.finish(id, data),
    onSuccess: () => {
      toast.success("Contract finished");
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },
  });
};
