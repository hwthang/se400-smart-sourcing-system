import ContractDetailPage from "./pages/ContractDetailPage";
import ContractsPage from "./pages/ContractsPage";
import CreateContractPage from "./pages/CreateContractPage";

export const contractRoutes = [
  {
    path: "contracts",
    element: <ContractsPage />,
  },
  {
    path: "contracts/:id",
    element: <ContractDetailPage />,
  },
  {
    path: "contracts/create",
    element: <CreateContractPage />,
  },
];
