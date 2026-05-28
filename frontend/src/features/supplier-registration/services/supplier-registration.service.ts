// services/supplier-registration.service.ts

import apiClient from "../../../core/api/client";

class SupplierRegistrationService {
  createRegistration = async ({
    contractId,
    ...data
  }: any) => {
    const res = await apiClient.post(
      "/supplier-registrations",
      {...data, contractId}
    );

    return {
      ...res.data,
      contractId,
    };
  };

  confirmRegistration = async ({
    id,
    contractId,
  }: {
    id: string;
    contractId: string;
  }) => {
    const res = await apiClient.post(
      `/supplier-registrations/${id}/confirm`
    );

    return {
      ...res.data,
      contractId,
    };
  };

  cancelRegistration = async ({
    id,
    contractId,
    reason,
  }: {
    id: string;
    contractId: string;
    reason: any;
  }) => {
    const res = await apiClient.post(
      `/supplier-registrations/${id}/cancel`,
      {
        reason,
      }
    );

    return {
      ...res.data,
      contractId,
    };
  };
}

const supplierRegistrationService =
  new SupplierRegistrationService();

export default supplierRegistrationService;