import apiClient from "./client";
const TOKEN_KEY = "accessToken";

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token && config.headers) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,

  (error) => {
    const customError = {
      message: error.response?.data?.message || "Unknown error",
      status: error.response?.status,
      data: error.response?.data,
    };

    if (customError.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }

    return Promise.reject(customError);
  }
);