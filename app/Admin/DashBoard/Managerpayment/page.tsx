"use client";
import React, { useState, useEffect } from "react";
import { Plus, FileEdit, Trash2 } from "lucide-react";
import SalesDashboard from "../NvarbarAdmin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentPaymentId, setCurrentPaymentId] = useState<number | null>(null);

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

  // Fetch đơn hàng when component mounts
  useEffect(() => {
    fetchDonHangs();
  }, []);

  const fetchDonHangs = async () => {
    try {
      const response = await fetch("/api/donhang");
      if (!response.ok) throw new Error("Failed to fetch đơn hàng");

      const data = await response.json();
      setDonHangs(data);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách đơn hàng",
        variant: "destructive",
      });
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
    setCurrentPaymentId(null);
    setIsEditing(false);
  };

  // Handle form input changes
  const handleChange = (name: string, value: string | number | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form (create/update payment)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    try {
      const url = isEditing
        ? `/api/thanhtoan/${currentPaymentId}`
        : "/api/thanhtoan";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Lỗi khi xử lý yêu cầu");
      }

      toast({
        title: "Thành công",
        description: isEditing
          ? "Cập nhật thanh toán thành công"
          : "Thêm mới thanh toán thành công",
      });

      setIsModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
      resetForm();
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Lỗi khi xử lý yêu cầu",
        variant: "destructive",
      });
    }
  };

  // Handle edit payment
  const handleEditPayment = (payment: Payment) => {
    setFormData({
      iddonhang: payment.iddonhang,
      phuongthucthanhtoan: payment.phuongthucthanhtoan,
      sotien: payment.sotien,
      trangthai: payment.trangthai,
      ngaythanhtoan: payment.ngaythanhtoan,
    });
    setCurrentPaymentId(payment.idthanhtoan);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Handle delete payment
  const handleDeletePayment = async (id: number) => {
    try {
      const response = await fetch(`/api/thanhtoan/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Không thể xóa thanh toán");
      }

      toast({
        title: "Thành công",
        description: "Xóa thanh toán thành công",
      });

      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Lỗi khi xóa thanh toán",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SalesDashboard />
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Quản Lý Thanh Toán
            </h1>
            {/* <Button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Thêm Thanh Toán
            </Button> */}
          </div>

          {/* Payment Table */}
          <PaymentTable
            onEdit={handleEditPayment}
            onDelete={handleDeletePayment}
            refreshTrigger={refreshTrigger}
          />

          {/* Payment Form Dialog */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Cập Nhật Thanh Toán" : "Thêm Thanh Toán Mới"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Đơn Hàng Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Đơn Hàng</label>
                  <Select
                    onValueChange={(value) =>
                      handleChange("iddonhang", parseInt(value))
                    }
                    value={formData.iddonhang?.toString() || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn đơn hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      {donHangs.map((donHang) => (
                        <SelectItem
                          key={donHang.iddonhang}
                          value={donHang.iddonhang.toString()}
                        >
                          {donHang.iddonhang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Phương Thức Thanh Toán */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Phương Thức Thanh Toán
                  </label>
                  <Select
                    onValueChange={(value) =>
                      handleChange("phuongthucthanhtoan", value)
                    }
                    value={formData.phuongthucthanhtoan || ""}
                  >
                    <SelectTrigger>
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

                {/* Số Tiền */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Số Tiền</label>
                  <Input
                    type="number"
                    placeholder="Nhập số tiền"
                    value={formData.sotien || ""}
                    onChange={(e) =>
                      handleChange(
                        "sotien",
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                    min="0"
                  />
                </div>

                {/* Trạng Thái */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trạng Thái</label>
                  <Select
                    onValueChange={(value) => handleChange("trangthai", value)}
                    value={formData.trangthai || ""}
                  >
                    <SelectTrigger>
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

                {/* Ngày Thanh Toán */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ngày Thanh Toán</label>
                  <Input
                    type="date"
                    value={formData.ngaythanhtoan || ""}
                    onChange={(e) =>
                      handleChange("ngaythanhtoan", e.target.value || null)
                    }
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">
                    {isEditing ? "Cập Nhật" : "Thêm Mới"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagementPage;
