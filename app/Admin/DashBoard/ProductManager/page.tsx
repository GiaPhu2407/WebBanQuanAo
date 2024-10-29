"use client";
import React, { useEffect, useState } from "react";
import SalesDashboard from "../page";

interface Loaisanpham {
  idloaisanpham: number;
  tenloai: string;
  mota: string;
}

interface Sanpham {
  tensanpham: string;
  mota: string;
  gia: string;
  hinhanh: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: boolean;
  size: string;
}

// Define FormData type based on Sanpham
type FormData = Omit<Sanpham, "idloaisanpham"> & { idloaisanpham: string };

export default function ProductManagementPage() {
  const initialFormData: FormData = {
    tensanpham: "",
    mota: "",
    gia: "",
    hinhanh: "",
    idloaisanpham: "0", // changed to string for controlled input
    giamgia: 0,
    gioitinh: false,
    size: "",
  };

  //   interface LoaiXe {
  //     idLoaiXe: number;
  //     TenLoai: string;
  //   }

  //   interface FormData {
  //     TenXe: string;
  //     idLoaiXe: string;
  //     GiaXe: string;
  //     MauSac: string;
  //     DongCo: string;
  //     TrangThai: string;
  //     HinhAnh: string;
  //     NamSanXuat: string;
  //   }

  //   export default function ProductManagementPage() {
  //     const initialFormData: FormData = {
  //       TenXe: '',
  //       idLoaiXe: '',
  //       GiaXe: '',
  //       MauSac: '',
  //       DongCo: '',
  //       TrangThai: '',
  //       HinhAnh: '',
  //       NamSanXuat: '',
  //     };
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loaisanphamList, setLoaisanphamList] = useState<Loaisanpham[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    fetch("/api/loaisanpham")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch loai san pham data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Loai san pham data:", data);
        setLoaisanphamList(data);
      })
      .catch((err) => {
        setError("Failed to fetch loai san pham data");
        console.error("Failed to fetch loai san pham", err);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Convert idloaisanpham to number before sending
    const dataToSubmit = {
      ...formData,
      idloaisanpham: Number(formData.idloaisanpham),
    };

    // Validate size input
    const validSizes = ["S", "M", "XL", "2XL", "3XL"];
    if (!validSizes.includes(formData.size)) {
      setError(
        "Kích thước không hợp lệ. Vui lòng chọn từ S, M, XL, 2XL, hoặc 3XL."
      );
      return;
    }

    try {
      const response = await fetch("/api/sanpham", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }

      const data = await response.json();
      setSuccess(data.message || "Product created successfully");
      setFormData(initialFormData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating product");
      console.error("Error creating san pham:", err);
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
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  {success}
                </div>
              )}

              <div className="flex justify-center w-full flex-wrap gap-4">
                <div className="flex w-full gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="tensanpham"
                      className="block font-medium text-gray-700 mb-1"
                    >
                      Tên Sản Phẩm
                    </label>
                    <input
                      type="text"
                      id="tensanpham"
                      name="tensanpham"
                      value={formData.tensanpham}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="idloaisanpham"
                      className="block font-medium text-gray-700 mb-1"
                    >
                      Loại Sản Phẩm
                    </label>
                    <select
                      id="idloaisanpham"
                      name="idloaisanpham"
                      value={formData.idloaisanpham}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="0">Chọn loại sản phẩm</option>
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

                <div className="flex w-full gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="gia"
                      className="block font-medium text-gray-700 mb-1"
                    >
                      Giá
                    </label>
                    <input
                      type="number"
                      id="gia"
                      name="gia"
                      value={formData.gia}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="hinhanh"
                      className="block font-medium text-gray-700 mb-1"
                    >
                      Hình Ảnh URL
                    </label>
                    <input
                      type="url"
                      id="hinhanh"
                      name="hinhanh"
                      value={formData.hinhanh}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex w-full gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="giamgia"
                      className="block font-medium text-gray-700 mb-1"
                    >
                      Giảm Giá
                    </label>
                    <input
                      type="number"
                      id="giamgia"
                      name="giamgia"
                      value={formData.giamgia.toString()}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="gioitinh"
                      className="block font-medium text-gray-700 mb-1"
                    >
                      Giới Tính
                    </label>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="gioitinh-nam"
                        name="gioitinh"
                        value="true"
                        checked={formData.gioitinh === true}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label
                        htmlFor="gioitinh-nam"
                        className="font-medium text-gray-700"
                      >
                        Nam
                      </label>
                      <input
                        type="radio"
                        id="gioitinh-nu"
                        name="gioitinh"
                        value="false"
                        checked={formData.gioitinh === false}
                        onChange={handleChange}
                        className="ml-4 mr-2"
                      />
                      <label
                        htmlFor="gioitinh-nu"
                        className="font-medium text-gray-700"
                      >
                        Nữ
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex w-full gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor="mota"
                      className="block font-medium text-gray-700 mb-1"
                    >
                      Mô Tả
                    </label>
                    <input
                      type="text"
                      id="mota"
                      name="mota"
                      value={formData.mota}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="size"
                      className="block font-medium text-gray-700 mb-1"
                    >
                      Size
                    </label>
                    <input
                      type="text"
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Thêm Sản Phẩm
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
