import CreateDemandPage from "./pages/CreateDemandPage";
import DemandDetailPage from "./pages/DemandDetailPage";
import DemandsPage from "./pages/DemandsPage";

export const demandRoutes = [
  {
    path: "demands",
    element: <DemandsPage />,
  },
  {
    path: "demands/:id",
    element: <DemandDetailPage />,
  },
  {
    path: "demands/create",
    element: <CreateDemandPage />,
  },
];
