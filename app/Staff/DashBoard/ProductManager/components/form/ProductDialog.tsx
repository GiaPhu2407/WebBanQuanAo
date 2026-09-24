"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product, Size } from "@/app/Admin/type/product";
import { ProductForm } from "./ProductBasic";
import { ProductAIContent } from "./ProductAIContent";

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  sizes: Size[];
  categories: Array<{ idloaisanpham: number; tenloai: string }>;
  onSubmit: (data: any) => void;
  formData: any;
  setFormData: (data: any) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  isSubmitting?: boolean;
  releaseDate: Date | null;
  onReleaseDateChange: (date: Date | null) => void;
}

export function ProductDialog({
  isOpen,
  onClose,
  product,
  sizes,
  categories,
  onSubmit,
  formData,
  setFormData,
  imageUrl,
  setImageUrl,
  isSubmitting = false,
  releaseDate,
  onReleaseDateChange,
}: ProductDialogProps) {
  // Tìm tên loại sản phẩm từ categories
  const tenloai = categories.find(
    (c) => c.idloaisanpham === Number(formData.idloaisanpham),
  )?.tenloai;

  const handleAIContentChange = (aiContent: any) => {
    setFormData((prev: any) => ({ ...prev, ...aiContent }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="info" className="flex items-center gap-2">
              📦 Thông tin sản phẩm
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              ✨ Nội dung AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <ProductForm
              product={product}
              sizes={sizes}
              categories={categories}
              onSubmit={onSubmit}
              onCancel={onClose}
              formData={formData}
              setFormData={setFormData}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              isSubmitting={isSubmitting}
              releaseDate={releaseDate}
              onReleaseDateChange={onReleaseDateChange}
            />
          </TabsContent>

          <TabsContent value="ai">
            <div className="space-y-4">
              <ProductAIContent
                tensanpham={formData.tensanpham || ""}
                mota={formData.mota || ""}
                gia={formData.gia || ""}
                tenloai={tenloai}
                aiContent={{
                  tenSanPhamHapDan: formData.tenSanPhamHapDan,
                  seoTitle: formData.seoTitle,
                  seoKeywords: formData.seoKeywords,
                  captionTiktok: formData.captionTiktok,
                  captionFacebook: formData.captionFacebook,
                  noiDungShopee: formData.noiDungShopee,
                  hashtag: formData.hashtag,
                  traLoiKhachHang: formData.traLoiKhachHang,
                }}
                onAIContentChange={handleAIContentChange}
              />

              {/* Info box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700 mt-4">
                💡 <strong>Lưu ý:</strong> Nội dung AI sẽ được lưu vào database
                cùng sản phẩm khi bạn nhấn{" "}
                <strong>"{product ? "Cập nhật" : "Thêm mới"}"</strong> ở tab
                Thông tin sản phẩm.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
