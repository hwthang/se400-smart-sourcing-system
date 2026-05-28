// services/order.service.ts

import apiClient from "../../../core/api/client";

class OrderService {
  confirmOrder = async (id: string, contractId: string) => {
    const res = await apiClient.post(`/orders/${id}/confirm`);
    return { ...res.data, contractId };
  };

  startDelivery = async (id: string, contractId: string) => {
    const res = await apiClient.post(`/orders/${id}/start-delivery`);
    return { ...res.data, contractId };
  };

  startInspection = async (id: string, contractId: string) => {
    const res = await apiClient.post(`/orders/${id}/start-inspection`);
    return { ...res.data, contractId };
  };

  // =========================
  // NEW APIs
  // =========================

  completeDelivery = async (id: string, data: any, contractId: string) => {
    const res = await apiClient.post(`/orders/${id}/complete-delivery`, data);
    return { ...res.data, contractId };
  };

  completeInspection = async (id: string, data: any, contractId: string) => {
    const res = await apiClient.post(`/orders/${id}/complete-inspection`, data);
    return { ...res.data, contractId };
  };

  releaseSupplierPayment = async (
    id: string,
    contractId: string,
    data: any,
  ) => {
    const res = await apiClient.post(
      `/orders/${id}/release-supplier-payment`,
      data,
    );
    return { ...res.data, contractId };
  };
}

const orderService = new OrderService();
export default orderService;
