"use client";
import React, { useState, useEffect } from "react";
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

interface DonHang {
  iddonhang: number;
  tongsotien?: number;
  trangthai?: string;
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
  const [fetchingDonHang, setFetchingDonHang] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [donHangs, setDonHangs] = useState<DonHang[]>([]);
  const [selectedDonHang, setSelectedDonHang] = useState<DonHang | null>(null);

  const { toast } = useToast();

  // Dropdown options - Đã thêm "Chưa xác định" vào danh sách trạng thái
  const paymentStatuses = [
    { value: "Thành công", label: "Thành Công" },
    { value: "Đang chờ", label: "Đang Chờ" },
    { value: "Thất bại", label: "Thất Bại" },
    { value: "Đã thanh toán", label: "Đã Thanh Toán" },
    { value: "Chưa xác định", label: "Chưa Xác Định" },
  ];

  const paymentMethods = [
    { value: "Chuyển khoản", label: "Chuyển Khoản" },
    { value: "Tiền mặt", label: "Tiền Mặt" },
    { value: "Thẻ", label: "Thẻ" },
    { value: "Online", label: "Thanh Toán Online" },
  ];

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

  // Debug: Log donHangs whenever it changes
  useEffect(() => {
    console.log("Danh sách đơn hàng:", donHangs);
  }, [donHangs]);

  const fetchDonHangs = async () => {
    try {
      setFetchingDonHang(true);
      console.log("Đang tải danh sách đơn hàng...");

      const response = await fetch("/api/donhang");
      if (!response.ok) {
        console.error("API trả về lỗi:", response.status, response.statusText);
        throw new Error("Không thể tải danh sách đơn hàng");
      }

      const data = await response.json();
      console.log("Dữ liệu đơn hàng từ API:", data);

      // Xử lý dữ liệu phù hợp với cấu trúc API
      if (data.donhang && Array.isArray(data.donhang)) {
        console.log("Đã tìm thấy array donhang trong response");
        setDonHangs(data.donhang);
      } else if (Array.isArray(data)) {
        console.log("Response là một array");
        setDonHangs(data);
      } else {
        console.error("Dữ liệu đơn hàng không đúng định dạng", data);
        toast({
          title: "Lỗi",
          description: "Dữ liệu đơn hàng không đúng định dạng",
          variant: "destructive",
        });
        setDonHangs([]);
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
      setError("Không thể tải danh sách đơn hàng");
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách đơn hàng",
        variant: "destructive",
      });
      setDonHangs([]);
    } finally {
      setLoading(false);
      setFetchingDonHang(false);
    }
  };

  // Fetch chi tiết đơn hàng theo ID
  const fetchDonHangDetails = async (iddonhang: number) => {
    try {
      console.log(`Đang tải chi tiết đơn hàng ID: ${iddonhang}`);

      const response = await fetch(`/api/donhang/${iddonhang}`);
      if (!response.ok) {
        throw new Error("Không thể tải chi tiết đơn hàng");
      }

      const data = await response.json();
      console.log("Chi tiết đơn hàng:", data);

      // Lưu thông tin đơn hàng đã chọn
      setSelectedDonHang(data);

      return data;
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đơn hàng:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải chi tiết đơn hàng",
        variant: "destructive",
      });
      return null;
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
    setSelectedDonHang(null);
  };

  // Handle form input changes
  const handleChange = (name: string, value: string | number | null) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Automatically set status to "Đã thanh toán" for online payments
      if (name === "phuongthucthanhtoan" && value === "Online") {
        newData.trangthai = "Đã thanh toán";
      }

      return newData;
    });
  };

  // Handle opening modal for creating new payment
  const handleOpenCreateModal = () => {
    resetForm();
    setIsEditing(false);

    // Đảm bảo rằng danh sách đơn hàng đã được tải
    if (donHangs.length === 0 && !fetchingDonHang) {
      console.log("Tải lại danh sách đơn hàng trước khi mở modal");
      fetchDonHangs();
    }

    const dialog = document.getElementById(
      "payment-modal"
    ) as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  // Handle edit payment
  const handleEdit = async (payment: Payment) => {
    console.log("Đang chỉnh sửa thanh toán:", payment);

    if (payment.iddonhang) {
      // Tải chi tiết đơn hàng theo ID
      await fetchDonHangDetails(payment.iddonhang);
    }

    setFormData({
      iddonhang: payment.iddonhang,
      phuongthucthanhtoan: payment.phuongthucthanhtoan,
      sotien: payment.sotien,
      trangthai: payment.trangthai,
      ngaythanhtoan: payment.ngaythanhtoan,
    });
    setEditingId(payment.idthanhtoan);
    setIsEditing(true);

    const dialog = document.getElementById(
      "payment-modal"
    ) as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  // Submit form (create/update payment)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    console.log("Đang gửi form với dữ liệu:", formData);

    // Validation
    if (
      !formData.iddonhang ||
      !formData.phuongthucthanhtoan ||
      !formData.sotien
    ) {
      setError("Vui lòng điền đầy đủ thông tin");
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    // Set default status for online payments
    if (formData.phuongthucthanhtoan === "Online" && !formData.trangthai) {
      formData.trangthai = "Đã thanh toán";
    }

    // Thêm trạng thái mặc định nếu trống
    if (!formData.trangthai) {
      formData.trangthai = "Chưa xác định";
    }

    try {
      const url = isEditing ? `/api/thanhtoan/${editingId}` : "/api/thanhtoan";
      const method = isEditing ? "PUT" : "POST";

      console.log(`Đang gửi request ${method} đến ${url}`);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API trả về lỗi:", errorData);
        throw new Error(
          errorData.error || `Lỗi ${isEditing ? "cập nhật" : "tạo"} thanh toán`
        );
      }

      const data = await response.json();
      setSuccess(
        data.message ||
          `${isEditing ? "Cập nhật" : "Thêm mới"} thanh toán thành công`
      );

      resetForm();
      refreshData();

      const dialog = document.getElementById(
        "payment-modal"
      ) as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }

      toast({
        title: "Thành Công!",
        description:
          data.message ||
          `${isEditing ? "Cập nhật" : "Thêm mới"} thanh toán thành công`,
        variant: "success",
      });
    } catch (err) {
      console.error("Lỗi khi gửi form:", err);

      setError(
        err instanceof Error
          ? err.message
          : `Lỗi ${isEditing ? "cập nhật" : "tạo"} thanh toán`
      );

      toast({
        title: "Lỗi!",
        description:
          err instanceof Error ? err.message : "Lỗi khi thực hiện thao tác",
        variant: "destructive",
      });
    }
  };

  // Handle delete payment
  const handleDelete = async () => {
    if (deleteConfirmId) {
      try {
        console.log(`Đang xóa thanh toán với ID: ${deleteConfirmId}`);

        const response = await fetch(`/api/thanhtoan/${deleteConfirmId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Không thể xóa thanh toán");
        }

        const data = await response.json();
        setSuccess(data.message || "Xóa thanh toán thành công");
        refreshData();
        setDeleteConfirmId(null);

        toast({
          title: "Thành Công!",
          description: "Thanh toán đã được xóa thành công",
          variant: "success",
        });
      } catch (err) {
        console.error("Lỗi xóa thanh toán:", err);
        setError(err instanceof Error ? err.message : "Lỗi khi xóa thanh toán");

        toast({
          title: "Lỗi!",
          description:
            err instanceof Error ? err.message : "Lỗi khi xóa thanh toán",
          variant: "destructive",
        });
      }
    }
  };

  const handleModalClose = () => {
    console.log("Đóng modal");
    if (!isEditing) {
      resetForm();
    }
    const dialog = document.getElementById(
      "payment-modal"
    ) as HTMLDialogElement;
    if (dialog) {
      dialog.close();
    }
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="light"
      >
        <span className="loading loading-spinner text-blue-600 loading-lg"></span>
      </div>
    );
  }

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
                  {/* Đơn Hàng Select/Display */}
                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label className="block font-medium text-gray-700 mb-1">
                        Đơn Hàng
                      </label>
                      {isEditing ? (
                        // Khi đang chỉnh sửa, hiển thị thông tin đơn hàng
                        <div className="w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md">
                          {selectedDonHang ? (
                            <div>
                              <span className="font-medium">
                                Đơn hàng #{formData.iddonhang}
                              </span>
                              {selectedDonHang.tongsotien && (
                                <span className="ml-2 text-gray-600">
                                  - Tổng tiền:{" "}
                                  {parseInt(
                                    selectedDonHang.tongsotien.toString()
                                  ).toLocaleString("vi-VN")}{" "}
                                  đ
                                </span>
                              )}
                              {selectedDonHang.trangthai && (
                                <span className="ml-2 text-gray-600">
                                  - Trạng thái: {selectedDonHang.trangthai}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span>Đơn hàng #{formData.iddonhang}</span>
                          )}
                        </div>
                      ) : (
                        // Khi tạo mới, cho phép chọn đơn hàng
                        <select
                          value={formData.iddonhang?.toString() || ""}
                          onChange={(e) =>
                            handleChange("iddonhang", parseInt(e.target.value))
                          }
                          className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Chọn đơn hàng</option>
                          {fetchingDonHang ? (
                            <option value="" disabled>
                              Đang tải danh sách đơn hàng...
                            </option>
                          ) : Array.isArray(donHangs) && donHangs.length > 0 ? (
                            donHangs.map((donHang) => (
                              <option
                                key={donHang.iddonhang}
                                value={donHang.iddonhang}
                              >
                                Đơn hàng #{donHang.iddonhang}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              Không có đơn hàng nào
                            </option>
                          )}
                        </select>
                      )}
                      {!isEditing &&
                        donHangs.length === 0 &&
                        !fetchingDonHang && (
                          <p className="text-sm text-red-500 mt-1">
                            <button
                              type="button"
                              className="text-blue-500 underline"
                              onClick={fetchDonHangs}
                            >
                              Tải lại danh sách đơn hàng
                            </button>
                          </p>
                        )}
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
                        onChange={(e) =>
                          handleChange("phuongthucthanhtoan", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleChange("trangthai", e.target.value)
                        }
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={formData.phuongthucthanhtoan === "Online"}
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
                        onChange={(e) =>
                          handleChange("ngaythanhtoan", e.target.value || null)
                        }
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
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Thêm Mới Thanh Toán
          </button>
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
                Bạn có chắc chắn muốn xóa thanh toán này? Hành động này không
                thể hoàn tác.
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
      </div>
    </div>
  );
};

export default PaymentManagementPage;
