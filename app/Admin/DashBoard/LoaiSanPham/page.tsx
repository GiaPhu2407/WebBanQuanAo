"use client";
import React, { useState, useEffect } from "react";
import SalesDashboard from "../NvarbarAdmin";
import TableTypeProduct from "../../TableTypeProduct";

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
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentLoaiSanPhamId, setCurrentLoaiSanPhamId] = useState<
    number | null
  >(null);

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
      setError("Không thể tải danh sách loại sản phẩm");
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
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
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

      setSuccess(
        currentLoaiSanPhamId
          ? "Cập nhật loại sản phẩm thành công"
          : "Thêm loại sản phẩm thành công"
      );
      fetchLoaiSanPham(); // Gọi lại danh sách mà không cần tải lại trang
      resetForm();
      const data = document.getElementById("my_modal_3") as HTMLDialogElement; // Đóng modal sau khi submit thành công
      data.close();
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Lỗi khi xử lý yêu cầu");
    }
  };

  const handleEdit = (loaiSanPham: LoaiSanPham) => {
    setFormData(loaiSanPham);
    setCurrentLoaiSanPhamId(loaiSanPham.idloaisanpham);
    setIsEditing(true);
    const data = document.getElementById("my_modal_3") as HTMLDialogElement; // Mở modal
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

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa loại sản phẩm này?")) {
      try {
        const response = await fetch(`/api/loaisanpham/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Không thể xóa loại sản phẩm.");
        setSuccess("Loại sản phẩm đã được xóa thành công.");
        setReloadKey((prevKey) => prevKey + 1);
      } catch (err) {
        console.error("Error deleting loai san pham:", err);
        setError(
          err instanceof Error ? err.message : "Lỗi khi xóa loại sản phẩm."
        );
      }
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    const data = document.getElementById("my_modal_3") as HTMLDialogElement;
    data.close();
  };
  const handleAddNewClick = () => {
    setIsEditing(false);
    setFormData(formData);
    setCurrentLoaiSanPhamId(null);
    const data = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (data) {
      data.showModal();
    }
  };

  return (
    <div className="flex">
      <SalesDashboard />
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-evenly gap-[580px] ">
          <h1 className="text-2xl font-bold mb-4 whitespace-nowrap">
            Quản lý loại sản phẩm
          </h1>
          <button className="btn btn-primary" onClick={handleAddNewClick}>
            Thêm loại sản phẩm
          </button>
        </div>

        <dialog
          id="my_modal_3"
          className="modal fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
        >
          <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl relative">
            <button
              onClick={() => handleCancelEdit()}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}

            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {isEditing ? "Cập nhật loại sản phẩm" : "Thêm loại sản phẩm"}
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên loại sản phẩm
                  </label>
                  <input
                    type="text"
                    name="tenloai"
                    value={formData.tenloai}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả
                  </label>
                  <textarea
                    name="mota"
                    value={formData.mota}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isEditing ? "Cập nhật loại sản phẩm" : "Thêm loại sản phẩm"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>
        </dialog>

        <div className="mt-8">
          <TableTypeProduct
            onEdit={handleEdit}
            onDelete={handleDelete}
            reloadKey={reloadKey}
          />
        </div>
      </div>
    </div>
  );
}
