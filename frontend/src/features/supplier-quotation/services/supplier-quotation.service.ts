// services/supplier-quotation.service.ts

import { data } from "react-router";
import apiClient from "../../../core/api/client";

class SupplierQuotationService {
  createQuotation = async ({ contractId, ...data }: any) => {
    console.log(data);

    const res = await apiClient.post("/supplier-quotations", data);

    return {
      ...res.data,
      contractId,
    };
  };

  getQuotationList = async (params?: any) => {
    const res = await apiClient.get("/supplier-quotations", {
      params,
    });

    return res.data;
  };

  getQuotationDetail = async (id: string) => {
    const res = await apiClient.get(`/supplier-quotations/${id}`);

    return res.data;
  };

  updateQuotation = async ({
    id,
    data,
    contractId,
  }: {
    id: string;
    data: any;
    contractId: string;
  }) => {
    const res = await apiClient.put(`/supplier-quotations/${id}`, data);

    return {
      ...res.data,
      contractId,
    };
  };

  submitQuotation = async ({
    id,
    contractId,
  }: {
    id: string;
    contractId: string;
  }) => {
    const res = await apiClient.post(`/supplier-quotations/${id}/submit`);

    return {
      ...res.data,
      contractId,
    };
  };

  approveQuotation = async ({
    id,
    contractId,
  }: {
    id: string;
    contractId: string;
  }) => {
    const res = await apiClient.post(`/supplier-quotations/${id}/approve`);

    return {
      ...res.data,
      contractId,
    };
  };

  rejectQuotation = async ({
    id,
    reason,
    contractId,
  }: {
    id: string;
    reason?: string;
    contractId: string;
  }) => {
    const res = await apiClient.post(`/supplier-quotations/${id}/reject`, {
      reason,
    });

    return {
      ...res.data,
      contractId,
    };
  };

  confirmQuotation = async ({
    id,
    data,
    contractId,
  }: {
    id: string;
    data: {
      txHash: string;
      contractAddress: string;
    };
    contractId: string;
  }) => {
    const res = await apiClient.post(`/supplier-quotations/${id}/confirm`, data);

    return {
      ...res.data,
      contractId,
    };
  };
}

const supplierQuotationService = new SupplierQuotationService();

export default supplierQuotationService;
