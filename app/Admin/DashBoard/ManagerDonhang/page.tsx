"use client";
import type React from "react";
import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";

interface DonHang {
  iddonhang: number;
  tongsoluong: number;
  trangthai: string;
  tongsotien: number;
  ngaydat: string;
  idUsers: number;
  idDiscount?: number | null;
  discountValue?: number | null;
  idDiaChi?: number | null;
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
    idUsers: number;
    Hoten: string;
    Email: string;
    Sdt: string;
    Diachi: string;
  };
  lichgiaohang?: {
    NgayGiao: string;
  }[];
  diaChiGiaoHang?: {
    idDiaChi: number;
    tenNguoiNhan: string;
    soDienThoai: string;
    diaChiChiTiet: string;
    phuongXa: string;
    quanHuyen: string;
    thanhPho: string;
    macDinh?: boolean;
  } | null;
}

interface FormData {
  TrangThaiDonHang: string;
  sendEmail: boolean;
}

interface DiaChi {
  idDiaChi: number;
  tenNguoiNhan: string;
  soDienThoai: string;
  diaChiChiTiet: string;
  phuongXa: string;
  quanHuyen: string;
  thanhPho: string;
  macDinh: boolean;
  idUsers: number;
}

export default function OrderManagementPage() {
  const initialFormData: FormData = {
    TrangThaiDonHang: "",
    sendEmail: true,
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
  const [sendingEmail, setSendingEmail] = useState(false);
  const [addressesCache, setAddressesCache] = useState<Record<number, DiaChi>>(
    {}
  );
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const { toast } = useToast();

  const refreshData = () => {
    setReloadKey((prev) => prev + 1);
  };

  // Fetch all addresses at once
  const fetchAllAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await fetch("/api/Address/all");
      if (!response.ok) {
        throw new Error("Không thể tải danh sách địa chỉ");
      }
      const data = await response.json();

      if (data.success && data.addresses) {
        setAddressesCache(data.addresses);
        console.log(
          "Loaded all addresses:",
          Object.keys(data.addresses).length
        );
      }
    } catch (error) {
      console.error("Error fetching all addresses:", error);
      toast({
        title: "Lỗi",
        description:
          "Không thể tải danh sách địa chỉ. Một số thông tin địa chỉ có thể không hiển thị.",
        variant: "destructive",
      });
    } finally {
      setLoadingAddresses(false);
    }
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
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch orders
        const orderResponse = await fetch("/api/donhang");
        if (!orderResponse.ok) {
          throw new Error("Failed to fetch order data");
        }
        const orderData = await orderResponse.json();
        console.log("Order data:", orderData);

        // Fetch all addresses in parallel
        await fetchAllAddresses();
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reloadKey]);

  const fetchAddressById = async (idDiaChi: number) => {
    // Check if we already have this address in cache
    if (addressesCache[idDiaChi]) {
      return addressesCache[idDiaChi];
    }

    setFetchingAddress(true);
    try {
      const response = await fetch(`/api/Address/${idDiaChi}`);
      if (!response.ok) {
        throw new Error("Không thể tải thông tin địa chỉ");
      }
      const data = await response.json();

      // Add to cache
      setAddressesCache((prev) => ({
        ...prev,
        [idDiaChi]: data.address,
      }));

      return data.address;
    } catch (error) {
      console.error("Error fetching address:", error);
      return null;
    } finally {
      setFetchingAddress(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleEdit = (order: DonHang) => {
    setFormData({
      TrangThaiDonHang: order.trangthai,
      sendEmail: true,
    });
    setIsEditing(true);
    setEditingId(order.iddonhang);
    setSelectedOrder(order);

    const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  const handleViewOrder = async (donhang: DonHang) => {
    // If the order has an address ID but no address data, check the cache
    if (donhang.idDiaChi && !donhang.diaChiGiaoHang) {
      if (addressesCache[donhang.idDiaChi]) {
        // Use cached address
        donhang = {
          ...donhang,
          diaChiGiaoHang: addressesCache[donhang.idDiaChi],
        };
      } else {
        // Fetch individual address if not in cache
        try {
          const address = await fetchAddressById(donhang.idDiaChi);
          if (address) {
            donhang = {
              ...donhang,
              diaChiGiaoHang: address,
            };
          }
        } catch (error) {
          console.error("Error fetching address for order:", error);
        }
      }
    }

    setSelectedOrder(donhang);
    const modal = document.getElementById(
      "order-detail-modal"
    ) as HTMLDialogElement;
    modal?.showModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const url = isEditing ? `/api/donhang/${editingId}` : "/api/donhang";
    const method = isEditing ? "PUT" : "POST";

    try {
      setSendingEmail(formData.sendEmail);

      console.log("Sending request to:", url, "with method:", method);
      console.log("Request data:", {
        ...formData,
        sendEmail: formData.sendEmail,
      });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          sendEmail: formData.sendEmail,
        }),
        credentials: "include", // Đảm bảo gửi cookies để xác thực
      });

      console.log("Response status:", response.status);

      if (response.status === 401) {
        // Xử lý lỗi phiên đăng nhập hết hạn
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        toast({
          title: "Lỗi xác thực",
          description: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
          variant: "destructive",
        });
        return;
      }

      if (response.status === 403) {
        // Xử lý lỗi không có quyền
        const errorData = await response.json();
        setError(
          "Bạn không có quyền thực hiện thao tác này. Chi tiết: " +
            (errorData.error || "Lỗi quyền truy cập")
        );
        toast({
          title: "Lỗi quyền truy cập",
          description:
            "Bạn không có quyền thực hiện thao tác này. Vui lòng liên hệ quản trị viên.",
          variant: "destructive",
        });
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            errorData.message ||
            `Failed to ${isEditing ? "update" : "create"} order`
        );
      }

      const data = await response.json();

      // Handle email notification success
      let successMessage = data.message;
      if (formData.sendEmail && data.emailSent) {
        successMessage += " Email thông báo đã được gửi đến khách hàng.";
      }

      setSuccess(successMessage);
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
        description: successMessage,
        variant: "success",
      });
    } catch (err) {
      console.error("Error submitting form:", err);
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
    } finally {
      setSendingEmail(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      try {
        const response = await fetch(`/api/donhang/${deleteConfirmId}`, {
          method: "DELETE",
          credentials: "include", // Đảm bảo gửi cookies để xác thực
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "đã giao":
        return "text-green-600";
      case "đang xử lý":
        return "text-blue-600";
      case "đã hủy":
        return "text-red-600";
      case "đã gửi vận chuyển":
        return "text-purple-600";
      case "đang vô tới sg":
        return "text-amber-600";
      case "đang trên đường giao tới cho bạn":
        return "text-cyan-600";
      default:
        return "text-gray-600";
    }
  };

  const getImageUrl = (sanpham: any) => {
    if (!sanpham) return "/no-image.jpg";

    if (sanpham.hinhanh) {
      // Check if it's already a full URL
      if (sanpham.hinhanh.startsWith("http")) {
        return sanpham.hinhanh;
      }
      // If it's not a full URL, construct it with NEXT_PUBLIC_SUPABASE_URL
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${sanpham.hinhanh}`;
    }

    return "/no-image.jpg";
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
      <div className="p-6 flex-1">
        <Toaster />
        <div className="flex items-center justify-between mt-10 ml-80">
          <h1 className="text-2xl font-bold">Quản Lý Đơn Hàng</h1>
          {loadingAddresses && (
            <div className="flex items-center text-sm text-gray-500">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang tải dữ liệu địa chỉ...
            </div>
          )}
        </div>

        <TableDonHang
          onView={handleViewOrder}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteConfirmId(id)}
          reloadKey={reloadKey}
          addressesCache={addressesCache}
        />
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

        {/* Edit Modal */}
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
              <div className="pt-6 w-full">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Trạng Thái</span>
                    </label>
                    <select
                      name="TrangThaiDonHang"
                      value={formData.TrangThaiDonHang}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="" disabled>
                        Chọn trạng thái
                      </option>
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Đã gửi vận chuyển">
                        Đã gửi vận chuyển
                      </option>
                      <option value="Đang vô tới SG">Đang vô tới SG</option>
                      <option value="Đang trên đường giao tới cho bạn">
                        Đang trên đường giao tới cho bạn
                      </option>
                      <option value="Đã giao">Đã giao</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </div>

                  {/* Email notification option */}
                  <div className="form-control">
                    <label className="cursor-pointer label justify-start gap-2">
                      <input
                        type="checkbox"
                        name="sendEmail"
                        checked={formData.sendEmail}
                        onChange={handleChange}
                        className="checkbox checkbox-primary"
                      />
                      <span className="label-text">
                        Gửi email thông báo đến khách hàng
                      </span>
                    </label>
                  </div>

                  {selectedOrder?.users?.Email && (
                    <div className="bg-blue-50 p-3 rounded-md">
                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-blue-700">
                            Email sẽ được gửi đến:{" "}
                            <span className="font-medium">
                              {selectedOrder.users.Email}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={handleModalClose}
                    >
                      Hủy Bỏ
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={sendingEmail}
                    >
                      {sendingEmail ? (
                        <>
                          <span className="loading loading-spinner loading-xs mr-2"></span>
                          Đang xử lý...
                        </>
                      ) : isEditing ? (
                        "Cập Nhật"
                      ) : (
                        "Thêm Mới"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </dialog>

        {/* Order Detail Modal */}
        <dialog id="order-detail-modal" className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-xl mb-4">
              Chi Tiết Đơn Hàng #{selectedOrder?.iddonhang}
            </h3>

            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">
                      Thông Tin Đơn Hàng
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Mã đơn hàng:</span>
                        <span className="font-medium">
                          {selectedOrder.iddonhang}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Ngày đặt:</span>
                        <span className="font-medium">
                          {formatDate(selectedOrder.ngaydat)}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Trạng thái:</span>
                        <span
                          className={`font-medium ${getStatusColor(
                            selectedOrder.trangthai
                          )}`}
                        >
                          {selectedOrder.trangthai}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Tổng số lượng:</span>
                        <span className="font-medium">
                          {selectedOrder.tongsoluong}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Tổng tiền:</span>
                        <span className="font-medium">
                          {formatCurrency(selectedOrder.tongsotien)}
                        </span>
                      </li>
                      {selectedOrder.idDiscount !== null &&
                        selectedOrder.idDiscount !== undefined && (
                          <li className="flex justify-between">
                            <span className="text-gray-600">Mã giảm giá:</span>
                            <span className="font-medium">
                              {selectedOrder.idDiscount}
                            </span>
                          </li>
                        )}
                      {selectedOrder.discountValue !== null &&
                        selectedOrder.discountValue !== undefined &&
                        selectedOrder.discountValue > 0 && (
                          <li className="flex justify-between">
                            <span className="text-gray-600">Giá trị giảm:</span>
                            <span className="font-medium text-green-600">
                              {formatCurrency(selectedOrder.discountValue)}
                            </span>
                          </li>
                        )}
                      <li className="flex justify-between">
                        <span className="text-gray-600">Ngày giao:</span>
                        <span className="font-medium">
                          {selectedOrder.lichgiaohang?.[0]?.NgayGiao
                            ? formatDate(selectedOrder.lichgiaohang[0].NgayGiao)
                            : "Chưa giao"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">
                      Thông Tin Khách Hàng
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Họ tên:</span>
                        <span className="font-medium">
                          {selectedOrder.users?.Hoten || "Không có thông tin"}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">
                          {selectedOrder.users?.Email || "Không có thông tin"}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Số điện thoại:</span>
                        <span className="font-medium">
                          {selectedOrder.users?.Sdt || "Không có thông tin"}
                        </span>
                      </li>
                      <li>
                        <span className="text-gray-600">Địa chỉ:</span>
                        <div className="mt-1 p-2 bg-white rounded">
                          {selectedOrder.users?.Diachi ||
                            "Không có thông tin địa chỉ"}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Địa chỉ giao hàng - Hiển thị nổi bật */}
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <h4 className="font-semibold text-lg mb-2 text-blue-700 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Địa Chỉ Giao Hàng
                    {fetchingAddress && (
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    )}
                  </h4>
                  {selectedOrder.diaChiGiaoHang ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span className="text-gray-600">Người nhận:</span>
                            <span className="font-medium">
                              {selectedOrder.diaChiGiaoHang.tenNguoiNhan}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600">
                              Số điện thoại:
                            </span>
                            <span className="font-medium">
                              {selectedOrder.diaChiGiaoHang.soDienThoai}
                            </span>
                          </li>
                          <li>
                            <span className="text-gray-600">
                              Địa chỉ chi tiết:
                            </span>
                            <div className="mt-1 p-2 bg-white rounded">
                              {selectedOrder.diaChiGiaoHang.diaChiChiTiet}
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span className="text-gray-600">Phường/Xã:</span>
                            <span className="font-medium">
                              {selectedOrder.diaChiGiaoHang.phuongXa}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600">Quận/Huyện:</span>
                            <span className="font-medium">
                              {selectedOrder.diaChiGiaoHang.quanHuyen}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-gray-600">
                              Tỉnh/Thành phố:
                            </span>
                            <span className="font-medium">
                              {selectedOrder.diaChiGiaoHang.thanhPho}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="md:col-span-2">
                        <div className="mt-2 p-3 bg-white rounded-md border border-blue-200">
                          <span className="font-medium text-blue-700">
                            Địa chỉ đầy đủ:
                          </span>
                          <p className="mt-1">
                            {`${selectedOrder.diaChiGiaoHang.tenNguoiNhan}, ${selectedOrder.diaChiGiaoHang.soDienThoai}, ${selectedOrder.diaChiGiaoHang.diaChiChiTiet}, ${selectedOrder.diaChiGiaoHang.phuongXa}, ${selectedOrder.diaChiGiaoHang.quanHuyen}, ${selectedOrder.diaChiGiaoHang.thanhPho}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : selectedOrder.idDiaChi ? (
                    <div className="flex justify-center items-center p-4">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={async () => {
                          if (selectedOrder.idDiaChi) {
                            const address = await fetchAddressById(
                              selectedOrder.idDiaChi
                            );
                            if (address) {
                              setSelectedOrder({
                                ...selectedOrder,
                                diaChiGiaoHang: address,
                              });
                            }
                          }
                        }}
                        disabled={fetchingAddress}
                      >
                        {fetchingAddress ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang tải...
                          </>
                        ) : (
                          "Tải thông tin địa chỉ"
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 text-red-500 italic bg-white rounded">
                      Không có thông tin địa chỉ giao hàng
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">
                    Chi Tiết Sản Phẩm
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="text-left">Sản phẩm</th>
                          <th className="text-center">Hình ảnh</th>
                          <th className="text-center">Đơn giá</th>
                          <th className="text-center">Số lượng</th>
                          <th className="text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.chitietdonhang.map((item) => (
                          <tr key={item.idchitietdonhang} className="border-b">
                            <td className="py-3">
                              {item.sanpham?.tensanpham || item.tensanpham}
                            </td>
                            <td className="py-3">
                              <div className="flex justify-center">
                                <div className="w-16 h-16">
                                  <img
                                    src={
                                      getImageUrl(item.sanpham) ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg"
                                    }
                                    alt={item.sanpham?.tensanpham || "Sản phẩm"}
                                    className="w-16 h-16 object-cover rounded"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.src = "/no-image.jpg";
                                      target.onerror = null;
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="text-center py-3">
                              {formatCurrency(item.dongia)}
                            </td>
                            <td className="text-center py-3">{item.soluong}</td>
                            <td className="text-right py-3">
                              {formatCurrency(item.dongia * item.soluong)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        {selectedOrder.discountValue !== null &&
                          selectedOrder.discountValue !== undefined &&
                          selectedOrder.discountValue > 0 && (
                            <tr>
                              <td colSpan={4} className="text-right pt-4">
                                Giảm giá:
                              </td>
                              <td className="text-right pt-4 text-green-600">
                                - {formatCurrency(selectedOrder.discountValue)}
                              </td>
                            </tr>
                          )}
                        <tr className="font-semibold">
                          <td colSpan={4} className="text-right pt-4">
                            Tổng cộng:
                          </td>
                          <td className="text-right pt-4">
                            {formatCurrency(selectedOrder.tongsotien)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      const modal = document.getElementById(
                        "order-detail-modal"
                      ) as HTMLDialogElement;
                      modal?.close();
                    }}
                  >
                    Đóng
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const modal = document.getElementById(
                        "order-detail-modal"
                      ) as HTMLDialogElement;
                      modal?.close();
                      handleEdit(selectedOrder);
                    }}
                  >
                    Cập Nhật Trạng Thái
                  </button>
                </div>
              </div>
            )}
          </div>
        </dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={deleteConfirmId !== null}
          onOpenChange={() => setDeleteConfirmId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa đơn hàng</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể
                hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
