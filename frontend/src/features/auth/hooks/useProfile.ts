import { useQuery } from "@tanstack/react-query";
import authService from "../services/auth.service";

const getToken = () => localStorage.getItem("accessToken");

export const useProfile = () => {
  const token = getToken();

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: authService.getProfile,
    enabled: !!token,
    retry: false,
  });

  return {
    user: query.data ?? null,
    isAuthenticated: !!query.data,
    isLoading: !!token && query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};