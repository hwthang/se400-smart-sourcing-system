import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SourcingSystemModule = buildModule(
  "SourcingSystemModule",
  (m) => {
    const sourcingSystem = m.contract("SourcingSystem");

    return { sourcingSystem };
  }
);

export default SourcingSystemModule;