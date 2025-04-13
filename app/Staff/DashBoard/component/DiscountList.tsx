"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import DiscountForm from "./DiscountForm";
DiscountForm 

interface Discount {
  idDiscount: number;
  code: string;
  description: string;
  discountType: string;
  value: number;
  minOrderValue: number | null;
  maxDiscount: number | null;
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
}

export default function DiscountList() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/discounts");
      const data = await response.json();
      setDiscounts(data);
    } catch (err) {
      setError("Lỗi khi tải danh sách mã giảm giá");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) return;

    try {
      const response = await fetch(`/api/discounts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDiscounts(discounts.filter((d) => d.idDiscount !== id));
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (err) {
      console.error("Error deleting discount:", err);
      alert("Lỗi khi xóa mã giảm giá");
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const url = editingDiscount
        ? `/api/discounts/${editingDiscount.idDiscount}`
        : "/api/discounts";
      const method = editingDiscount ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      setIsFormOpen(false);
      setEditingDiscount(null);
      fetchDiscounts();
    } catch (err) {
      console.error("Error saving discount:", err);
      alert("Lỗi khi lưu mã giảm giá");
    }
  };

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Danh sách mã giảm giá</h2>
        <button
          onClick={() => {
            setEditingDiscount(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} />
          Thêm mã giảm giá
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <DiscountForm
              discount={editingDiscount}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingDiscount(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá trị
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời hạn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {discounts.map((discount) => (
              <tr key={discount.idDiscount}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {discount.code}
                  </div>
                  <div className="text-sm text-gray-500">
                    {discount.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {discount.discountType === "PERCENTAGE"
                      ? "Phần trăm"
                      : "Số tiền cố định"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {discount.discountType === "PERCENTAGE"
                      ? `${discount.value}%`
                      : `${discount.value.toLocaleString("vi-VN")}đ`}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(discount.startDate).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="text-sm text-gray-500">
                    đến {new Date(discount.endDate).toLocaleDateString("vi-VN")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      discount.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {discount.isActive ? "Đang hoạt động" : "Đã tắt"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(discount)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(discount.idDiscount)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
