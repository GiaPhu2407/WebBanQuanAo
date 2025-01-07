"use client";
import React, { useState, useEffect } from "react";
import { Plus, FileEdit, Trash2 } from "lucide-react";
import SalesDashboard from "../NvarbarAdmin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaymentTable from "../../Tablethanhtoan";

// Interfaces
interface Payment {
  idthanhtoan: number;
  iddonhang: number | null;
  phuongthucthanhtoan: string | null;
  sotien: number | null;
  trangthai: string | null;
  ngaythanhtoan: string | null;
}

interface FormData {
  iddonhang: number | null;
  phuongthucthanhtoan: string | null;
  sotien: number | null;
  trangthai: string | null;
  ngaythanhtoan: string | null;
}

const PaymentManagementPage: React.FC = () => {
  // State management
  const [formData, setFormData] = useState<FormData>({
    iddonhang: null,
    phuongthucthanhtoan: null,
    sotien: null,
    trangthai: null,
    ngaythanhtoan: null,
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { toast } = useToast();

  // Dropdown options
  const paymentStatuses = [
    { value: "Thành công", label: "Thành Công" },
    { value: "Đang chờ", label: "Đang Chờ" },
    { value: "Thất bại", label: "Thất Bại" },
  ];

  const paymentMethods = [
    { value: "Chuyển khoản", label: "Chuyển Khoản" },
    { value: "Tiền mặt", label: "Tiền Mặt" },
    { value: "Thẻ", label: "Thẻ" },
  ];

  const [donHangs, setDonHangs] = useState<{ iddonhang: number }[]>([]);

  const refreshData = () => {
    setReloadKey((prevKey) => prevKey + 1);
  };

  // Handle toast and error/success messages
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

  // Fetch đơn hàng when component mounts
  useEffect(() => {
    fetchDonHangs();
  }, []);

  const fetchDonHangs = async () => {
    try {
      const response = await fetch("/api/donhang");
      if (!response.ok) throw new Error("Không thể tải danh sách đơn hàng");

      const data = await response.json();
      setDonHangs(data);
      setLoading(false);
    } catch (error) {
      setError("Không thể tải danh sách đơn hàng");
      console.error("Lỗi tải đơn hàng", error);
      setLoading(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      iddonhang: null,
      phuongthucthanhtoan: null,
      sotien: null,
      trangthai: null,
      ngaythanhtoan: null,
    });
    setEditingId(null);
    setIsEditing(false);
  };

  // Handle form input changes
  const handleChange = (name: string, value: string | number | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle edit payment
  const handleEdit = (payment: Payment) => {
    setFormData({
      iddonhang: payment.iddonhang,
      phuongthucthanhtoan: payment.phuongthucthanhtoan,
      sotien: payment.sotien,
      trangthai: payment.trangthai,
      ngaythanhtoan: payment.ngaythanhtoan,
    });
    setEditingId(payment.idthanhtoan);
    setIsEditing(true);
    
    const dialog = document.getElementById("payment-modal") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  // Submit form (create/update payment)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (
      !formData.iddonhang ||
      !formData.phuongthucthanhtoan ||
      !formData.sotien
    ) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const url = isEditing ? `/api/thanhtoan/${editingId}` : "/api/thanhtoan";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Lỗi ${isEditing ? 'cập nhật' : 'tạo'} thanh toán`);
      }

      const data = await response.json();
      setSuccess(data.message || `${isEditing ? 'Cập nhật' : 'Thêm mới'} thanh toán thành công`);
      
      resetForm();
      refreshData();

      const dialog = document.getElementById("payment-modal") as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }

      toast({
        title: 'Thành Công!',
        description: data.message || `${isEditing ? 'Cập nhật' : 'Thêm mới'} thanh toán thành công`,
        variant: 'success',
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : `Lỗi ${isEditing ? 'cập nhật' : 'tạo'} thanh toán`);
      
      toast({
        title: 'Lỗi!',
        description: err instanceof Error ? err.message : 'Lỗi khi thực hiện thao tác',
        variant: 'destructive',
      });
    }
  };

  // Handle delete payment
  const handleDelete = async () => {
    if (deleteConfirmId) {
      try {
        const response = await fetch(`/api/thanhtoan/${deleteConfirmId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Không thể xóa thanh toán');
        }

        const data = await response.json();
        setSuccess(data.message || 'Xóa thanh toán thành công');
        refreshData();
        setDeleteConfirmId(null);

        // toast({
        //   title: 'Thành Công!',
        //   description: 'Thanh toán đã được xóa thành công',
        //   variant: 'success',
        // });
      } catch (err) {
        console.error('Lỗi xóa thanh toán:', err);
        setError(err instanceof Error ? err.message : 'Lỗi khi xóa thanh toán');
        
        toast({
          title: 'Lỗi!',
          description: err instanceof Error ? err.message : 'Lỗi khi xóa thanh toán',
          variant: 'destructive',
        });
      }
    }
  };

  const handleModalClose = () => {
    if (!isEditing) {
      resetForm();
    }
    const dialog = document.getElementById("payment-modal") as HTMLDialogElement;
    if (dialog) {
      dialog.close();
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen" data-theme="light">
      <span className="loading loading-spinner text-blue-600 loading-lg"></span>
    </div>
  );

  return (
    <div className="flex">
      <SalesDashboard />
      <div className="p-6 flex-1 mt-20">
        <Toaster />

        {showToast && (
          <div className="toast toast-top toast-end mt-16 z-[9999]">
            {error && (
              <div role="alert" className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div role="alert" className="alert alert-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{success}</span>
              </div>
            )}
          </div>
        )}

        <dialog id="payment-modal" className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={handleModalClose}
              >
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg mb-4">
              {isEditing ? "Cập Nhật Thanh Toán" : "Thêm Mới Thanh Toán"}
            </h3>
            <div className="flex w-full">
              <div className="pt-6 w-[20000px]">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Đơn Hàng Select */}
                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label className="block font-medium text-gray-700 mb-1">
                        Đơn Hàng
                      </label>
                      <select
                        value={formData.iddonhang?.toString() || ""}
                        onChange={(e) => handleChange("iddonhang", parseInt(e.target.value))}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Chọn đơn hàng</option>
                        {donHangs.map((donHang) => (
                          <option 
                            key={donHang.iddonhang} 
                            value={donHang.iddonhang.toString()}
                          >
                            {donHang.iddonhang}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Phương Thức Thanh Toán */}
                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label className="block font-medium text-gray-700 mb-1">
                        Phương Thức Thanh Toán
                      </label>
                      <select
                        value={formData.phuongthucthanhtoan || ""}
                        onChange={(e) => handleChange("phuongthucthanhtoan", e.target.value)}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Chọn phương thức</option>
                        {paymentMethods.map((method) => (
                          <option key={method.value} value={method.value}>
                            {method.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Số Tiền */}
                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label className="block font-medium text-gray-700 mb-1">
                        Số Tiền
                      </label>
                      <input
                        type="number"
                        value={formData.sotien || ""}
                        onChange={(e) => 
                          handleChange(
                            "sotien", 
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập số tiền"
                        required
                      />
                    </div>
                  </div>

                  {/* Trạng Thái */}
                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label className="block font-medium text-gray-700 mb-1">
                        Trạng Thái
                      </label>
                      <select
                        value={formData.trangthai || ""}
                        onChange={(e) => handleChange("trangthai", e.target.value)}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Chọn trạng thái</option>
                        {paymentStatuses.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Ngày Thanh Toán */}
                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label className="block font-medium text-gray-700 mb-1">
                        Ngày Thanh Toán
                      </label>
                      <input
                        type="date"
                        value={formData.ngaythanhtoan || ""}
                        onChange={(e) => handleChange("ngaythanhtoan", e.target.value || null)}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      {isEditing ? "Cập Nhật" : "Thêm Mới"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </dialog>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quản Lý Thanh Toán</h1>
        </div>

        <PaymentTable
          key={reloadKey}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteConfirmId(id)}
          refreshTrigger={reloadKey}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deleteConfirmId}
          onOpenChange={() => setDeleteConfirmId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác Nhận Xóa</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa thanh toán này? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteConfirmId(null)}>
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default PaymentManagementPage;