"use client";

import { useState, useEffect } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, Plus } from "lucide-react";
import PaymentTable from "../../Tablethanhtoan";

// Interfaces
interface Payment {
  idthanhtoan: number;
  iddonhang: number | null;
  phuongthucthanhtoan: string | null;
  sotien: number | null;
  trangthai: string | null;
  ngaythanhtoan: string | null;
  donhang?: {
    iddonhang: number;
    tongsotien: number | null;
    trangthai: string | null;
    users?: {
      idUsers: number;
      Email: string;
      Hoten: string;
    };
  };
}

interface FormData {
  iddonhang: number | null;
  phuongthucthanhtoan: string | null;
  sotien: number | null;
  trangthai: string | null;
  ngaythanhtoan: string | null;
  sendEmail: boolean;
}

interface DonHang {
  iddonhang: number;
  tongsotien?: number;
  trangthai?: string;
  users?: {
    idUsers: number;
    Email: string;
    Hoten: string;
  };
}

const PaymentManagementPage = () => {
  // State management
  const [formData, setFormData] = useState<FormData>({
    iddonhang: null,
    phuongthucthanhtoan: null,
    sotien: null,
    trangthai: null,
    ngaythanhtoan: null,
    sendEmail: true,
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchingDonHang, setFetchingDonHang] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [donHangs, setDonHangs] = useState<DonHang[]>([]);
  const [selectedDonHang, setSelectedDonHang] = useState<DonHang | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const { toast } = useToast();

  // Handle sidebar toggle from SalesDashboard
  const handleSidebarToggle = (expanded: boolean) => {
    setSidebarExpanded(expanded);
  };

  // Dropdown options
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

  // Listen for sidebar toggle events
  useEffect(() => {
    const handleSidebarEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.expanded !== undefined) {
        setSidebarExpanded(customEvent.detail.expanded);
      }
    };

    window.addEventListener("sidebarToggle", handleSidebarEvent);

    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarEvent);
    };
  }, []);

  // Fetch đơn hàng when component mounts
  useEffect(() => {
    fetchDonHangs();
    setLoading(false);
  }, []);

  const fetchDonHangs = async () => {
    try {
      setFetchingDonHang(true);
      console.log("Đang tải danh sách đơn hàng...");

      const response = await fetch("/api/donhang");
      if (!response.ok) {
        throw new Error("Không thể tải danh sách đơn hàng");
      }

      const data = await response.json();

      // Xử lý dữ liệu phù hợp với cấu trúc API
      if (data.data && Array.isArray(data.data)) {
        setDonHangs(data.data);
      } else if (data.success && data.data && Array.isArray(data.data)) {
        setDonHangs(data.data);
      } else if (Array.isArray(data)) {
        setDonHangs(data);
      } else {
        toast({
          title: "Lưu ý",
          description:
            "Định dạng dữ liệu đơn hàng không như mong đợi. Vui lòng kiểm tra API.",
          variant: "default",
        });
        // Fallback to empty array instead of failing
        setDonHangs([]);
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách đơn hàng",
        variant: "destructive",
      });
      setDonHangs([]);
    } finally {
      setFetchingDonHang(false);
    }
  };

  // Fetch chi tiết đơn hàng theo ID
  const fetchDonHangDetails = async (iddonhang: number) => {
    try {
      const response = await fetch(`/api/donhang/${iddonhang}`);
      if (!response.ok) {
        throw new Error("Không thể tải chi tiết đơn hàng");
      }

      const data = await response.json();

      // Lưu thông tin đơn hàng đã chọn
      if (data.success && data.data) {
        setSelectedDonHang(data.data);
        return data.data;
      } else if (data.data) {
        setSelectedDonHang(data.data);
        return data.data;
      } else {
        setSelectedDonHang(data);
        return data;
      }
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
      sendEmail: true,
    });
    setEditingId(null);
    setIsEditing(false);
    setSelectedDonHang(null);
  };

  // Handle form input changes
  const handleChange = (
    name: string,
    value: string | number | null | boolean
  ) => {
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
    setIsModalOpen(true);

    // Đảm bảo rằng danh sách đơn hàng đã được tải
    if (donHangs.length === 0 && !fetchingDonHang) {
      fetchDonHangs();
    }
  };

  // Handle edit payment
  const handleEdit = async (payment: Payment) => {
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
      sendEmail: true,
    });
    setEditingId(payment.idthanhtoan);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Submit form (create/update payment)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (
      !formData.iddonhang ||
      !formData.phuongthucthanhtoan ||
      !formData.sotien
    ) {
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
      setSendingEmail(formData.sendEmail);

      const url = isEditing ? `/api/thanhtoan/${editingId}` : "/api/thanhtoan";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Lỗi ${isEditing ? "cập nhật" : "tạo"} thanh toán`
        );
      }

      const data = await response.json();

      // Handle email notification success
      let successMessage =
        data.message ||
        `${isEditing ? "Cập nhật" : "Thêm mới"} thanh toán thành công`;
      if (formData.sendEmail && data.emailSent) {
        successMessage +=
          " Email xác nhận thanh toán đã được gửi đến khách hàng.";
      }

      setSuccess(successMessage);

      resetForm();
      refreshData();
      setIsModalOpen(false);

      toast({
        title: "Thành Công!",
        description: successMessage,
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
    } finally {
      setSendingEmail(false);
    }
  };

  // Handle delete payment
  const handleDelete = async () => {
    if (deleteConfirmId) {
      try {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <SalesDashboard onSidebarToggle={handleSidebarToggle} />

      {/* Main content area with dynamic width based on sidebar state */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-auto ${
          sidebarExpanded ? "md:ml-64" : "md:ml-16"
        } mt-14`}
      >
        <div className="p-6 flex-1">
          <Toaster />

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Quản Lý Thanh Toán</h1>
              <p className="text-gray-500 mt-1">
                Quản lý tất cả các giao dịch thanh toán
              </p>
            </div>
            <Button
              onClick={handleOpenCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm Mới Thanh Toán
            </Button>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <PaymentTable
                key={reloadKey}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteConfirmId(id)}
                refreshTrigger={reloadKey}
              />
            </CardContent>
          </Card>

          {/* Payment Form Modal */}
          <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <AlertDialogContent className="max-w-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {isEditing ? "Cập Nhật Thanh Toán" : "Thêm Mới Thanh Toán"}
                </AlertDialogTitle>
              </AlertDialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 py-2">
                {/* Đơn Hàng Select/Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="iddonhang" className="text-sm font-medium">
                      Đơn Hàng
                    </Label>
                    {isEditing ? (
                      <div className="mt-1 p-2 border rounded-md bg-gray-50">
                        {selectedDonHang ? (
                          <div>
                            <span className="font-medium">
                              Đơn hàng #{formData.iddonhang}
                            </span>
                            {selectedDonHang.tongsotien && (
                              <span className="ml-2 text-gray-600 text-sm">
                                - Tổng tiền:{" "}
                                {Number(
                                  selectedDonHang.tongsotien
                                ).toLocaleString("vi-VN")}{" "}
                                đ
                              </span>
                            )}
                            {selectedDonHang.trangthai && (
                              <span className="ml-2 text-gray-600 text-sm">
                                - Trạng thái: {selectedDonHang.trangthai}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span>Đơn hàng #{formData.iddonhang}</span>
                        )}
                      </div>
                    ) : (
                      <Select
                        value={formData.iddonhang?.toString() || ""}
                        onValueChange={(value) =>
                          handleChange("iddonhang", Number(value))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Chọn đơn hàng" />
                        </SelectTrigger>
                        <SelectContent>
                          {fetchingDonHang ? (
                            <SelectItem value="" disabled>
                              Đang tải danh sách đơn hàng...
                            </SelectItem>
                          ) : donHangs.length > 0 ? (
                            donHangs.map((donHang) => (
                              <SelectItem
                                key={donHang.iddonhang}
                                value={donHang.iddonhang.toString()}
                              >
                                Đơn hàng #{donHang.iddonhang}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>
                              Không có đơn hàng nào
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                    {!isEditing &&
                      donHangs.length === 0 &&
                      !fetchingDonHang && (
                        <p className="text-sm text-red-500 mt-1">
                          <Button
                            type="button"
                            variant="link"
                            className="p-0 h-auto text-blue-500"
                            onClick={fetchDonHangs}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Tải lại danh sách đơn hàng
                          </Button>
                        </p>
                      )}
                  </div>

                  {/* Phương Thức Thanh Toán */}
                  <div>
                    <Label
                      htmlFor="phuongthucthanhtoan"
                      className="text-sm font-medium"
                    >
                      Phương Thức Thanh Toán
                    </Label>
                    <Select
                      value={formData.phuongthucthanhtoan || ""}
                      onValueChange={(value) =>
                        handleChange("phuongthucthanhtoan", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Chọn phương thức" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Số Tiền */}
                  <div>
                    <Label htmlFor="sotien" className="text-sm font-medium">
                      Số Tiền
                    </Label>
                    <Input
                      id="sotien"
                      type="number"
                      value={formData.sotien || ""}
                      onChange={(e) =>
                        handleChange(
                          "sotien",
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      placeholder="Nhập số tiền"
                      className="mt-1"
                    />
                  </div>

                  {/* Trạng Thái */}
                  <div>
                    <Label htmlFor="trangthai" className="text-sm font-medium">
                      Trạng Thái
                    </Label>
                    <Select
                      value={formData.trangthai || ""}
                      onValueChange={(value) =>
                        handleChange("trangthai", value)
                      }
                      disabled={formData.phuongthucthanhtoan === "Online"}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Ngày Thanh Toán */}
                <div>
                  <Label
                    htmlFor="ngaythanhtoan"
                    className="text-sm font-medium"
                  >
                    Ngày Thanh Toán
                  </Label>
                  <Input
                    id="ngaythanhtoan"
                    type="date"
                    value={formData.ngaythanhtoan || ""}
                    onChange={(e) =>
                      handleChange("ngaythanhtoan", e.target.value || null)
                    }
                    className="mt-1"
                  />
                </div>

                {/* Email notification option */}
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="sendEmail"
                    checked={formData.sendEmail}
                    onCheckedChange={(checked) =>
                      handleChange("sendEmail", checked === true)
                    }
                  />
                  <Label
                    htmlFor="sendEmail"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Gửi email xác nhận thanh toán đến khách hàng
                  </Label>
                </div>

                {selectedDonHang?.users?.Email && (
                  <div className="bg-blue-50 p-3 rounded-md mt-2">
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
                            {selectedDonHang.users.Email}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>

              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={sendingEmail}
                >
                  {sendingEmail ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </>
                  ) : isEditing ? (
                    "Cập Nhật"
                  ) : (
                    "Thêm Mới"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

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
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagementPage;
