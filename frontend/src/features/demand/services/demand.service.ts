// services/demand.service.ts

import apiClient from "../../../core/api/client";

class DemandService {
  createDemand = async (data: any) => {
    console.log(data);
    const res = await apiClient.post("/demands", data);
    return res.data;
  };

  getDemandList = async (params?: any) => {
    console.log(params);

    // Xử lý an toàn hơn
    if (
      params?.statuses &&
      Array.isArray(params.statuses) &&
      params.statuses.length > 0
    ) {
      params.statuses = params.statuses.join(",");
    }

    const res = await apiClient.get("/demands", {
      params,
    });

    console.log(res.data);
    return res.data;
  };

  getDemandDetail = async (id: string) => {
    const res = await apiClient.get(`/demands/${id}`);
    return res.data;
  };

  updateDemand = async ({ id, data }: { id: string; data: any }) => {
    console.log(data);
    const res = await apiClient.put(`/demands/${id}`, data);
    return res.data;
  };

  submitDemand = async (id: string) => {
    const res = await apiClient.post(`/demands/${id}/submit`);
    return res.data;
  };

  approveDemand = async (id: string) => {
    const res = await apiClient.post(`/demands/${id}/approve`);
    return res.data;
  };

  rejectDemand = async ({ id, reason }: { id: string; reason?: string }) => {
    console.log(reason);
    const res = await apiClient.post(`/demands/${id}/reject`, {
      reason,
    });

    return res.data;
  };

  assignEmployee = async ({
    id,
    employeeId,
  }: {
    id: string;
    employeeId: string;
  }) => {
    const res = await apiClient.post(`/demands/${id}/assign-employee`, {
      employeeId,
    });

    return res.data;
  };

  confirmDemand = async ({ id, data }: any) => {
    const res = await apiClient.post(`/demands/${id}/confirm`, data);

    return res.data;
  };
}

const demandService = new DemandService();

export default demandService;
