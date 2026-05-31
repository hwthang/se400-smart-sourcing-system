import apiClient from "../../../core/api/client";

export class TransactionService {
  getList = async (contractAddress: string) => {
    const res = await apiClient.get("/blockchain-transactions", {
      params: {
        contractAddress,
      },
    });
console.log(res.data)
    return res.data;
  };
  
}


export const transactionService = new TransactionService();
