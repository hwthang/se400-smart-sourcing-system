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
      toast.success("Contract created successfully");
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
    },

    onError: (err: any) => {
      toast.error(err?.data?.message || "Create contract failed");
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
      toast.success("Contract updated successfully");
      queryClient.invalidateQueries({
        queryKey: contractKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: contractKeys.lists(),
      });
    },

    onError: (err: any) => {
      toast.error(err?.data?.message || "Update contract failed");
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
      toast.success("Contract deployed successfully");
      queryClient.invalidateQueries({
        queryKey: contractKeys.all,
      });
    },

    onError: (err: any) => {
      toast.error(err?.data?.message || "Deploy contract failed");
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
      toast.success("Customer registered successfully");
      queryClient.invalidateQueries({
        queryKey: contractKeys.all,
      });
    },

    onError: (err: any) => {
      toast.error(err?.data?.message || "Register customer failed");
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
      toast.success("Supplier registered successfully");

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
// 8. OPEN SUPPLIER REGISTRATION
// =========================================================
export const useOpenSupplierRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractService.openSupplierRegistration,
    
    onSuccess: () => {
      toast.success("Supplier registration opened successfully");
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },

    onError: (err: any) => {
      toast.error(err?.data?.message || "Open supplier registration failed");
    },
  });
};

// =========================================================
// 9. CLOSE SUPPLIER REGISTRATION
// =========================================================
export const useCloseSupplierRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractService.closeSupplierRegistration,
    
    onSuccess: () => {
      toast.success("Supplier registration closed successfully");
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },

    onError: (err: any) => {
      toast.error(err?.data?.message || "Close supplier registration failed");
    },
  });
};

// =========================================================
// 10. START ORDERING PHASE
// =========================================================
export const useStartOrderingPhase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) =>
      contractService.startOrderingPhase(id, data),
    
    onSuccess: () => {
      toast.success("Ordering phase started successfully");
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },

    onError: (err: any) => {
      toast.error(err?.data?.message || "Start ordering phase failed");
    },
  });
};

// =========================================================
// 11. START ALLOCATION PHASE
// =========================================================
export const useStartAllocationPhase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) =>
      contractService.startAllocationPhase(id, data),
    
    onSuccess: () => {
      toast.success("Allocation phase started successfully");
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },

    onError: (err: any) => {
      toast.error(err?.data?.message || "Start allocation phase failed");
    },
  });
};

// =========================================================
// 12. RUN ALLOCATION
// =========================================================
export const useRunAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractService.runAllocation,
    
    onSuccess: () => {
      toast.success("Allocation executed successfully");
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },

    onError: (err: any) => {
      toast.error(err?.data?.message || "Run allocation failed");
    },
  });
};

// =========================================================
// 13. REQUEST FUND
// =========================================================
export const useRequestFund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractService.requestFund,
    
    onSuccess: () => {
      toast.success("Fund requested successfully");
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },

    onError: (err: any) => {
      toast.error(err?.data?.message || "Request fund failed");
    },
  });
};

// =========================================================
// 14. DEPOSIT
// =========================================================
export const useDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) => contractService.deposit(id, data),

    onSuccess: () => {
      toast.success("Deposit completed successfully");
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },

    onError: (err: any) => {
      toast.error(err?.data?.message || "Deposit failed");
    },
  });
};

// =========================================================
// 15. START EXECUTING PHASE
// =========================================================
export const useStartExecutingPhase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) =>
      contractService.startExecutingPhase(id, data),
    
    onSuccess: () => {
      toast.success("Executing phase started successfully");
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },

    onError: (err: any) => {
      toast.error(err?.data?.message || "Start executing phase failed");
    },
  });
};

// =========================================================
// 16. FINISH CONTRACT
// =========================================================
export const useFinishContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: any) => contractService.finish(id, data),
    
    onSuccess: () => {
      toast.success("Contract finished successfully");
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },

    onError: (err: any) => {
      toast.error(err?.data?.message || "Finish contract failed");
    },
  });
};