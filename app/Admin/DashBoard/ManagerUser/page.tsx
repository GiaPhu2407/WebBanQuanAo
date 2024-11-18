"use client";

import React, { useState, useEffect } from "react";
import SalesDashboard from "../NvarbarAdmin";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TableUserDashboard from "../../TableManagerUser";

interface User {
  idUsers: number;
  Tentaikhoan: string;
  Matkhau?: string;
  Hoten: string;
  Sdt: string;
  Diachi: string;
  Email: string;
  idRole: number;
  Ngaydangky: string;
}

interface Toast {
  message: string;
  type: "error" | "success";
}

const Toast: React.FC<{
  message: string;
  type: "error" | "success";
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  return (
    <Alert
      className={`fixed top-4 right-4 w-96 z-50 ${
        type === "error" ? "bg-red-50" : "bg-green-50"
      }`}
    >
      <AlertDescription className="flex justify-between items-center">
        <span className="flex items-center">
          {type === "error" ? "❌" : "✅"}
          <span className="ml-2">{message}</span>
        </span>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>
      </AlertDescription>
    </Alert>
  );
};

const UserManagementPage: React.FC = () => {
  const initialFormData: User = {
    idUsers: 0,
    Tentaikhoan: "",
    Matkhau: "",
    Email: "",
    Hoten: "",
    Sdt: "",
    Diachi: "",
    idRole: 2,
    Ngaydangky: "",
  };

  const [formData, setFormData] = useState<User>(initialFormData);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const validateForm = () => {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

    if (!formData.Tentaikhoan.trim())
      errors.push("Vui lòng nhập tên tài khoản");
    if (!isEditing && !formData.Matkhau?.trim())
      errors.push("Vui lòng nhập mật khẩu");
    if (!formData.Email.trim()) errors.push("Vui lòng nhập email");
    if (!emailRegex.test(formData.Email)) errors.push("Email không hợp lệ");
    if (!formData.Hoten.trim()) errors.push("Vui lòng nhập họ tên");
    if (!formData.Sdt.trim()) errors.push("Vui lòng nhập số điện thoại");
    if (!phoneRegex.test(formData.Sdt))
      errors.push("Số điện thoại không hợp lệ");
    if (!formData.Diachi.trim()) errors.push("Vui lòng nhập địa chỉ");

    return errors;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      console.log(`Updated ${name} to ${value}`); // Log để kiểm tra
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setToast({ message: errors.join(", "), type: "error" });
      return;
    }

    console.log("Form Data Before Submission:", formData); // Kiểm tra giá trị formData

    try {
      const endpoint = isEditing
        ? `/api/user/${formData.idUsers}`
        : `/api/user`;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Có lỗi xảy ra");
      }

      setToast({
        message: isEditing ? "Cập nhật thành công" : "Thêm mới thành công",
        type: "success",
      });

      resetForm();
      setReloadKey((prev) => prev + 1); // Trigger reload after successful submit
    } catch (error) {
      console.error("Error:", error);
      setToast({
        message: error instanceof Error ? error.message : "Có lỗi xảy ra",
        type: "error",
      });
    }
  };

  const handleEdit = async (user: User) => {
    setFormData({
      ...user,
      Matkhau: isEditing ? "" : user.Matkhau, // Only reset password if editing
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      const response = await fetch(`/api/user/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Không thể xóa người dùng");

      setToast({ message: "Xóa người dùng thành công", type: "success" });
      setReloadKey((prev) => prev + 1); // Trigger reload after delete
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Có lỗi xảy ra",
        type: "error",
      });
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SalesDashboard />
      <div className="flex-1 p-8">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý người dùng
          </h1>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thêm người dùng
          </button>
        </div>

        {isModalOpen && (
          <dialog
            open
            className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-lg p-8 w-full max-w-3xl">
              <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {isEditing ? "Cập nhật người dùng" : "Thêm người dùng mới"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Input fields */}
                  {[
                    {
                      label: "Tên tài khoản",
                      name: "Tentaikhoan",
                      type: "text",
                    },
                    { label: "Mật khẩu", name: "Matkhau", type: "password" },
                    { label: "Email", name: "Email", type: "email" },
                    { label: "Họ tên", name: "Hoten", type: "text" },
                    { label: "Số điện thoại", name: "Sdt", type: "text" },
                    { label: "Địa chỉ", name: "Diachi", type: "text" },
                  ].map(({ label, name, type }) => (
                    <div key={name}>
                      <label className="block font-medium text-gray-700">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={formData[name as keyof User] || ""}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border rounded-lg w-full"
                        required
                        disabled={name === "Matkhau" && isEditing}
                      />
                    </div>
                  ))}

                  {/* Role selection */}
                  <div>
                    <label className="block font-medium text-gray-700">
                      Vai trò
                    </label>
                    <select
                      name="idRole"
                      value={formData.idRole}
                      onChange={handleInputChange}
                      className="mt-1 p-2 border rounded-lg w-full"
                    >
                      <option value={1}>Admin</option>
                      <option value={2}>User</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isEditing ? "Cập nhật" : "Thêm mới"}
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        <TableUserDashboard
          reloadKey={reloadKey}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default UserManagementPage;
