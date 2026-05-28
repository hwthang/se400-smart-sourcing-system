import { Contract, type Signer } from "ethers";

import ProcurementContractAbi from "../abi/ProcurementContract.json";

export class ContractFactoryService {
  static createProcurementContract(contractAddress: string, signer: Signer) {
    return new Contract(contractAddress, ProcurementContractAbi.abi, signer);
  }
}
