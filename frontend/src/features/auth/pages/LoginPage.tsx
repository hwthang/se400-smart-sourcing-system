// pages/Auth/LoginPage.tsx

import React, { useState } from "react";
import { Link } from "react-router";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { useLogin } from "../hooks/useLogin";

const LoginPage = () => {
  const { mutate, isPending } = useLogin();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Chặn reload trang khi submit form
    if (!identifier || !password || isPending) return;

    mutate(
      { identifier, password },
      {
        onSuccess: (data) => {
          localStorage.setItem("accessToken", data.accessToken);
          window.location.href = "/console";
        },
        onError: (err: any) => {
          alert(err.message || "Something went wrong");
        },
      }
    );
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 overflow-hidden flex items-center justify-center p-4 font-sans">
      
      {/* EFFECT 1: LƯỚI HÌNH HỌC (GRID PATTERN BACKGROUND) */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70" />

      {/* EFFECT 2: CÁC CẦU SÁNG GRADIENT MỜ (BLURRED AMBIENT ORBS) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none mix-blend-multiply animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-400/20 blur-[140px] pointer-events-none mix-blend-multiply animate-pulse duration-[8000ms]" />

      {/* CONTAINER CHÍNH */}
      <div className="relative z-10 w-full max-w-md my-auto">
        
        {/* FORM CARD TRÊN NỀN KÍNH MỜ (GLASSMORPHISM WRAPPER) */}
        <div className="w-full rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-xl shadow-blue-950/5 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-950/10">
          
          {/* HEADER */}
          <div className="border-b border-slate-100 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-blue-700 to-transparent" />
            
            <div className="space-y-1.5">
              <h1 className="bg-gradient-to-r from-blue-950 via-blue-800 to-indigo-900 bg-clip-text text-3xl font-black tracking-tight text-transparent">
                Sign In
              </h1>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Procurement Management Workspace
              </p>
            </div>
          </div>

          {/* CONTENT CONTENT */}
          <form onSubmit={handleLogin} className="flex flex-col gap-6 p-8">
            
            {/* INPUT FIELDS */}
            <div className="space-y-4.5">
              
              {/* IDENTIFIER FIELD */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email or Username
                </label>
                <input
                  type="text"
                  required
                  disabled={isPending}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your registered identifier"
                  className="w-full rounded-lg border border-slate-200 bg-white/60 px-3.5 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition-all focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-700/5 focus:border-blue-700 placeholder:text-slate-400/80 disabled:opacity-50"
                />
              </div>

              {/* PASSWORD FIELD */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Password
                </label>
                <input
                  type="password"
                  required
                  disabled={isPending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 bg-white/60 px-3.5 py-2.5 text-sm font-mono text-slate-900 shadow-sm transition-all focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-700/5 focus:border-blue-700 placeholder:text-slate-400/80 disabled:opacity-50"
                />
              </div>

            </div>

            {/* ACTION CONTROLS */}
            <div className="flex flex-col gap-5 pt-2">
              
              <button
                type="submit"
                disabled={isPending || !identifier || !password}
                className="
                  w-full flex items-center justify-center gap-2 rounded-lg 
                  bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 
                  px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-900/10 
                  transition-all duration-200 hover:brightness-110 hover:shadow-lg active:scale-[0.99] 
                  disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed
                "
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span>SIGN IN TO WORKSPACE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* FOOTER ROUTE */}
              <div className="border-t border-slate-100 pt-5 text-center space-y-3">
                <p className="text-xs font-medium text-slate-400">
                  New to the infrastructure platform?
                </p>

                <Link
                  to="/register"
                  className="
                    inline-flex items-center justify-center w-full rounded-lg border border-slate-200
                    bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm
                    transition-all duration-200 hover:bg-slate-50 hover:text-blue-900 active:scale-[0.99]
                  "
                >
                  Create a node account
                </Link>
              </div>

            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;