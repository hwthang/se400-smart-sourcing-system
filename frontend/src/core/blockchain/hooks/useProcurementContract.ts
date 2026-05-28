import { useMemo } from "react";
import { useWallet } from "./useWallet";
import { ProcurementContractService } from "../services/procurement-contract.service";

export const useProcurementContract = (
  contractAddress?: string,
) => {
  const { signer } = useWallet();

  const contractService = useMemo(() => {
    if (!contractAddress || !signer) return null;

    return new ProcurementContractService(
      contractAddress,
      signer,
    );
  }, [contractAddress, signer]);

  return contractService;
};