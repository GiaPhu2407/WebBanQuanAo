"use client";
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TableDanhGia from "./component/TableDanhGia";

// Import table component

// Import components with client-side only rendering to avoid hydration issues
const SalesDashboard = dynamic(() => import("../DashBoard/NvarbarAdmin"), {
  ssr: false,
});

interface Product {
  idsanpham: number;
  tensanpham: string;
  hinhanh?: string | null;
}

interface Review {
  iddanhgia: number;
  idsanpham: number;
  idUsers: number;
  sao: number;
  noidung: string;
  ngaydanhgia: string;
  users: {
    Tentaikhoan: string;
    Hoten: string;
  };
  sanpham?: Product;
}

// Main component
export default function ReviewManagementPage() {
  // State for client-side rendering check
  const [isClient, setIsClient] = useState(false);
  // Track sidebar expansion state
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Main states
  const [formData, setFormData] = useState<{
    iddanhgia: number;
    sao: number;
    noidung: string;
  }>({
    iddanhgia: 0,
    sao: 5,
    noidung: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentReviewId, setCurrentReviewId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { toast } = useToast();

  // Set isClient to true when component mounts and listen for sidebar toggle events
  useEffect(() => {
    setIsClient(true);

    // Function to handle sidebar expansion state changes
    const handleSidebarChange = (e: CustomEvent) => {
      setSidebarExpanded(e.detail.expanded);
    };

    // Add event listener for sidebar toggle
    window.addEventListener(
      "sidebarToggle",
      handleSidebarChange as EventListener
    );

    // Cleanup event listener
    return () => {
      window.removeEventListener(
        "sidebarToggle",
        handleSidebarChange as EventListener
      );
    };
  }, []);

  // Form validation and handling
  const validateForm = (): string | null => {
    if (formData.sao < 1 || formData.sao > 5) return "Số sao phải từ 1 đến 5";
    if (!formData.noidung.trim()) return "Vui lòng nhập nội dung đánh giá";
    if (formData.noidung.length > 256)
      return "Nội dung đánh giá không được vượt quá 256 ký tự";
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sao" ? parseInt(value) : value,
    }));
  };

  const handleStarChange = (value: string) => {
    setFormData((prev) => ({ ...prev, sao: parseInt(value) }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Lỗi",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    try {
      const url = `/api/evaluate/${currentReviewId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sao: formData.sao,
          noidung: formData.noidung,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Lỗi khi cập nhật đánh giá");
      }

      toast({
        title: "Thành công",
        description: "Cập nhật đánh giá thành công",
        variant: "success",
      });

      handleCloseModal();
      setReloadKey((prev) => prev + 1);
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Lỗi khi xử lý yêu cầu",
        variant: "destructive",
      });
    }
  };

  // Action handlers
  const handleEdit = (review: Review) => {
    setFormData({
      iddanhgia: review.iddanhgia,
      sao: review.sao,
      noidung: review.noidung,
    });
    setCurrentReviewId(review.iddanhgia);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      iddanhgia: 0,
      sao: 5,
      noidung: "",
    });
    setCurrentReviewId(null);
    setIsEditing(false);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      const response = await fetch(`/api/evaluate/${deleteConfirmId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Không thể xóa đánh giá");
      }

      toast({
        title: "Thành công",
        description: "Xóa đánh giá thành công",
      });

      setReloadKey((prev) => prev + 1);
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Lỗi khi xóa đánh giá",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteConfirmId(null);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  // Show a loading state during server-side rendering
  if (!isClient) {
    return (
      <div className="flex flex-col bg-gray-100 h-screen items-center justify-center">
        <div className="text-center p-4">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-100">
      <SalesDashboard
        onSidebarToggle={(expanded) => setSidebarExpanded(expanded)}
      />
      <div
        className={`flex-1 p-4 sm:p-6 pt-16 sm:pt-20 transition-all duration-300 ${
          sidebarExpanded ? "md:ml-64" : "md:ml-16"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Quản lý đánh giá
            </h1>
          </div>

          {/* Table Component - Passing sidebar state to table if needed */}
          <TableDanhGia
            onEdit={handleEdit}
            onDelete={handleDelete}
            reloadKey={reloadKey}
            sidebarExpanded={sidebarExpanded}
          />

          {/* Edit Dialog */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Cập nhật đánh giá</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Số sao</label>
                  <Select
                    value={formData.sao.toString()}
                    onValueChange={handleStarChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 sao</SelectItem>
                      <SelectItem value="2">2 sao</SelectItem>
                      <SelectItem value="3">3 sao</SelectItem>
                      <SelectItem value="4">4 sao</SelectItem>
                      <SelectItem value="5">5 sao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Nội dung đánh giá
                  </label>
                  <Textarea
                    name="noidung"
                    value={formData.noidung}
                    onChange={handleChange}
                    placeholder="Nhập nội dung đánh giá"
                    className="min-h-[100px]"
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">Cập nhật</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không
                  thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                  Hủy
                </AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete}>
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
