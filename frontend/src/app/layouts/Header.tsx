import React, { useState } from "react";

import {
  Bell,
  ChevronRight,
  ShieldCheck,
  User,
} from "lucide-react";

import UserProfileModal from "../../features/auth/components/UserProfileModal";

const Header = () => {
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-0 bg-white shadow-md">
        <div className="h-16 px-6 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md border border-blue-800 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center shadow-sm">
              <ShieldCheck
                className="w-5 h-5 text-white"
                strokeWidth={2}
              />
            </div>

            <div className="text-left">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                SE400 SYSTEM
              </h1>

              <p className="text-xs text-gray-500">
                Smart Sourcing Management Platform
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* NOTIFICATION */}
            <button
              className="
                relative
                w-10
                h-10
                rounded-full

                bg-white
                flex
                items-center
                justify-center
                text-gray-500
                transition-all
                duration-200
                hover:bg-blue-50
                active:scale-[0.98]
              "
            >
              <Bell className="w-5 h-5" strokeWidth={2} />

              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-800" />
            </button>

            {/* USER BUTTON */}
            <button
              onClick={() => setOpenProfile(true)}
              className="
                flex
                items-center
                gap-2
                rounded-md
                bg-white
                px-4
                py-2.5
                text-gray-900
                transition-all
                hover:text-blue-800
                active:scale-[0.98]
              "
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-800 flex items-center justify-center">
                <User
                  className="w-4 h-4 text-blue-800"
                  strokeWidth={2}
                />
              </div>

              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">
                  User Profile
                </span>

                <span className="text-xs text-gray-500">
                  Manage account
                </span>
              </div>

              <ChevronRight
                className="w-4 h-4 text-gray-500"
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      </header>

      {/* MODAL */}
      <UserProfileModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
      />
    </>
  );
};

export default Header;