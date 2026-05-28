import React from "react";
import AppRoutes from "./routes/AppRoutes";
import QueryProvider from "./providers/QueryProvider";
import { AuthProvider } from "../features/auth/providers/AuthProvider";
import { Toaster } from "react-hot-toast";
import { WalletProvider } from "../core/blockchain/providers/WalletProvider";

const App = () => {
  return (
    <QueryProvider>
      <WalletProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" reverseOrder={false} />
        </AuthProvider>
      </WalletProvider>
    </QueryProvider>
  );
};

export default App;
