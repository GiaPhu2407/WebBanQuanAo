"use client";
import React, { useState, useEffect } from "react";
import SalesDashboard from "../NvarbarAdmin";
import TableSupplier from "../../TableSuppler";

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
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentNhaCungCapId, setCurrentNhaCungCapId] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchNhaCungCap();
  }, [reloadKey]);

  const fetchNhaCungCap = async () => {
    try {
      const response = await fetch("/api/nhacungcap");
      const data = await response.json();
      setNhacungcapList(data);
    } catch (err) {
      console.error("Failed to fetch nha cung cap:", err);
      setError("Không thể tải danh sách nhà cung cấp");
    }
  };

  const validateForm = (): string | null => {
    if (!formData.tennhacungcap.trim()) return "Vui lòng nhập tên nhà cung cấp";
    if (!formData.sodienthoai.trim()) return "Vui lòng nhập số điện thoại";
    if (!formData.diachi.trim()) return "Vui lòng nhập địa chỉ";
    if (!formData.email.trim()) return "Vui lòng nhập email";
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Email không hợp lệ";
    // Validate phone number (Vietnamese format)
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
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
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

    const url = currentNhaCungCapId
      ? `/api/nhacungcap/${currentNhaCungCapId}`
      : "/api/nhacungcap";
    const method = currentNhaCungCapId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          trangthai: formData.trangthai === true, // Convert string to boolean//+
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Lỗi khi cập nhật nhà cung cấp");
      }

      setSuccess(
        currentNhaCungCapId
          ? "Cập nhật nhà cung cấp thành công"
          : "Thêm nhà cung cấp thành công"
      );
      fetchNhaCungCap();
      resetForm();
      // const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      // modal.close();
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Lỗi khi xử lý yêu cầu");
    }
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

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này?")) {
      try {
        const response = await fetch(`/api/nhacungcap/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Không thể xóa nhà cung cấp");
        setSuccess("Nhà cung cấp đã được xóa thành công");
        setReloadKey((prevKey) => prevKey + 1);
      } catch (err) {
        console.error("Error deleting nha cung cap:", err);
        setError(
          err instanceof Error ? err.message : "Lỗi khi xóa nhà cung cấp"
        );
      }
    }
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
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-evenly gap-[580px]">
          <h1 className="text-2xl font-bold mb-4 whitespace-nowrap">
            Quản lý nhà cung cấp
          </h1>
          <button className="btn btn-primary" onClick={handleAddNewClick}>
            Thêm nhà cung cấp
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

            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}

            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {isEditing ? "Cập nhật nhà cung cấp" : "Thêm nhà cung cấp"}
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên nhà cung cấp
                  </label>
                  <input
                    type="text"
                    name="tennhacungcap"
                    value={formData.tennhacungcap}
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
                    name="sodienthoai"
                    value={formData.sodienthoai}
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
                    name="diachi"
                    value={formData.diachi}
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Trạng thái
                  </label>
                  <select
                    name="trangthai"
                    value={formData.trangthai.toString()}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  >
                    <option value="true">Đang cung cấp</option>
                    <option value="false">Ngừng cung cấp</option>
                  </select>
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isEditing ? "Cập nhật nhà cung cấp" : "Thêm nhà cung cấp"}
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
          <TableSupplier
            onEdit={handleEdit}
            onDelete={handleDelete}
            reloadKey={reloadKey}
          />
        </div>
      </div>
    </div>
  );
}
