import type { UserRole } from "../../features/auth/types/user-role.enum";

export type NavItem = {
  label: string;
  path: string;
};

export const sidebarNav: Record<UserRole, NavItem[]> = {
  ADMIN: [{ label: "Dashboard", path: "/console/dashboard" }],

  CUSTOMER: [
    { label: "Dashboard", path: "/console/dashboard" },
    { label: "Demands", path: "/console/demands" },
    { label: "Contracts", path: "/console/contracts" },
  ],

  SUPPLIER: [
    { label: "Dashboard", path: "/console/dashboard" },
    { label: "Contracts", path: "/console/contracts" },
  ],

  EMPLOYEE: [
    { label: "Dashboard", path: "/console/dashboard" },
    { label: "Demands", path: "/console/demands" },
    { label: "Contracts", path: "/console/contracts" },
  ],
};
