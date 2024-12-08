"use client";
import React, { useState, useEffect } from "react";
import SalesDashboard from "../NvarbarAdmin";
import KhoTable from "../../TableKho";
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
import { toast } from "@/components/ui/use-toast";

interface Kho {
  idKho: number;
  idsanpham: number | null;
  soluong: number | null;
}

interface Product {
  idsanpham: number;
  tensanpham: string;
}

interface FormData {
  idsanpham: number | null;
  soluong: number | null;
}

const KhoManagementPage = () => {
  const [formData, setFormData] = useState<FormData>({
    idsanpham: null,
    soluong: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentKhoId, setCurrentKhoId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [khoToDelete, setKhoToDelete] = useState<number | null>(null);

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/sanpham");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách sản phẩm",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      idsanpham: null,
      soluong: null,
    });
    setCurrentKhoId(null);
    setIsEditing(false);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "idsanpham" || name === "soluong"
          ? value
            ? parseInt(value)
            : null
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form data
    if (!formData.idsanpham) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn sản phẩm",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = isEditing ? `/api/kho/${currentKhoId}` : "/api/kho";
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
          ? "Cập nhật kho thành công"
          : "Thêm mới kho thành công",
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

  const handleEdit = (kho: Kho) => {
    setFormData({
      idsanpham: kho.idsanpham,
      soluong: kho.soluong,
    });
    setCurrentKhoId(kho.idKho);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setKhoToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!khoToDelete) return;

    try {
      const response = await fetch(`/api/kho/${khoToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Không thể xóa kho");
      }

      toast({
        title: "Thành công",
        description: "Xóa kho thành công",
      });

      setReloadKey((prev) => prev + 1);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Lỗi khi xóa kho",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setKhoToDelete(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SalesDashboard />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Quản lý Kho</h1>
            <Button onClick={handleOpenModal}>Thêm mục kho mới</Button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <KhoTable
              onEdit={handleEdit}
              onDelete={handleDelete}
              reloadKey={reloadKey}
            />
          </div>

          {/* Form Dialog */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Cập nhật mục kho" : "Thêm mục kho mới"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sản phẩm</label>
                  <select
                    name="idsanpham"
                    value={formData.idsanpham || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.map((product) => (
                      <option key={product.idsanpham} value={product.idsanpham}>
                        {product.tensanpham}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Số lượng</label>
                  <Input
                    type="number"
                    name="soluong"
                    value={formData.soluong || ""}
                    onChange={handleChange}
                    placeholder="Nhập số lượng"
                    min="0"
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
                  <Button type="submit">
                    {isEditing ? "Cập nhật" : "Thêm mới"}
                  </Button>
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
                  Bạn có chắc chắn muốn xóa mục kho này? Hành động này không thể
                  hoàn tác.
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
};

export default KhoManagementPage;
