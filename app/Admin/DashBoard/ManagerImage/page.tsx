"use client";
import React, { useState, useEffect } from "react";
import SalesDashboard from "../NvarbarAdmin";
import ImageTable from "../../TableImage";
import Image from "next/image";

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
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import Fileupload from "@/components/ui/Fileupload";

interface Image {
  idImage: number;
  url: string;
  altText: string | null;
  createdAt: string;
  updatedAt: string;
  idSanpham: number | null;
}

interface Product {
  idsanpham: number;
  tensanpham: string;
}

interface FormData {
  url: string;
  altText: string;
  idSanpham: number | null;
}

const ImageManagementPage = () => {
  const [formData, setFormData] = useState<FormData>({
    url: "",
    altText: "",
    idSanpham: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentImageId, setCurrentImageId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);

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
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách sản phẩm",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      url: "",
      altText: "",
      idSanpham: null,
    });
    setCurrentImageId(null);
    setIsEditing(false);
    setImageUrl("");
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "idSanpham" ? (value ? parseInt(value) : null) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!imageUrl) {
      toast({
        title: "Lỗi",
        description: "Vui lòng tải lên hình ảnh",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = isEditing
        ? `/api/category/${currentImageId}`
        : "/api/category/";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, url: imageUrl }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Lỗi khi xử lý yêu cầu");
      }

      toast({
        title: "Thành công",
        description: isEditing
          ? "Cập nhật hình ảnh thành công"
          : "Thêm hình ảnh thành công",
      });

      handleCloseModal();
      setReloadKey((prev) => prev + 1);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Lỗi khi xử lý yêu cầu",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (image: Image) => {
    setFormData({
      url: image.url,
      altText: image.altText || "",
      idSanpham: image.idSanpham,
    });
    setCurrentImageId(image.idImage);
    setIsEditing(true);
    setImageUrl(image.url);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setImageToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;

    try {
      const response = await fetch(`/api/category/${imageToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Không thể xóa hình ảnh");
      }

      toast({
        title: "Thành công",
        description: "Xóa hình ảnh thành công",
      });

      setReloadKey((prev) => prev + 1);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Lỗi khi xóa hình ảnh",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setImageToDelete(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SalesDashboard />
      <div className="flex-1 p-8 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Quản lý hình ảnh
            </h1>
            <Button onClick={handleOpenModal}>Thêm hình ảnh mới</Button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <ImageTable
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
                  {isEditing ? "Cập nhật hình ảnh" : "Thêm hình ảnh mới"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hình ảnh</label>
                  <Fileupload
                    endpoint="imageUploader"
                    onChange={(url) => {
                      setImageUrl(url || "");
                    }}
                    showmodal={!imageUrl}
                  />
                  {imageUrl && (
                    <div className="mt-2 flex flex-col items-center">
                      <Image
                        src={imageUrl}
                        alt="Uploaded"
                        width={320}
                        height={240}
                        className="max-w-xs max-h-48 object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => setImageUrl("")}
                        className="mt-2"
                      >
                        Hủy
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sản phẩm</label>
                  <select
                    name="idSanpham"
                    value={formData.idSanpham || ""}
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
                  <label className="text-sm font-medium">Mô tả Alt</label>
                  <Textarea
                    name="altText"
                    value={formData.altText}
                    onChange={handleChange}
                    placeholder="Nhập mô tả cho hình ảnh"
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
                  Bạn có chắc chắn muốn xóa hình ảnh này? Hành động này không
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
};

export default ImageManagementPage;
