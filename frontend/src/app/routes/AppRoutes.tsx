import {
  createBrowserRouter,
  Link,
  Navigate,
  RouterProvider,
} from "react-router";

import { authRoutes } from "../../features/auth/routes";
import AppLayout from "../layouts/AppLayout";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedRoute from "./ProtectedRoute";
import { dashboardRoutes } from "../../features/dashboard/routes";

import { demandRoutes } from "../../features/demand/routes";
import { contractRoutes } from "../../features/contract/routes";
import BlockchainTestPage from "../../core/blockchain/pages/BlockchainTestPage";
import LandingPage from "../pages/LandingPage";

const router = createBrowserRouter([
  {
    path: "console",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" /> },
          ...dashboardRoutes,
          ...demandRoutes,
          ...contractRoutes
        ],
      },
    ],
  },
  { path: "test", element: <BlockchainTestPage /> },
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
         <LandingPage/>
        ),
      },
      ...authRoutes,
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
