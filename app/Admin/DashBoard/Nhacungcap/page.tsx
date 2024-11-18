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

// Toast Component
const Toast = ({
  message,
  type,
  isVisible,
  onClose,
}: {
  message: string;
  type: "error" | "success";
  isVisible: boolean;
  onClose: () => void;
}) => {
  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transform transition-transform duration-300 z-50 ${
        isVisible ? "translate-x-0" : "translate-x-full"
      } ${
        type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
      }`}
    >
      <div className="flex items-center">
        <span className="mr-2">{type === "error" ? "❌" : "✅"}</span>
        <p className="font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

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
  const [showToast, setShowToast] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentNhaCungCapId, setCurrentNhaCungCapId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (error || success) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        setError("");
        setSuccess("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

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

    // Chuẩn bị dữ liệu gửi đi
    const submitData = {
      tennhacungcap: formData.tennhacungcap,
      sodienthoai: formData.sodienthoai,
      diachi: formData.diachi,
      email: formData.email,
      trangthai: Boolean(formData.trangthai),
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Lỗi khi thêm/cập nhật nhà cung cấp"
        );
      }

      const responseData = await response.json();

      if (responseData.error) {
        throw new Error(responseData.error);
      }

      setSuccess(
        currentNhaCungCapId
          ? "Cập nhật nhà cung cấp thành công"
          : "Thêm nhà cung cấp thành công"
      );

      // Cập nhật danh sách
      await fetchNhaCungCap();

      // Đóng modal và reset form
      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
      resetForm();
      setReloadKey((prev) => prev + 1);
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Lỗi khi xử lý yêu cầu");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này?")) {
      try {
        const response = await fetch(`/api/nhacungcap/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Không thể xóa nhà cung cấp");
        setSuccess("Nhà cung cấp đã được xóa thành công");
        setReloadKey((prev) => prev + 1);
      } catch (err) {
        console.error("Error deleting nha cung cap:", err);
        setError(
          err instanceof Error ? err.message : "Lỗi khi xóa nhà cung cấp"
        );
      }
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
        {(error || success) && (
          <Toast
            message={error || success}
            type={error ? "error" : "success"}
            isVisible={showToast}
            onClose={() => {
              setShowToast(false);
              setError("");
              setSuccess("");
            }}
          />
        )}

        <div className="flex justify-evenly gap-[500px]">
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
