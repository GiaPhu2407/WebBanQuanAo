import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product, Size } from '@/app/Admin/type/product';
import { ProductForm } from './ProductBasic';

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
}: ProductDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
          </DialogTitle>
        </DialogHeader>
        
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
        />
      </DialogContent>
    </Dialog>
  );
}