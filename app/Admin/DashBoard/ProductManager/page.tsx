"use client";
import React, { useEffect, useState } from "react";
import SalesDashboard from "../page";

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

export default function ProductManagementPage() {
  const initialFormData: FormData = {
    tensanpham: "",
    mota: "",
    gia: "",
    hinhanh: "",
    idloaisanpham: 0,
    giamgia: 0,
    gioitinh: "nam",
    size: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loaisanphamList, setLoaisanphamList] = useState<LoaiSanPham[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const VALID_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

  useEffect(() => {
    fetch("/api/loaisanpham")
      .then((response) => response.json())
      .then((data) => {
        console.log("Loai san pham data:", data);
        setLoaisanphamList(data);
      })
      .catch((err) => {
        console.error("Failed to fetch loai san pham:", err);
        setError("Không thể tải danh sách loại sản phẩm");
      });
  }, []);

  const validateForm = (): string | null => {
    if (!formData.tensanpham.trim()) return "Vui lòng nhập tên sản phẩm";
    if (!formData.mota.trim()) return "Vui lòng nhập mô tả";
    if (!formData.gia) return "Vui lòng nhập giá hợp lệ";
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
      setFormData((prev) => ({
        ...prev,
        idloaisanpham: parseInt(value) || 0,
      }));
    } else if (name === "giamgia") {
      setFormData((prev) => ({
        ...prev,
        giamgia: value === "" ? 0 : parseFloat(value),
      }));
    } else if (name === "gia") {
      setFormData((prev) => ({
        ...prev,
        gia: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSizeChange = (selectedSize: string) => {
    setFormData((prev) => {
      const currentSizes = prev.size.split(", ").filter(Boolean);
      const newSizes = currentSizes.includes(selectedSize)
        ? currentSizes.filter((size) => size !== selectedSize)
        : [...currentSizes, selectedSize];

      return {
        ...prev,
        size: newSizes.join(", "),
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Submitting data:", formData);

      const response = await fetch("/api/sanpham", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      console.log("Response:", response.status, responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create product");
      }

      setSuccess("Sản phẩm đã được tạo thành công");
      setFormData(initialFormData);
    } catch (err) {
      console.error("Error creating san pham:", err);
      setError(err instanceof Error ? err.message : "Lỗi khi tạo sản phẩm");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <SalesDashboard />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 mt-8 text-black">
          Quản Lý Sản Phẩm
        </h1>

        <div className="flex w-full">
          <div className="pt-6 w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                  {success}
                </div>
              )}

              <div className="flex justify-center w-full flex-wrap gap-4">
                {/* Tên Sản Phẩm và Loại Sản Phẩm */}
                <div className="flex w-full gap-4">
                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 mb-1">
                      Tên Sản Phẩm
                    </label>
                    <input
                      type="text"
                      name="tensanpham"
                      value={formData.tensanpham}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 mb-1">
                      Loại Sản Phẩm
                    </label>
                    <select
                      name="idloaisanpham"
                      value={formData.idloaisanpham}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
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
                </div>

                {/* Giá và Hình Ảnh */}
                <div className="flex w-full gap-4">
                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 mb-1">
                      Giá
                    </label>
                    <input
                      type="number"
                      name="gia"
                      value={formData.gia}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 mb-1">
                      Hình Ảnh URL
                    </label>
                    <input
                      type="url"
                      name="hinhanh"
                      value={formData.hinhanh}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Giảm Giá và Size */}
                <div className="flex w-full gap-4">
                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 mb-1">
                      Giảm Giá (%)
                    </label>
                    <input
                      type="number"
                      name="giamgia"
                      value={formData.giamgia}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 mb-1">
                      Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {VALID_SIZES.map((size) => (
                        <label
                          key={size}
                          className={`inline-flex items-center p-2 rounded cursor-pointer ${
                            formData.size.includes(size)
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.size.includes(size)}
                            onChange={() => handleSizeChange(size)}
                            className="mr-2"
                          />
                          <span>{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mô Tả và Giới Tính */}
                <div className="flex w-full gap-4">
                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 mb-1">
                      Mô Tả
                    </label>
                    <textarea
                      name="mota"
                      value={formData.mota}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block font-medium text-gray-700 mb-1">
                      Giới Tính
                    </label>
                    <div className="flex flex-col space-y-2 mt-2">
                      <label className="inline-flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                        <input
                          type="radio"
                          name="gioitinh"
                          value="nam"
                          checked={formData.gioitinh === "nam"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="ml-2">Nam</span>
                      </label>
                      <label className="inline-flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                        <input
                          type="radio"
                          name="gioitinh"
                          value="nu"
                          checked={formData.gioitinh === "nu"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="ml-2">Nữ</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Đang xử lý..." : "Thêm Sản Phẩm"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
