"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import Footer from "./Footer";
import { User } from "../types/auth";
import Header from "./Header";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    Tentaikhoan: "",
    Email: "",
    Hoten: "",
    Sdt: "",
    Diachi: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        console.log("Fetched user data:", userData); // For debugging

        if (!userData || !userData.idUsers) {
          router.push("/Login");
          return;
        }

        // Update user state
        setUser(userData);

        // Update form data using the correct field names
        setFormData({
          Tentaikhoan: userData.Tentaikhoan || "",
          Email: userData.Email || "",
          Hoten: userData.Hoten || "",
          Sdt: userData.Sdt || "",
          Diachi: userData.Diachi || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage("Error loading user data");
        setMessageType("error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.idUsers) {
      setMessage("User ID not found");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(`/api/user/${user.idUsers}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      setMessage("Profile updated successfully!");
      setMessageType("success");
      setIsEditing(false);
      setUser((prev) => ({
        ...prev!,
        ...formData,
      }));
    } catch (error: any) {
      console.error("Update error:", error);
      setMessage(error.message);
      setMessageType("error");
    }

    setTimeout(() => {
      setMessage("");
      setMessageType(null);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="light"
      >
        <span className="loading loading-spinner text-blue-600 loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                Thông tin cá nhân
              </h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-md ${
                  isEditing
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white transition-colors`}
              >
                {isEditing ? "Hủy" : "Chỉnh sửa"}
              </button>
            </div>

            {message && (
              <div
                className={`mb-4 p-4 rounded-md flex items-center gap-2 ${
                  messageType === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {messageType === "success" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên tài khoản
                  </label>
                  <input
                    type="text"
                    name="Tentaikhoan"
                    value={formData.Tentaikhoan}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    name="Hoten"
                    value={formData.Hoten}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="Sdt"
                    value={formData.Sdt}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="Diachi"
                    value={formData.Diachi}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProfilePage;
