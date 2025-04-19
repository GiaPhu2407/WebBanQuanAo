"use client";
import React, { useState, useEffect } from "react";
import SalesDashboard from "../NvarbarAdmin";
import VungTable from "../../TableVung";
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

interface Vung {
  idVung: number;
  idkho: number | null;
  tenvung: string | null;
}

interface Kho {
  idKho: number;
  idsanpham: number | null;
}

interface FormData {
  idkho: number | null;
  tenvung: string | null;
}

const VungManagementPage = () => {
  const [formData, setFormData] = useState<FormData>({
    idkho: null,
    tenvung: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentVungId, setCurrentVungId] = useState<number | null>(null);
  const [khos, setKhos] = useState<Kho[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vungToDelete, setVungToDelete] = useState<number | null>(null);

  // Fetch kho list when component mounts
  useEffect(() => {
    fetchKhos();
  }, []);

  const fetchKhos = async () => {
    try {
      const response = await fetch("/api/kho");
      if (!response.ok) {
        throw new Error("Failed to fetch kho list");
      }
      const data = await response.json();
      setKhos(data);
    } catch (error:any) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách kho",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      idkho: null,
      tenvung: "",
    });
    setCurrentVungId(null);
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
      [name]: name === "idkho" ? (value ? parseInt(value) : null) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form data
    if (!formData.tenvung) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên vùng",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = isEditing ? `/api/vung/${currentVungId}` : "/api/vung";
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
          ? "Cập nhật vùng thành công"
          : "Thêm mới vùng thành công",
      });

      handleCloseModal();
      setReloadKey((prev) => prev + 1);
    } catch (error:any) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Lỗi khi xử lý yêu cầu",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (vung: Vung) => {
    setFormData({
      idkho: vung.idkho,
      tenvung: vung.tenvung || "",
    });
    setCurrentVungId(vung.idVung);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setVungToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!vungToDelete) return;

    try {
      const response = await fetch(`/api/vung/${vungToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Không thể xóa vùng");
      }

      toast({
        title: "Thành công",
        description: "Xóa vùng thành công",
      });

      setReloadKey((prev) => prev + 1);
    } catch (error:any) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Lỗi khi xóa vùng",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setVungToDelete(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SalesDashboard />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Quản lý Vùng</h1>
            <Button onClick={handleOpenModal}>Thêm vùng mới</Button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <VungTable
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
                  {isEditing ? "Cập nhật vùng" : "Thêm vùng mới"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kho</label>
                  <select
                    name="idkho"
                    value={formData.idkho || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Chọn kho</option>
                    {khos.map((kho) => (
                      <option key={kho.idKho} value={kho.idKho}>
                        Kho {kho.idKho}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tên vùng</label>
                  <Input
                    type="text"
                    name="tenvung"
                    value={formData.tenvung || ""}
                    onChange={handleChange}
                    placeholder="Nhập tên vùng"
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
                  Bạn có chắc chắn muốn xóa vùng này? Hành động này không thể
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

export default VungManagementPage;
