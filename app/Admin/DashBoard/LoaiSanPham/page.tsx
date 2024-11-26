"use client";
import React, { useState, useEffect } from "react";
import SalesDashboard from "../NvarbarAdmin";
import TableTypeProduct from "../../TableTypeProduct";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface LoaiSanPham {
  idloaisanpham: number;
  tenloai: string;
  mota: string;
}

export default function LoaiSanPhamManagementPage() {
  const [formData, setFormData] = useState<LoaiSanPham>({
    idloaisanpham: 0,
    tenloai: "",
    mota: "",
  });

  const [loaisanphamList, setLoaisanphamList] = useState<LoaiSanPham[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentLoaiSanPhamId, setCurrentLoaiSanPhamId] = useState<
    number | null
  >(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLoaiSanPham();
  }, [reloadKey]);

  const fetchLoaiSanPham = async () => {
    try {
      const response = await fetch("/api/loaisanpham");
      const data = await response.json();
      setLoaisanphamList(data);
    } catch (err) {
      console.error("Failed to fetch loai san pham:", err);
      toast({
        title: "Lỗi!",
        description: "Không thể tải danh sách loại sản phẩm",
        variant: "destructive",
      });
    }
  };

  const validateForm = (): string | null => {
    if (!formData.tenloai.trim()) return "Vui lòng nhập tên loại sản phẩm";
    if (!formData.mota.trim()) return "Vui lòng nhập mô tả";
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    const url = currentLoaiSanPhamId
      ? `/api/loaisanpham/${currentLoaiSanPhamId}`
      : "/api/loaisanpham";
    const method = currentLoaiSanPhamId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Lỗi khi cập nhật loại sản phẩm");
      }

      toast({
        title: "Thành Công!",
        description: isEditing ? "Cập nhật thành công" : "Thêm mới thành công",
        variant: "success",
      });

      fetchLoaiSanPham();
      resetForm();
      setReloadKey((prev) => prev + 1);
      const data = document.getElementById("my_modal_3") as HTMLDialogElement;
      data.close();
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

  const handleEdit = (loaiSanPham: LoaiSanPham) => {
    setFormData(loaiSanPham);
    setCurrentLoaiSanPhamId(loaiSanPham.idloaisanpham);
    setIsEditing(true);
    const data = document.getElementById("my_modal_3") as HTMLDialogElement;
    data.showModal();
  };

  const resetForm = () => {
    setFormData({
      idloaisanpham: 0,
      tenloai: "",
      mota: "",
    });
    setCurrentLoaiSanPhamId(null);
    setIsEditing(false);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      try {
        const response = await fetch(`/api/loaisanpham/${deleteConfirmId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Không thể xóa loại sản phẩm.");
        }

        toast({
          title: "Thành Công!",
          description: "Loại sản phẩm đã được xóa thành công.",
          variant: "success",
        });

        setReloadKey((prevKey) => prevKey + 1);
        setDeleteConfirmId(null);
      } catch (err) {
        console.error("Error deleting loai san pham:", err);
        toast({
          title: "Lỗi!",
          description:
            err instanceof Error ? err.message : "Lỗi khi xóa loại sản phẩm.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleAddNewClick = () => {
    setIsEditing(false);
    resetForm();
    const data = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (data) {
      data.showModal();
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    const data = document.getElementById("my_modal_3") as HTMLDialogElement;
    data.close();
  };

  return (
    <div className="flex">
      <SalesDashboard />
      <div className="p-6 w-full max-w-5xl mx-auto">
        <Toaster />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold whitespace-nowrap">
            Quản lý loại sản phẩm
          </h1>
          <button className="btn btn-primary" onClick={handleAddNewClick}>
            Thêm loại sản phẩm
          </button>
        </div>

        {/* Modal thêm/sửa loại sản phẩm */}
        <dialog
          id="my_modal_3"
          className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="modal-box bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {isEditing ? "Cập nhật loại sản phẩm" : "Thêm loại sản phẩm"}
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
                    Tên loại sản phẩm
                  </label>
                  <input
                    type="text"
                    name="tenloai"
                    value={formData.tenloai}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    name="mota"
                    value={formData.mota}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Cập nhật" : "Thêm"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="btn btn-ghost"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>
        </dialog>

        {/* Bảng danh sách loại sản phẩm */}
        <div className="mt-4">
          <TableTypeProduct
            onEdit={handleEdit}
            onDelete={handleDelete}
            reloadKey={reloadKey}
          />
        </div>

        {/* Modal xác nhận xóa */}
        {deleteConfirmId && (
          <dialog
            open
            className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="modal-box bg-white rounded-lg shadow-xl p-6 text-center">
              <h3 className="font-bold text-lg mb-4">Xác Nhận Xóa</h3>
              <p className="mb-6">
                Bạn có chắc chắn muốn xóa loại sản phẩm này không?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleDeleteConfirm}
                  className="btn btn-error text-white"
                >
                  Xóa
                </button>
                <button onClick={handleCancelDelete} className="btn btn-ghost">
                  Hủy
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
}
