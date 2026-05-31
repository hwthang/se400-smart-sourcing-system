import { useQuery } from "@tanstack/react-query";

import { transactionService } from "../services/transaction.service";

export const useBlockchainTransactions = (
  contractAddress?: string,
) => {
  return useQuery({
    queryKey: [
      "blockchain-transactions",
      contractAddress,
    ],

    queryFn: () =>
      transactionService.getList(
        contractAddress!,
      ),

    enabled: !!contractAddress,
  });
};