"use client";
import React, { useState, useEffect } from "react";
import SalesDashboard from "../NvarbarAdmin";
import UserManagementTable from "../../TableManagerUser";

// Base User interface
interface User {
  idUsers: number;
  Tentaikhoan: string;
  MatKhau: string;
  Email: string;
  Hoten: string;
  Sdt: string;
  DiaChi: string;
  idRole: number;
}

interface ToastProps {
  message: string;
  type: "error" | "success";
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transform transition-transform duration-300 z-50 ${
        isVisible ? "translate-x-0" : "translate-x-full"
      } ${
        type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
      }`}
    >
      <div className="flex items-center">
        <span className="mr-2">{type === "error" ? "❌" : "✅"}</span>
        <p className="font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

const UserManagementPage: React.FC = () => {
  const initialFormData: User = {
    idUsers: 0,
    Tentaikhoan: "",
    MatKhau: "",
    Email: "",
    Hoten: "",
    Sdt: "",
    DiaChi: "",
    idRole: 2,
  };

  const [formData, setFormData] = useState<User>(initialFormData);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    if (error || success) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        setError("");
        setSuccess("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const validateForm = (): string | null => {
    if (!formData.Tentaikhoan.trim()) return "Vui lòng nhập tên tài khoản";
    if (!isEditing && !formData.MatKhau.trim()) return "Vui lòng nhập mật khẩu";
    if (!formData.Email.trim()) return "Vui lòng nhập email";
    if (!formData.Hoten.trim()) return "Vui lòng nhập họ tên";
    if (!formData.Sdt.trim()) return "Vui lòng nhập số điện thoại";
    if (!formData.DiaChi.trim()) return "Vui lòng nhập địa chỉ";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.Email)) return "Email không hợp lệ";

    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.Sdt)) return "Số điện thoại không hợp lệ";

    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Prepare the data for submission
      let submitData: any = {
        ...formData,
        idRole: Number(formData.idRole),
      };

      // If editing and password is empty, remove it
      if (isEditing && !formData.MatKhau.trim()) {
        const { MatKhau, ...dataWithoutPassword } = submitData;
        submitData = dataWithoutPassword;
      }

      // Determine the correct URL and method
      const url = isEditing ? `/api/user${currentUserId}` : "/api/user";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(submitData),
        credentials: "include", // Add this to include cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Lỗi khi thêm/cập nhật người dùng"
        );
      }

      // Handle successful response
      setSuccess(
        isEditing
          ? "Cập nhật người dùng thành công"
          : "Thêm người dùng thành công"
      );

      // Reset form and close modal
      resetForm();
      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (modal) {
        modal.close();
      }

      // Trigger table reload
      setReloadKey((prev) => prev + 1);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Lỗi khi xử lý yêu cầu");
    }
  };

  const handleEdit = async (user: User) => {
    try {
      // Fetch the current user data
      const response = await fetch(`/api/user${user.idUsers}`);
      if (!response.ok) {
        throw new Error("Không thể lấy thông tin người dùng");
      }

      const userData = await response.json();

      // Set the form data with the fetched user data
      setFormData({
        ...userData,
        MatKhau: "", // Reset password field
      });

      setCurrentUserId(user.idUsers);
      setIsEditing(true);

      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (modal) {
        modal.showModal();
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Không thể lấy thông tin người dùng");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        const response = await fetch(`/api/user${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Không thể xóa người dùng");
        }

        setSuccess("Người dùng đã được xóa thành công");
        setReloadKey((prev) => prev + 1);
      } catch (err) {
        console.error("Error deleting user:", err);
        setError(err instanceof Error ? err.message : "Lỗi khi xóa người dùng");
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentUserId(null);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    resetForm();
    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  const handleAddNewClick = () => {
    resetForm();
    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <div className="flex">
      <SalesDashboard />
      <div className="p-6 max-w-6xl mx-auto">
        {(error || success) && (
          <Toast
            message={error || success}
            type={error ? "error" : "success"}
            isVisible={showToast}
            onClose={() => {
              setShowToast(false);
              setError("");
              setSuccess("");
            }}
          />
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
          <button
            onClick={handleAddNewClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Thêm người dùng
          </button>
        </div>

        <dialog
          id="my_modal_3"
          className="modal fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
        >
          <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl relative">
            <button
              onClick={handleCancelEdit}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {isEditing ? "Cập nhật người dùng" : "Thêm người dùng"}
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên tài khoản
                  </label>
                  <input
                    type="text"
                    name="Tentaikhoan"
                    value={formData.Tentaikhoan}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mật khẩu {isEditing && "(để trống nếu không thay đổi)"}
                  </label>
                  <input
                    type="password"
                    name="MatKhau"
                    value={formData.MatKhau}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
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
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
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
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    name="Sdt"
                    value={formData.Sdt}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="DiaChi"
                    value={formData.DiaChi}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vai trò
                  </label>
                  <select
                    name="idRole"
                    value={formData.idRole}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>User</option>
                  </select>
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {isEditing ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </dialog>

        <div className="mt-8">
          <UserManagementTable
            onEdit={handleEdit}
            onDelete={handleDelete}
            reloadKey={reloadKey}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
