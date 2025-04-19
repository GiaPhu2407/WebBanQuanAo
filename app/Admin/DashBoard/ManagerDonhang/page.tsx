"use client";
import React, { useState, useEffect } from "react";
import SalesDashboard from "../NvarbarAdmin";
import TableDonHang from "@/app/Admin/Tabledonhang";
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
interface DonHang {
  iddonhang: number;
  tongsoluong: number;
  trangthai: string;
  tongsotien: number;
  ngaydat: string;
  idUsers: number;
  chitietdonhang: {
    idchitietdonhang: number;
    iddonhang: number;
    idsanpham: number;
    tensanpham: string;
    dongia: number;
    soluong: number;
    sanpham: {
      idsanpham: number;
      tensanpham: string;
      gia: string;
      hinhanh: string;
      gioitinh: boolean;
    };
  }[];
  users?: {
    Hoten: string;
    Email: string;
    Sdt: string;
  };
  lichgiaohang?: {
    NgayGiao: string;
  }[];
}

interface FormData {
  TrangThaiDonHang: string;
}

export default function OrderManagementPage() {
  const initialFormData: FormData = {
    TrangThaiDonHang: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<DonHang | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { toast } = useToast();

  const refreshData = () => {
    setReloadKey((prevKey) => prevKey + 1);
  };

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

  useEffect(() => {
    fetch("/api/donhang")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch order data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Order data:", data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch order data");
        console.error("Failed to fetch orders", err);
        setLoading(false);
      });
  }, [reloadKey]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (order: DonHang) => {
    setFormData({
      TrangThaiDonHang: order.trangthai,
    });
    setIsEditing(true);
    setEditingId(order.iddonhang);

    const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const url = isEditing ? `/api/donhang/${editingId}` : "/api/donhang";
    const method = isEditing ? "PUT" : "POST";

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
            `Failed to ${isEditing ? "update" : "create"} order`
        );
      }

      const data = await response.json();
      setSuccess(data.message);
      setFormData(initialFormData);
      setIsEditing(false);
      setEditingId(null);
      refreshData();

      const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }

      toast({
        title: "Thành Công!",
        description: data.message,
        variant: "success",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Error ${isEditing ? "updating" : "creating"} order`
      );

      toast({
        title: "Lỗi!",
        description:
          err instanceof Error ? err.message : "Lỗi khi thực hiện thao tác",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      try {
        const response = await fetch(`/api/donhang/${deleteConfirmId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Không thể xóa đơn hàng");
        }

        const data = await response.json();
        setSuccess(data.message);
        refreshData();
        setDeleteConfirmId(null);

        toast({
          title: "Thành Công!",
          description: "Đơn hàng đã được xóa thành công",
          variant: "success",
        });
      } catch (err) {
        console.error("Error deleting order:", err);
        setError(err instanceof Error ? err.message : "Lỗi khi xóa đơn hàng");

        toast({
          title: "Lỗi!",
          description:
            err instanceof Error ? err.message : "Lỗi khi xóa đơn hàng",
          variant: "destructive",
        });
      }
    }
  };

  const handleModalClose = () => {
    if (!isEditing) {
      setFormData(initialFormData);
    }
    const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (dialog) {
      dialog.close();
    }
  };

  const handleViewOrder = (donhang: DonHang) => {
    setSelectedOrder(donhang);
    const modal = document.getElementById(
      "order-detail-modal"
    ) as HTMLDialogElement;
    modal?.showModal();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading)
    return (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="light"
      >
        <span className="loading loading-spinner text-blue-600 loading-lg"></span>
      </div>
    );

  return (
    <div className="flex">
      <SalesDashboard />
      <div className="p-6 flex-1 ">
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

        <dialog id="my_modal_3" className="modal">
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
              {isEditing ? "Cập Nhật Đơn Hàng" : "Thêm Mới Đơn Hàng"}
            </h3>
            <div className="flex w-full">
              <div className="pt-6 w-[20000px]">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex justify-center w-full flex-wrap gap-4">
                    <div className="flex w-full gap-4">
                      <div className="flex-1">
                        <label
                          htmlFor="TrangThaiDonHang"
                          className="block font-medium text-gray-700 mb-1"
                        >
                          Trạng Thái
                        </label>
                        <select
                          name="TrangThaiDonHang"
                          value={formData.TrangThaiDonHang}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Chọn Trạng Thái</option>
                          <option value="Chờ xác nhận">Chờ xác nhận</option>
                          <option value="Đã xác nhận">Đã xác nhận</option>
                          <option value="Đang giao">Đang giao</option>
                          <option value="Đã giao">Đã giao</option>
                          <option value="Đã hủy">Đã hủy</option>
                        </select>
                      </div>
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

        <div className="flex justify-between items-center mt-10">
          <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
        </div>

        <TableDonHang
          key={reloadKey}
          onView={handleViewOrder}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteConfirmId(id)}
          reloadKey={reloadKey}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deleteConfirmId}
          onOpenChange={() => setDeleteConfirmId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể
                hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteConfirmId(null)}>
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Order Detail Modal */}
        <dialog
          id="order-detail-modal"
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box relative">
            <button
              onClick={() => {
                const modal = document.getElementById(
                  "order-detail-modal"
                ) as HTMLDialogElement;
                modal?.close();
                setSelectedOrder(null);
              }}
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </button>

            <h3 className="font-bold text-lg mb-4">Chi tiết đơn hàng</h3>

            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Mã đơn hàng:</p>
                    <p>{selectedOrder.iddonhang}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Ngày đặt:</p>
                    <p>{formatDate(selectedOrder.ngaydat)}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Tổng số lượng:</p>
                    <p>{selectedOrder.tongsoluong}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Tổng tiền:</p>
                    <p>{formatCurrency(selectedOrder.tongsotien)}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Trạng thái:</p>
                    <p>{selectedOrder.trangthai}</p>
                  </div>
                  {selectedOrder.users && (
                    <div>
                      <p className="font-semibold">Khách hàng:</p>
                      <p>{selectedOrder.users.Hoten}</p>
                      <p>{selectedOrder.users.Email}</p>
                      <p>{selectedOrder.users.Sdt}</p>
                    </div>
                  )}
                  {selectedOrder.lichgiaohang &&
                    selectedOrder.lichgiaohang.length > 0 && (
                      <div>
                        <p className="font-semibold">Ngày giao:</p>
                        <p>
                          {formatDate(selectedOrder.lichgiaohang[0].NgayGiao)}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </dialog>
      </div>
    </div>
  );
}
