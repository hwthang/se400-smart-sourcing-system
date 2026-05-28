// services/contract.service.ts

import apiClient from "../../../core/api/client";

class ContractService {
  // =========================================================
  // 1. CREATE CONTRACT
  // =========================================================
  createContract = async (data: any) => {
    const res = await apiClient.post("/contracts", { demandId: data });
    return res.data;
  };

  // =========================================================
  // 2. GET CONTRACT LIST
  // =========================================================
  getContractList = async (params?: any) => {
    const query = { ...params };

    if (
      query?.statuses &&
      Array.isArray(query.statuses) &&
      query.statuses.length > 0
    ) {
      query.statuses = query.statuses.join(",");
    }

    const res = await apiClient.get("/contracts", {
      params: query,
    });

    return res.data;
  };

  // =========================================================
  // 3. GET CONTRACT DETAIL
  // =========================================================
  getContractDetail = async (id: string) => {
    const res = await apiClient.get(`/contracts/${id}`);
    return res.data;
  };

  // =========================================================
  // 4. UPDATE CONTRACT
  // =========================================================
  updateContract = async (id: string, data: any) => {
    const res = await apiClient.patch(`/contracts/${id}`, data);
    return res.data;
  };

  // =========================================================
  // 5. DEPLOY CONTRACT
  // =========================================================
  deployContract = async (id: string) => {
    const res = await apiClient.post(`/contracts/${id}/deploy`);
    return res.data;
  };

  // =========================================================
  // 6. REGISTER CUSTOMER
  // =========================================================
  registerCustomer = async (id: string, data: any) => {
    const res = await apiClient.post(
      `/contracts/${id}/register-customer`,
      data,
    );
    return res.data;
  };

  // =========================================================
  // 7. REGISTER SUPPLIER
  // =========================================================
  registerSupplier = async (id: string, data: any) => {
    const res = await apiClient.post(
      `/contracts/${id}/register-supplier`,
      data,
    );
    return res.data;
  };

  // =========================================================
  // 8. OPEN SUPPLIER REGISTRATION
  // =========================================================
  openSupplierRegistration = async (id: string) => {
    const res = await apiClient.post(
      `/contracts/${id}/open-supplier-registration`,
    );
    return res.data;
  };

  // =========================================================
  // 9. CLOSE SUPPLIER REGISTRATION
  // =========================================================
  closeSupplierRegistration = async (id: string) => {
    const res = await apiClient.post(
      `/contracts/${id}/close-supplier-registration`,
    );
    return res.data;
  };

  // =========================================================
  // 10. START ORDERING PHASE
  // =========================================================
  startOrderingPhase = async (id: string, data: any) => {
    const res = await apiClient.post(
      `/contracts/${id}/start-ordering-phase`,
      data,
    );
    return res.data;
  };

  // =========================================================
  // 11. START ALLOCATION PHASE
  // =========================================================
  startAllocationPhase = async (id: string, data: any) => {
    const res = await apiClient.post(
      `/contracts/${id}/start-allocation-phase`,
      data,
    );
    return res.data;
  };

  // =========================================================
  // 12. RUN ALLOCATION
  // =========================================================
  runAllocation = async (id: string) => {
    const res = await apiClient.post(`/contracts/${id}/run-allocation`);
    return res.data;
  };

  // =========================================================
  // 13. REQUEST FUND
  // =========================================================
  requestFund = async (id: string) => {
    const res = await apiClient.post(`/contracts/${id}/request-fund`);
    return res.data;
  };

  // =========================================================
  // 14. DEPOSIT
  // =========================================================
  deposit = async (id: string, data: any) => {
    const res = await apiClient.post(`/contracts/${id}/deposit`, data);
    return res.data;
  };

  // =========================================================
  // 15. START EXECUTING PHASE
  // =========================================================
  startExecutingPhase = async (id: string, data: any) => {
    const res = await apiClient.post(
      `/contracts/${id}/start-executing-phase`,
      data,
    );
    return res.data;
  };

  // =========================================================
  // 16. FINISH CONTRACT
  // =========================================================
  finish = async (id: string, data: any) => {
    const res = await apiClient.post(`/contracts/${id}/finish`, data);
    return res.data;
  };
}

const contractService = new ContractService();

export default contractService;
