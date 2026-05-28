import apiClient from "../../../core/api/client";

class AuthService {
  login = async (data: { identifier: string; password: string }) => {
    const res = await apiClient.post("/auth/login", data);
    return res.data;
  };

  getProfile = async () => {
    const res = await apiClient.get("/auth/profile");
    console.log(res.data);
    return res.data;
  };

  register = async (data: any) => {
    const res = await apiClient.post("/auth/register", data);
    return res.data;
  };

  updateWallet = async (data: any) => {
    console.log(data)
    const res = await apiClient.patch("/auth/profile/wallet", data);
    return res.data;
  };
}

const authService = new AuthService();

export default authService;
