"use client";
import React, { useState, useEffect } from "react";
import { X, Key } from "lucide-react";
import Link from "next/link";

interface ProfileSettingsProps {
  userData: {
    username: string;
    fullname: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
  };
  onClose: () => void;
  onUpdate: (updatedData: any) => void;
  onChangePassword: () => void;
}

export default function ProfileSettings({
  userData,
  onClose,
  onUpdate,
  onChangePassword,
}: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: userData.fullname,
    phone: userData.phone || "",
    address: userData.address || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [displayData, setDisplayData] = useState(userData);
  const [UserData, setUserData] = useState(userData);

  useEffect(() => {
    setFormData({
      fullname: userData.fullname,
      phone: userData.phone || "",
      address: userData.address || "",
    });
    setDisplayData(userData);
  }, [userData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Bạn chưa đăng nhập. Vui lòng thử lại!");
      }

      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Có lỗi xảy ra khi cập nhật thông tin."
        );
      }

      // Cập nhật state để phản ánh thay đổi ngay lập tức
      const updatedUser = {
        ...displayData,
        ...formData,
      };

      setDisplayData(updatedUser);
      setFormData(updatedUser);
      updateLocalStorage(updatedUser);
      setUserData(updatedUser); // Cập nhật state cha để phản ánh thay đổi

      // Gọi hàm onUpdate nếu có
      if (onUpdate) {
        onUpdate(updatedUser);
      }

      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
      console.error("Lỗi chi tiết:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocalStorage = (updatedUser: any) => {
    try {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        const updatedUserData = {
          ...userData,
          fullname: updatedUser.fullname,
          phone: updatedUser.phone,
          address: updatedUser.address,
        };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
      } else {
        localStorage.setItem("userData", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullname: displayData.fullname,
      phone: displayData.phone || "",
      address: displayData.address || "",
    });
    setError("");
  };

  const getRoleDisplayName = (roleId: string) => {
    const roleMap: Record<string, string> = {
      admin: "Admin",
      staff: "Staff",
      user: "User",
      nhanvien: "Nhân Viên",
    };

    const normalizedRole = roleId.toLowerCase();
    return roleMap[normalizedRole] || roleId;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Profile Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleUpdateUser} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={displayData.username}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                  isEditing ? "bg-white" : "bg-gray-50"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={displayData.email}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                  isEditing ? "bg-white" : "bg-gray-50"
                }`}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                readOnly={!isEditing}
                rows={3}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                  isEditing ? "bg-white" : "bg-gray-50"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                type="text"
                value={getRoleDisplayName(displayData.role)}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={onChangePassword}
                className="mt-1 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Key className="w-4 h-4 mr-2" />
                <Link href="/ChangePassword">Change Password</Link>
              </button>
            </div>
          </div>

          <div className="px-0 py-4 flex justify-end rounded-b-lg space-x-4 mt-6">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Save Changes"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
