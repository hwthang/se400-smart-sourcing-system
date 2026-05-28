import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";

import { useRegister } from "../hooks/useRegister";

export enum UserRole {
  ADMIN = "ADMIN",
  SUPPLIER = "SUPPLIER",
  CUSTOMER = "CUSTOMER",
  EMPLOYEE = "EMPLOYEE",
}

const RegisterPage = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useRegister();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    role: UserRole.CUSTOMER,
  });

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
  });

  const clearPassword = () => {
    setForm((prev) => ({
      ...prev,
      password: "",
    }));
  };

  const validate = () => {
    const nextErrors = {
      email: "",
      username: "",
      password: "",
    };

    let isValid = true;

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
      isValid = false;
    }

    if (!form.username.trim()) {
      nextErrors.username = "Username is required";
      isValid = false;
    }

    if (form.password.length < 6) {
      nextErrors.password =
        "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(nextErrors);

    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (e.target.name in errors) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setForm({
      ...form,
      role,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please check your inputs");
      return;
    }

    mutate(form, {
      onSuccess: () => {
        toast.success("Register success");
        navigate("/login");
      },

      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Register failed";

        toast.error(message);

        clearPassword();
      },
    });
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-md items-center justify-center">
        <div className="w-full rounded-md border border-gray-200 bg-gradient-to-br from-white to-blue-50/40 shadow-sm">
          {/* HEADER */}
          <div className="border-b-2 border-blue-800 p-6">
            <div className="flex flex-col gap-1">
              <h1 className="bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-3xl font-bold text-transparent">
                Create Account
              </h1>

              <p className="text-sm text-gray-500">
                Register a new procurement workspace account
              </p>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 p-6"
          >
            {/* EMAIL */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-900">
                Email
              </label>

              <input
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className={`w-full rounded-md bg-white px-3 py-2.5 text-gray-900 shadow-sm transition-all placeholder:text-gray-500 focus:outline-none focus:ring-4 ${
                  errors.email
                    ? "border border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border border-gray-200 focus:border-2 focus:border-blue-800 focus:ring-blue-800/10"
                }`}
              />

              {errors.email && (
                <div className="rounded-md border border-gray-200 bg-white p-2 text-sm text-red-500 shadow-sm">
                  {errors.email}
                </div>
              )}
            </div>

            {/* USERNAME */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-900">
                Username
              </label>

              <input
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                className={`w-full rounded-md bg-white px-3 py-2.5 text-gray-900 shadow-sm transition-all placeholder:text-gray-500 focus:outline-none focus:ring-4 ${
                  errors.username
                    ? "border border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border border-gray-200 focus:border-2 focus:border-blue-800 focus:ring-blue-800/10"
                }`}
              />

              {errors.username && (
                <div className="rounded-md border border-gray-200 bg-white p-2 text-sm text-red-500 shadow-sm">
                  {errors.username}
                </div>
              )}
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-900">
                Password
              </label>

              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className={`w-full rounded-md bg-white px-3 py-2.5 text-gray-900 shadow-sm transition-all placeholder:text-gray-500 focus:outline-none focus:ring-4 ${
                  errors.password
                    ? "border border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border border-gray-200 focus:border-2 focus:border-blue-800 focus:ring-blue-800/10"
                }`}
              />

              {errors.password && (
                <div className="rounded-md border border-gray-200 bg-white p-2 text-sm text-red-500 shadow-sm">
                  {errors.password}
                </div>
              )}
            </div>

            {/* ROLE */}
            <div className="rounded-md border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 p-4">
                <h2 className="text-sm font-medium text-gray-900">
                  Select Role
                </h2>
              </div>

              <div className="flex gap-4 p-4">
                <button
                  type="button"
                  onClick={() =>
                    handleRoleChange(UserRole.CUSTOMER)
                  }
                  className={`flex-1 rounded-md border px-4 py-3 text-left text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
                    form.role === UserRole.CUSTOMER
                      ? "border-blue-800 bg-blue-50 text-blue-800 shadow-md"
                      : "border-gray-200 bg-white text-gray-900 hover:border-blue-800 hover:bg-blue-50 hover:shadow-md"
                  }`}
                >
                  CUSTOMER
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleRoleChange(UserRole.SUPPLIER)
                  }
                  className={`flex-1 rounded-md border px-4 py-3 text-left text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
                    form.role === UserRole.SUPPLIER
                      ? "border-blue-800 bg-blue-50 text-blue-800 shadow-md"
                      : "border-gray-200 bg-white text-gray-900 hover:border-blue-800 hover:bg-blue-50 hover:shadow-md"
                  }`}
                >
                  SUPPLIER
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md border border-blue-900/50 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:brightness-110 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isPending ? "CREATING ACCOUNT..." : "REGISTER"}
            </button>
          </form>

          {/* FOOTER */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex flex-col gap-3 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?
              </p>

              <div>
                <Link
                  to="/login"
                  className="inline-flex rounded-md border border-blue-800 bg-white px-5 py-2.5 text-sm font-medium text-blue-800 transition-all duration-200 hover:bg-blue-50 active:scale-[0.98]"
                >
                  Go to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;