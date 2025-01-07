"use client";
import React, { useState, useEffect } from "react";
import SalesDashboard from "../NvarbarAdmin";
import TableSupplier from "../../TableSuppler";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
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
import { ExportButtons } from "./XuatExcel/exportButton";

interface NhaCungCap {
  idnhacungcap: number;
  tennhacungcap: string;
  sodienthoai: string;
  diachi: string;
  email: string;
  trangthai: boolean;
}

export default function NhaCungCapManagementPage() {
  const [formData, setFormData] = useState<NhaCungCap>({
    idnhacungcap: 0,
    tennhacungcap: "",
    sodienthoai: "",
    diachi: "",
    email: "",
    trangthai: true,
  });

  const [nhacungcapList, setNhacungcapList] = useState<NhaCungCap[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentNhaCungCapId, setCurrentNhaCungCapId] = useState<number | null>(
    null
  );
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchNhaCungCap = async () => {
    try {
      const response = await fetch("/api/nhacungcap");
      const data = await response.json();
      setNhacungcapList(data);
    } catch (err) {
      console.error("Failed to fetch nha cung cap:", err);
      toast({
        title: "Lỗi!",
        description: "Không thể tải danh sách nhà cung cấp",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchNhaCungCap();
  }, []);

  const validateForm = (): string | null => {
    if (!formData.tennhacungcap.trim()) return "Vui lòng nhập tên nhà cung cấp";
    if (!formData.sodienthoai.trim()) return "Vui lòng nhập số điện thoại";
    if (!formData.diachi.trim()) return "Vui lòng nhập địa chỉ";
    if (!formData.email.trim()) return "Vui lòng nhập email";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Email không hợp lệ";
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.sodienthoai))
      return "Số điện thoại không hợp lệ";
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const finalValue =
      name === "trangthai"
        ? value === "true"
        : type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Lỗi Xác Thực!",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    const url = currentNhaCungCapId
      ? `/api/nhacungcap/${currentNhaCungCapId}`
      : "/api/nhacungcap";
    const method = currentNhaCungCapId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Lỗi khi thêm/cập nhật nhà cung cấp"
        );
      }

      toast({
        title: "Thành Công!",
        description: isEditing
          ? "Cập nhật nhà cung cấp thành công"
          : "Thêm nhà cung cấp thành công",
        variant: "success",
      });

      fetchNhaCungCap();
      resetForm();
      setReloadKey((prev) => prev + 1);
      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      modal.close();
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: "Lỗi!",
        description:
          err instanceof Error ? err.message : "Lỗi khi xử lý yêu cầu",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      try {
        const response = await fetch(`/api/nhacungcap/${deleteConfirmId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Không thể xóa nhà cung cấp");
        }

        toast({
          title: "Thành Công!",
          description: "Nhà cung cấp đã được xóa thành công",
          variant: "success",
        });

        setReloadKey((prev) => prev + 1);
        setDeleteConfirmId(null);
      } catch (err) {
        console.error("Error deleting nha cung cap:", err);
        toast({
          title: "Lỗi!",
          description:
            err instanceof Error ? err.message : "Lỗi khi xóa nhà cung cấp",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const handleEdit = (nhacungcap: NhaCungCap) => {
    setFormData(nhacungcap);
    setCurrentNhaCungCapId(nhacungcap.idnhacungcap);
    setIsEditing(true);
    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    modal.showModal();
  };

  const resetForm = () => {
    setFormData({
      idnhacungcap: 0,
      tennhacungcap: "",
      sodienthoai: "",
      diachi: "",
      email: "",
      trangthai: true,
    });
    setCurrentNhaCungCapId(null);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    resetForm();
    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    modal.close();
  };

  const handleAddNewClick = () => {
    setIsEditing(false);
    resetForm();
    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };
  

  return (
    <div className="flex">
      <SalesDashboard />
      <div className="p-6 w-full max-w-5xl mx-auto">
        <Toaster />

        <div className="flex items-center justify-between mb-6 mt-16">
          <h1 className="text-2xl font-bold whitespace-nowrap">
            Quản lý nhà cung cấp
          </h1>
          <ExportButtons data={[]}/>
          <Button onClick={handleAddNewClick}>Thêm nhà cung cấp</Button>
        </div>

        {/* Modal thêm/sửa nhà cung cấp */}
        <dialog
          id="my_modal_3"
          className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="modal-box bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {isEditing ? "Cập nhật nhà cung cấp" : "Thêm nhà cung cấp"}
                </h2>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên nhà cung cấp
                  </label>
                  <input
                    type="text"
                    name="tennhacungcap"
                    value={formData.tennhacungcap}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    name="sodienthoai"
                    value={formData.sodienthoai}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="diachi"
                    value={formData.diachi}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    name="trangthai"
                    value={formData.trangthai.toString()}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="true">Đang cung cấp</option>
                    <option value="false">Ngừng cung cấp</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button type="submit">{isEditing ? "Cập nhật" : "Thêm"}</Button>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    Hủy
                  </Button>
                )}
              </div>
            </form>
          </div>
        </dialog>

        {/* Bảng danh sách nhà cung cấp */}
        <div className="mt-4">
          <TableSupplier
            onEdit={handleEdit}
            onDelete={handleDelete}
            reloadKey={reloadKey}
          />
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={deleteConfirmId !== null}
          onOpenChange={() => setDeleteConfirmId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa nhà cung cấp này? Hành động này không
                thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteConfirmId(null)}>
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
