import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  ShoppingCart,
  FileText,
  ClipboardList,
  Truck,
  Building2,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../features/auth/providers/AuthProvider";
import { sidebarNav } from "./sidebar.nav";

import type { UserRole } from "../../features/auth/types/user-role.enum";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();

  const { user, logout } = useAuth();

  const navItems = user ? sidebarNav[user.role as UserRole] : [];

  const getIcon = (label: string) => {
    switch (label) {
      case "Dashboard":
        return <LayoutDashboard className="w-5 h-5" strokeWidth={2} />;

      case "Users":
      case "Customers":
      case "Suppliers":
        return <Users className="w-5 h-5" strokeWidth={2} />;

      case "Orders":
      case "Supply Orders":
        return <ShoppingCart className="w-5 h-5" strokeWidth={2} />;

      case "Demands":
        return <ClipboardList className="w-5 h-5" strokeWidth={2} />;

      case "Procurement Contracts":
        return <FileText className="w-5 h-5" strokeWidth={2} />;

      default:
        return <Building2 className="w-5 h-5" strokeWidth={2} />;
    }
  };

  return (
    <aside
      className={`h-full bg-white shadow-md flex flex-col transition-all duration-200 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* HEADER */}
      <div className="h-16 flex items-center justify-between px-4">
        {!collapsed && (
          <div className="flex flex-col text-left">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
              WireBorder
            </h1>

            <p className="text-xs text-gray-500">
              Production Console
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-200 hover:border-blue-800 hover:text-blue-800 hover:shadow-md active:scale-[0.98]"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          ) : (
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          )}
        </button>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group
                  flex items-center
                  ${collapsed ? "justify-center" : "justify-between"}
                  gap-2
                  rounded-md
                  border
                  px-4
                  py-3
                  text-sm
                  font-medium
                  shadow-sm
                  transition-all
                  duration-200
                  active:scale-[0.98]

                  ${
                    active
                      ? `
                        border-blue-800
                        bg-gradient-to-br
                        from-blue-900
                        via-blue-800
                        to-indigo-900
                        text-white
                      `
                      : `
                        border-gray-200
                        bg-white
                        text-gray-500
                        hover:border-blue-800
                        hover:bg-blue-50
                        hover:text-blue-800
                        hover:shadow-md
                      `
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  {getIcon(item.label)}

                  {!collapsed && (
                    <span className="text-left">
                      {item.label}
                    </span>
                  )}
                </div>

                {!collapsed && active && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-gray-200 p-4">
        {!collapsed && (
          <div className="mb-4 border border-gray-200 rounded-md bg-gradient-to-br from-white to-blue-50/40 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "Authenticated User"}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {user?.role}
                </p>
              </div>

              <Truck
                className="w-5 h-5 text-blue-800"
                strokeWidth={2}
              />
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className={`
            w-full
            flex
            items-center
            ${collapsed ? "justify-center" : "justify-between"}
            gap-2
            rounded-md
            border
            border-blue-800
            bg-white
            px-4
            py-3
            text-blue-800
            font-medium
            transition-all
            duration-200
            hover:bg-blue-50
            active:scale-[0.98]
            disabled:opacity-40
          `}
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-5 h-5" strokeWidth={2} />

            {!collapsed && <span>Logout</span>}
          </div>

          {!collapsed && (
            <ChevronRight className="w-4 h-4" strokeWidth={2} />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;