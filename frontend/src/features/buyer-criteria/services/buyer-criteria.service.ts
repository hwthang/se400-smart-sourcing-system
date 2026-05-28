// services/buyer-criteria.service.ts

import apiClient from "../../../core/api/client";

class BuyerCriteriaService {
  createCriteria = async ({ contractId, ...data }: any) => {
    const res = await apiClient.post("/buyer-criteria", data);

    return {
      ...res.data,
      contractId,
    };
  };

  updateCriteria = async ({
    id,
    data,
    contractId,
  }: {
    id: string;
    data: any;
    contractId: string;
  }) => {
    const res = await apiClient.put(`/buyer-criteria/${id}`, data);

    return {
      ...res.data,
      contractId,
    };
  };

  confirmCriteria = async ({
    id,
    data,
    contractId,
  }: {
    id: string;
    data: any; //{txHash:string, contractAddress: string}
    contractId: string;
  }) => {
    const res = await apiClient.put(`/buyer-criteria/${id}/confirm`, data);

    return {
      ...res.data,
      contractId,
    };
  };
}

const buyerCriteriaService = new BuyerCriteriaService();

export default buyerCriteriaService;
