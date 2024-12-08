"use client";
import React, { useState, useEffect } from "react";
import SalesDashboard from "../NvarbarAdmin";
import KeTable from "../../TableKe";
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

// Interfaces
interface Ke {
  idke: number;
  idvung: number | null;
  tenke: string | null;
}

interface Vung {
  idVung: number;
  tenvung: string;
}

interface FormData {
  idvung: number | null;
  tenke: string | null;
}

const KeManagementPage = () => {
  // State management
  const [formData, setFormData] = useState<FormData>({
    idvung: null,
    tenke: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentKeId, setCurrentKeId] = useState<number | null>(null);
  const [vungs, setVungs] = useState<Vung[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [keToDelete, setKeToDelete] = useState<number | null>(null);

  // Fetch vungs data on component mount
  useEffect(() => {
    const fetchVungs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/kho/vung");
        if (!response.ok) {
          throw new Error("Failed to fetch zones");
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setVungs(data);
        } else {
          console.error("Expected array of vungs, received:", data);
          setVungs([]);
          toast({
            title: "Lỗi",
            description: "Dữ liệu vùng không đúng định dạng",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching vungs:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách vùng",
          variant: "destructive",
        });
        setVungs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVungs();
  }, []);

  // Form handling
  const resetForm = () => {
    setFormData({
      idvung: null,
      tenke: null,
    });
    setCurrentKeId(null);
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
      [name]: name === "idvung" ? (value ? parseInt(value) : null) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.tenke?.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên kệ",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = isEditing ? `/api/kho/ke/${currentKeId}` : "/api/kho/ke";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Lỗi khi xử lý yêu cầu");
      }

      toast({
        title: "Thành công",
        description: isEditing
          ? "Cập nhật kệ thành công"
          : "Thêm mới kệ thành công",
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

  // CRUD operations
  const handleEdit = (ke: Ke) => {
    setFormData({
      idvung: ke.idvung,
      tenke: ke.tenke,
    });
    setCurrentKeId(ke.idke);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setKeToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!keToDelete) return;

    try {
      const response = await fetch(`/api/kho/ke/${keToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể xóa kệ");
      }

      toast({
        title: "Thành công",
        description: "Xóa kệ thành công",
      });

      setReloadKey((prev) => prev + 1);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Lỗi khi xóa kệ",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setKeToDelete(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SalesDashboard />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Quản lý Kệ</h1>
            <Button onClick={handleOpenModal}>Thêm kệ mới</Button>
          </div>

          {/* Main Table */}
          <div className="bg-white rounded-lg shadow">
            <KeTable
              onEdit={handleEdit}
              onDelete={handleDelete}
              reloadKey={reloadKey}
            />
          </div>

          {/* Add/Edit Dialog */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Cập nhật kệ" : "Thêm kệ mới"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tên kệ field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tên kệ</label>
                  <Input
                    type="text"
                    name="tenke"
                    value={formData.tenke || ""}
                    onChange={handleChange}
                    placeholder="Nhập tên kệ"
                  />
                </div>

                {/* Vùng selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vùng</label>
                  <select
                    name="idvung"
                    value={formData.idvung || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    disabled={isLoading}
                  >
                    <option value="">Chọn vùng</option>
                    {Array.isArray(vungs) &&
                      vungs.map((vung) => (
                        <option key={vung.idVung} value={vung.idVung}>
                          {vung.tenvung}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Dialog Footer */}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isLoading}>
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
                  Bạn có chắc chắn muốn xóa kệ này? Hành động này không thể hoàn
                  tác.
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

export default KeManagementPage;
