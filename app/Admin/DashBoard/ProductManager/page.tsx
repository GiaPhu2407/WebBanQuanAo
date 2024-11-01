"use client";
import React, { useState, useEffect } from "react";
import SalesDashboard from "../page";
import Tabledashboard from "../../TableProduct";
import { Pencil, Trash2 } from "lucide-react";

interface LoaiSanPham {
  idloaisanpham: number;
  tenloai: string;
  mota: string;
}

interface FormData {
  tensanpham: string;
  mota: string;
  gia: string;
  hinhanh: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: string;
  size: string;
}

interface SanPham {
  idsanpham: number;
  tensanpham: string;
  mota: string;
  gia: string;
  hinhanh: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: string;
  size: string;
}

const VALID_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

export default function ProductManagementPage() {
  const [formData, setFormData] = useState<FormData>({
    tensanpham: "",
    mota: "",
    gia: "",
    hinhanh: "",
    idloaisanpham: 0,
    giamgia: 0,
    gioitinh: "nam",
    size: "",
  });

  const [loaisanphamList, setLoaisanphamList] = useState<LoaiSanPham[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);

  useEffect(() => {
    fetchLoaiSanPham();
  }, []);

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
    if (!formData.tensanpham.trim() && !isEditing)
      return "Vui lòng nhập tên sản phẩm";
    if (!formData.mota.trim()) return "Vui lòng nhập mô tả";
    if (!formData.gia || isNaN(Number(formData.gia)))
      return "Vui lòng nhập giá hợp lệ";
    if (!formData.hinhanh.trim()) return "Vui lòng nhập URL hình ảnh";
    if (!formData.idloaisanpham) return "Vui lòng chọn loại sản phẩm";
    if (formData.size.length === 0) return "Vui lòng chọn ít nhất một size";
    if (formData.giamgia < 0 || formData.giamgia > 100)
      return "Giảm giá phải từ 0 đến 100";
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "idloaisanpham") {
      setFormData((prev) => ({ ...prev, idloaisanpham: parseInt(value) || 0 }));
    } else if (name === "giamgia") {
      setFormData((prev) => ({
        ...prev,
        giamgia: value === "" ? 0 : parseFloat(value),
      }));
    } else if (name === "gia") {
      setFormData((prev) => ({ ...prev, gia: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSizeChange = (selectedSize: string) => {
    setFormData((prev: FormData) => {
      const sizeSet = new Set(
        prev.size
          .split(",")
          .filter(Boolean)
          .map((s) => s.trim())
      );
      if (sizeSet.has(selectedSize)) {
        sizeSet.delete(selectedSize);
      } else {
        sizeSet.add(selectedSize);
      }
      return {
        ...prev,
        size: Array.from(sizeSet).join(","),
      };
    });
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

    const url = currentProductId
      ? `/api/sanpham/${currentProductId}`
      : "/api/sanpham";

    const method = currentProductId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tensanpham: formData.tensanpham,
          mota: formData.mota,
          gia: formData.gia,
          hinhanh: formData.hinhanh,
          idloaisanpham: parseInt(formData.idloaisanpham.toString()),
          giamgia: parseFloat(formData.giamgia.toString()),
          gioitinh: formData.gioitinh,
          size: formData.size,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Lỗi khi cập nhật sản phẩm");
      }

      setSuccess(
        currentProductId
          ? "Cập nhật sản phẩm thành công"
          : "Thêm sản phẩm thành công"
      );
      resetForm();
      setReloadKey((prev) => prev + 1);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Lỗi khi xử lý yêu cầu");
    }
  };

  const handleEdit = (product: SanPham) => {
    setFormData({
      tensanpham: product.tensanpham,
      mota: product.mota,
      gia: product.gia.toString(),
      hinhanh: product.hinhanh,
      idloaisanpham: product.idloaisanpham,
      giamgia: product.giamgia,
      gioitinh: product.gioitinh,
      size: product.size || "",
    });
    setCurrentProductId(product.idsanpham);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      tensanpham: "",
      mota: "",
      gia: "",
      hinhanh: "",
      idloaisanpham: 0,
      giamgia: 0,
      gioitinh: "nam",
      size: "",
    });
    setCurrentProductId(null);
    setIsEditing(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const response = await fetch(`/api/sanpham/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Không thể xóa sản phẩm.");
        setSuccess("Sản phẩm đã được xóa thành công.");
        setReloadKey((prevKey) => prevKey + 1);
      } catch (err) {
        console.error("Error deleting product:", err);
        setError(err instanceof Error ? err.message : "Lỗi khi xóa sản phẩm.");
      }
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const ActionButtons = ({ product }: { product: SanPham }) => {
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => handleEdit(product)}
          className="p-1 hover:bg-gray-100 rounded"
          title="Sửa sản phẩm"
        >
          <Pencil className="h-5 w-5 text-blue-600" />
        </button>
        <button
          onClick={() => handleDelete(product.idsanpham)}
          className="p-1 hover:bg-gray-100 rounded"
          title="Xóa sản phẩm"
        >
          <Trash2 className="h-5 w-5 text-red-600" />
        </button>
      </div>
    );
  };

  return (
    <div className="flex">
      <SalesDashboard />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="tensanpham"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  name="tensanpham"
                  value={formData.tensanpham}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              {/* Các trường form khác giữ nguyên */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả
                  </label>
                  <textarea
                    name="mota"
                    value={formData.mota}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giá
                  </label>
                  <input
                    type="number"
                    name="gia"
                    value={formData.gia}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hình ảnh (URL)
                  </label>
                  <input
                    type="text"
                    name="hinhanh"
                    value={formData.hinhanh}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loại sản phẩm
                  </label>
                  <select
                    name="idloaisanpham"
                    value={formData.idloaisanpham}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Chọn loại sản phẩm</option>
                    {loaisanphamList.map((loai) => (
                      <option
                        key={loai.idloaisanpham}
                        value={loai.idloaisanpham}
                      >
                        {loai.tenloai}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giảm giá (%)
                  </label>
                  <input
                    type="number"
                    name="giamgia"
                    value={formData.giamgia}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    Kích thước
                  </span>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {VALID_SIZES.map((size) => (
                      <label key={size} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600"
                          checked={formData.size.split(",").includes(size)}
                          onChange={() => handleSizeChange(size)}
                        />
                        <span className="ml-2">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    Giới tính
                  </span>
                  <div className="mt-2 space-x-6">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gioitinh"
                        value="nam"
                        checked={formData.gioitinh === "nam"}
                        onChange={handleChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">Nam</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gioitinh"
                        value="nu"
                        checked={formData.gioitinh === "nu"}
                        onChange={handleChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">Nữ</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="mt-8">
          <Tabledashboard
            key={reloadKey}
            onEdit={handleEdit}
            onDelete={handleDelete}
            // ActionButtons={ActionButtons}
            reloadKey={reloadKey}
          />
        </div>
      </div>
    </div>
  );
}
