"use client";
import React, { useState, useEffect, HtmlHTMLAttributes } from "react";
import SalesDashboard from "../NvarbarAdmin";
import Tabledashboard from "../../TableProduct";
import Fileupload from "@/components/ui/Fileupload";

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
  gioitinh: boolean; // true for "Nam", false for "Nữ"
  size: string;
}

interface SanPham extends FormData {
  idsanpham: number;
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
    gioitinh: true, // default to "Nam"
    size: "",
  });

  const [loaisanphamList, setLoaisanphamList] = useState<LoaiSanPham[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");

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
    if (!formData.tensanpham.trim()) return "Vui lòng nhập tên sản phẩm";
    if (!formData.mota.trim()) return "Vui lòng nhập mô tả";
    if (!formData.gia || isNaN(Number(formData.gia)))
      return "Vui lòng nhập giá hợp lệ";

    if (!formData.idloaisanpham) return "Vui lòng chọn loại sản phẩm";
    if (!formData.size) return "Vui lòng chọn ít nhất một size";
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
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "idloaisanpham"
          ? parseInt(value)
          : name === "giamgia"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleGenderChange = (isMale: boolean) => {
    setFormData((prev) => ({ ...prev, gioitinh: isMale }));
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
      return { ...prev, size: Array.from(sizeSet).join(",") };
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, hinhanh: imageUrl }),
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.error || "Lỗi khi cập nhật sản phẩm");
      }
      const data = document.getElementById("my_modal_3") as HTMLDialogElement;
      data.close();
      setSuccess(
        currentProductId
          ? "Cập nhật sản phẩm thành công"
          : "Thêm sản phẩm thành công"
      );
      resetForm();
      setReloadKey((prev) => prev + 1);
      setImageUrl("");
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Lỗi khi xử lý yêu cầu");
    }
  };

  const handleEdit = (product: SanPham) => {
    setFormData(product);
    setCurrentProductId(product.idsanpham);
    setIsEditing(true);
    const data = document.getElementById("my_modal_3") as HTMLDialogElement;
    data.showModal();
  };
  const handleAddNewClick = () => {
    setIsEditing(false);
    setFormData(formData);
    setCurrentProductId(null);
    const data = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (data) {
      data.showModal();
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
      gioitinh: true, // Reset to "Nam"
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
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Không thể xóa sản phẩm.");
        }

        // Cập nhật thông báo thành công
        setSuccess("Sản phẩm đã được xóa thành công.");

        // Cập nhật lại danh sách sản phẩm, có thể là thông qua một hàm reload dữ liệu
        setReloadKey((prevKey) => prevKey + 1); // Reload the product list
      } catch (err) {
        console.error("Error deleting product:", err);
        setError(err instanceof Error ? err.message : "Lỗi khi xóa sản phẩm.");
      }
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
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-evenly gap-[580px] ">
          <h1 className="text-2xl font-bold mb-4 whitespace-nowrap">
            Quản lý sản phẩm
          </h1>
          <button className="btn btn-primary" onClick={handleAddNewClick}>
            Thêm sản phẩm
          </button>
        </div>

        <dialog
          id="my_modal_3"
          className="modal fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
        >
          <div className="bg-white shadow-xl rounded-lg p-4 w-full max-w-3xl relative">
            <button
              onClick={() => handleCancelEdit()}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && (
              <div className="alert alert-success">
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    name="tensanpham"
                    value={formData.tensanpham}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
                {/* Các trường form khác giữ nguyên */}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Giá
                  </label>
                  <input
                    type="number"
                    name="gia"
                    value={formData.gia}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hình ảnh (URL)
                  </label>
                  <Fileupload
                    endpoint="imageUploader"
                    onChange={(url) => {
                      setImageUrl(url || "");
                    }}
                    showmodal={!imageUrl}
                  />
                  {imageUrl && (
                    <div className="mt-2 flex flex-col items-center">
                      <img
                        src={imageUrl}
                        alt="Uploaded"
                        className="max-w-xs max-h-48"
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loại sản phẩm
                  </label>
                  <select
                    name="idloaisanpham"
                    value={formData.idloaisanpham}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
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
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    Kích thước
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {VALID_SIZES.map((size) => (
                      <label key={size} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.size.split(",").includes(size)}
                          onChange={() => handleSizeChange(size)}
                          className="form-checkbox h-5 w-5 text-blue-600"
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
                  <div className="flex items-center mt-1">
                    <label className="inline-flex items-center mr-4">
                      <input
                        type="radio"
                        name="gioitinh"
                        value="nam"
                        checked={formData.gioitinh === true}
                        onChange={() => handleGenderChange(true)}
                        className="form-radio h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2">Nam</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gioitinh"
                        value="nu"
                        checked={formData.gioitinh === false}
                        onChange={() => handleGenderChange(false)}
                        className="form-radio h-5 w-5 text-pink-600"
                      />
                      <span className="ml-2">Nữ</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
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
