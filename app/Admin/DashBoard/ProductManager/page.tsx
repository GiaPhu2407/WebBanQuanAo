"use client";
import React, { useState, useEffect } from "react";
import SalesDashboard from "../page";
import Tabledashboard from "../../TableProduct";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);

  useEffect(() => {
    fetchLoaiSanPham();
  }, []);

  const fetchLoaiSanPham = async () => {
    try {
      const response = await fetch("/api/loaisanpham");
      const data = await response.json();
      console.log("Loai san pham data:", data);
      setLoaisanphamList(data);
    } catch (err) {
      console.error("Failed to fetch loai san pham:", err);
      setError("Không thể tải danh sách loại sản phẩm");
    }
  };

  const validateForm = (): string | null => {
    if (!formData.tensanpham.trim()) return "Vui lòng nhập tên sản phẩm";
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      // Kiểm tra xem kích thước đã được chọn hay chưa
      const sizeSet = new Set(prev.size.split(",").map((s) => s.trim())); // Chuyển đổi thành Set để dễ dàng thêm/xóa kích thước

      if (sizeSet.has(selectedSize)) {
        sizeSet.delete(selectedSize); // Nếu đã chọn thì xóa
      } else {
        sizeSet.add(selectedSize); // Nếu chưa chọn thì thêm
      }

      // Trả về một đối tượng mới với tất cả các thuộc tính của FormData
      return {
        ...prev,
        size: Array.from(sizeSet).join(","), // Chuyển đổi lại thành chuỗi để lưu vào formData
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const url = isSubmitting
      ? `/api/sanpham/${currentProductId}`
      : "/api/sanpham";
    const method = isSubmitting ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to ${isSubmitting ? "update" : "create"} product`
        );
      }

      const data = await response.json();
      setSuccess(data.message);
      setFormData(formData);
      setIsSubmitting(false);
      setCurrentProductId(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Error ${isSubmitting ? "updating" : "creating"} product`
      );
    }
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
    setCurrentProductId(null); // Reset ID sản phẩm hiện tại
  };

  const handleEdit = (product: SanPham) => {
    setFormData({
      tensanpham: product.tensanpham,
      mota: product.mota,
      gia: product.gia.toString(),
      hinhanh: product.hinhanh,
      idloaisanpham: product.idloaisanpham,
      giamgia: product.giamgia,
      gioitinh: product.gioitinh ? "nam" : "nu",
      size: product.size.toString(), //+
    });
    setIsSubmitting(true);
    setCurrentProductId(product.idsanpham); // Thiết lập ID sản phẩm hiện tại
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/sanpham/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Không thể xóa sản phẩm.");
      setSuccess("Sản phẩm đã được xóa thành công.");
      setReloadKey((prevKey) => prevKey + 1); // Reload the table data
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err instanceof Error ? err.message : "Lỗi khi xóa sản phẩm.");
    }
  };

  return (
    <div className="flex">
      <SalesDashboard />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h1>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
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
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="mota"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mô tả
                </label>
                <input
                  type="text"
                  name="mota"
                  value={formData.mota}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="gia"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="hinhanh"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="idloaisanpham"
                  className="block text-sm font-medium text-gray-700"
                >
                  Loại sản phẩm
                </label>
                <select
                  name="idloaisanpham"
                  value={formData.idloaisanpham}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value={0}>Chọn loại sản phẩm</option>
                  {loaisanphamList.map((loai) => (
                    <option key={loai.idloaisanpham} value={loai.idloaisanpham}>
                      {loai.tenloai}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="giamgia"
                  className="block text-sm font-medium text-gray-700"
                >
                  Giảm giá (%)
                </label>
                <input
                  type="number"
                  name="giamgia"
                  value={formData.giamgia}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Giới tính
                </label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="gioitinh"
                      value="nam"
                      checked={formData.gioitinh === "nam"}
                      onChange={handleChange}
                    />
                    Nam
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gioitinh"
                      value="nu"
                      checked={formData.gioitinh === "nu"}
                      onChange={handleChange}
                    />
                    Nữ
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kích thước
                </label>
                <div className="flex flex-wrap">
                  {VALID_SIZES.map((size) => (
                    <label key={size} className="mr-4">
                      <input
                        type="checkbox"
                        checked={formData.size.split(",").includes(size)} // Kiểm tra xem kích thước có trong mảng đã chọn không
                        onChange={() => handleSizeChange(size)}
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {isSubmitting ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Đặt lại
            </button>
          </form>
        </div>
        <Tabledashboard
          reloadKey={reloadKey}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
