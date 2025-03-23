"use client";

import React, { useState, useEffect } from "react";
import SalesDashboard from "../NvarbarAdmin";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import TableUserDashboard from "../../TableManagerUser";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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

const UserManagementPage: React.FC = () => {
  // Initial form data với idRole mặc định là 2 (User)
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
  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // New state for delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // Validate form với regex cải thiện
  const validateForm = () => {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

    if (!formData.Tentaikhoan.trim())
      errors.push("Vui lòng nhập tên tài khoản");
    if (!isEditing && !formData.Matkhau?.trim())
      errors.push("Vui lòng nhập mật khẩu");
    if (!formData.Email.trim() || !emailRegex.test(formData.Email))
      errors.push("Email không hợp lệ");
    if (!formData.Hoten.trim()) errors.push("Vui lòng nhập họ tên");
    if (!formData.Sdt.trim() || !phoneRegex.test(formData.Sdt))
      errors.push("Số điện thoại không hợp lệ");
    if (!formData.Diachi.trim()) errors.push("Vui lòng nhập địa chỉ");

    return errors;
  };

  // Xử lý thay đổi input với kiểm tra type cho idRole
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedValue = name === "idRole" ? Number(value) : value;
      return {
        ...prev,
        [name]: updatedValue,
      };
    });
  };

  // Xử lý submit form với logging cải thiện
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Lỗi Xác Thực!",
        description: errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    const submissionData = {
      ...formData,
      idRole: Number(formData.idRole),
    };

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
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Có lỗi xảy ra");
      }

      toast({
        title: "Thành Công!",
        description: isEditing ? "Cập nhật thành công" : "Thêm mới thành công",
        variant: "success",
      });

      resetForm();
      setReloadKey((prev) => prev + 1);
    } catch (error) {
      toast({
        title: "Lỗi!",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra",
        variant: "destructive",
      });
    }
  };

  // Xử lý chỉnh sửa user
  const handleEdit = (user: User) => {
    setFormData({
      ...user,
      idRole: Number(user.idRole),
      Matkhau: "",
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Xử lý xóa user
  const handleDeleteRequest = (id: number) => {
    setUserToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/user/${userToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Không thể xóa người dùng");
      }

      toast({
        title: "Thành Công!",
        description: "Xóa người dùng thành công",
        variant: "success",
      });
      setReloadKey((prev) => prev + 1);
    } catch (error) {
      toast({
        title: "Lỗi!",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setIsModalOpen(false);
  };

  // Render component
  return (
    <div className="flex h-screen bg-gray-100">
      <SalesDashboard />
      <div className="flex-1 p-8 mt-16">
        <Toaster />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý người dùng
          </h1>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            Thêm người dùng
          </Button>
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
                  {/* Tên tài khoản */}
                  <div>
                    <label className="block font-medium text-gray-700">
                      Tên tài khoản
                    </label>
                    <input
                      type="text"
                      name="Tentaikhoan"
                      value={formData.Tentaikhoan}
                      onChange={handleInputChange}
                      className="mt-1 p-2 border rounded-lg w-full"
                      required
                    />
                  </div>

                  {/* Mật khẩu */}
                  <div>
                    <label className="block font-medium text-gray-700">
                      Mật khẩu
                    </label>
                    <input
                      type="password"
                      name="Matkhau"
                      value={formData.Matkhau || ""}
                      onChange={handleInputChange}
                      className="mt-1 p-2 border rounded-lg w-full"
                      required={!isEditing}
                      disabled={isEditing}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleInputChange}
                      className="mt-1 p-2 border rounded-lg w-full"
                      required
                    />
                  </div>

                  {/* Họ tên */}
                  <div>
                    <label className="block font-medium text-gray-700">
                      Họ tên
                    </label>
                    <input
                      type="text"
                      name="Hoten"
                      value={formData.Hoten}
                      onChange={handleInputChange}
                      className="mt-1 p-2 border rounded-lg w-full"
                      required
                    />
                  </div>

                  {/* Số điện thoại */}
                  <div>
                    <label className="block font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      name="Sdt"
                      value={formData.Sdt}
                      onChange={handleInputChange}
                      className="mt-1 p-2 border rounded-lg w-full"
                      required
                    />
                  </div>

                  {/* Địa chỉ */}
                  <div>
                    <label className="block font-medium text-gray-700">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      name="Diachi"
                      value={formData.Diachi}
                      onChange={handleInputChange}
                      className="mt-1 p-2 border rounded-lg w-full"
                      required
                    />
                  </div>

                  {/* Vai trò */}
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
                      <option value={1}>User</option>
                      <option value={2}>Admin</option>
                      <option value={3}>NhanVien</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button type="submit">
                    {isEditing ? "Cập nhật" : "Thêm mới"}
                  </Button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        <TableUserDashboard
          reloadKey={reloadKey}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa người dùng này? Hành động này không
                thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default UserManagementPage;
