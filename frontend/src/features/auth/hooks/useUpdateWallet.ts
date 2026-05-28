import { useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "../services/auth.service";

export const useUpdateWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { address: string }) =>
      authService.updateWallet(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["auth-user"],
      });
    },
  });
};
