"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Lock } from "lucide-react";

export default function ForgotPassword() {
  const router = useRouter();
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          contact: method === "email" ? email : phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset code");
      }

      setMessage(
        `Mã xác nhận đã được gửi đến ${
          method === "email" ? "email" : "số điện thoại"
        } của bạn`
      );
      setStep(2);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          contact: method === "email" ? email : phone,
          code: resetCode,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setMessage("Đặt lại mật khẩu thành công");
      setTimeout(() => {
        router.push("/Login");
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Quên mật khẩu
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 1
              ? "Chọn phương thức xác thực"
              : "Nhập mã xác nhận và mật khẩu mới"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestReset} className="mt-8 space-y-6">
            <div className="flex justify-center space-x-4 mb-6">
              <button
                type="button"
                onClick={() => setMethod("email")}
                className={`px-4 py-2 rounded-md ${
                  method === "email"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <Mail className="inline-block mr-2 h-5 w-5" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setMethod("phone")}
                className={`px-4 py-2 rounded-md ${
                  method === "phone"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <Phone className="inline-block mr-2 h-5 w-5" />
                Số điện thoại
              </button>
            </div>

            <div>
              <label
                htmlFor={method}
                className="block text-sm font-medium text-gray-700"
              >
                {method === "email" ? "Email" : "Số điện thoại"}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {method === "email" ? (
                    <Mail className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Phone className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <input
                  id={method}
                  name={method}
                  type={method === "email" ? "email" : "tel"}
                  required
                  value={method === "email" ? email : phone}
                  onChange={(e) =>
                    method === "email"
                      ? setEmail(e.target.value)
                      : setPhone(e.target.value)
                  }
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder={
                    method === "email"
                      ? "Nhập email của bạn"
                      : "Nhập số điện thoại của bạn"
                  }
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Gửi mã xác nhận
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="resetCode"
                className="block text-sm font-medium text-gray-700"
              >
                Mã xác nhận
              </label>
              <input
                id="resetCode"
                name="resetCode"
                type="text"
                required
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Nhập mã xác nhận"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu mới
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Đặt lại mật khẩu
              </button>
            </div>
          </form>
        )}

        <div className="text-center">
          <button
            onClick={() => router.push("/Login")}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
