import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product, Size } from "@/app/Admin/type/product";
import { FileUpload } from "@/components/ui/file-upload";
import { ProductColorSelector } from "./ProductColor";
import { ProductSchedule } from "./ProductSchedule";
import { Textarea } from "@/components/ui/textarea";

interface ProductFormProps {
  product?: Product;
  sizes: Size[];
  categories: Array<{ idloaisanpham: number; tenloai: string }>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  formData: any;
  setFormData: (data: any) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  isSubmitting?: boolean;
  releaseDate: Date | null;
  onReleaseDateChange: (date: Date | null) => void;
}

export function ProductForm({
  product,
  sizes,
  categories,
  onSubmit,
  onCancel,
  formData,
  setFormData,
  imageUrl,
  setImageUrl,
  isSubmitting = false,
  releaseDate,
  onReleaseDateChange,
}: ProductFormProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Initialize form data with product data when editing
  useEffect(() => {
    if (product) {
      setFormData({
        ...formData,
        tensanpham: product.tensanpham,
        gia: product.gia,
        mota: product.mota,
        idloaisanpham: product.idloaisanpham,
        giamgia: product.giamgia,
        gioitinh: product.gioitinh,
        hinhanh: product.hinhanh,
        productSizes: product.ProductSizes?.reduce((acc: any, size: any) => {
          acc[size.idSize] = size.soluong;
          return acc;
        }, {}),
      });

      // Convert UTC date to local date for editing
      if (product.releaseDate) {
        const date = new Date(product.releaseDate);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        onReleaseDateChange(date);
      }
    }
  }, [product]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]:
        name === "idloaisanpham"
          ? parseInt(value)
          : name === "gioitinh"
          ? value === "true"
          : name === "giamgia"
          ? parseFloat(value)
          : name === "gia"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSizeChange = (sizeId: number, quantity: number) => {
    setFormData((prev: any) => ({
      ...prev,
      productSizes: {
        ...prev.productSizes,
        [sizeId]: quantity,
      },
    }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình ảnh chính
            </label>
            {isMounted && (
              <FileUpload
                value={imageUrl}
                onChange={(url) => setImageUrl(url || "")}
                onRemove={() => setImageUrl("")}
              />
            )}
            {!isMounted && (
              <div className="h-20 bg-gray-50 rounded-md border" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm
            </label>
            <Input
              name="tensanpham"
              value={formData.tensanpham || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá
            </label>
            <Input
              type="number"
              name="gia"
              value={formData.gia || ""}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại sản phẩm
            </label>
            <select
              name="idloaisanpham"
              value={formData.idloaisanpham || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Chọn loại sản phẩm</option>
              {categories.map((category) => (
                <option
                  key={category.idloaisanpham}
                  value={category.idloaisanpham}
                >
                  {category.tenloai}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giảm giá (%)
            </label>
            <Input
              type="number"
              name="giamgia"
              value={formData.giamgia || ""}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giới tính
            </label>
            <select
              name="gioitinh"
              value={formData.gioitinh?.toString() || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="true">Nam</option>
              <option value="false">Nữ</option>
            </select>
          </div>

          {isMounted && (
            <ProductSchedule
              releaseDate={releaseDate}
              onDateChange={onReleaseDateChange}
              isEditing={!!product}
            />
          )}
          {!isMounted && <div className="h-10 bg-gray-50 rounded-md border" />}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <Textarea
              name="mota"
              value={formData.mota || ""}
              onChange={handleChange}
              rows={10}
              className="w-full h-64 resize-none"
              placeholder="Nhập mô tả sản phẩm"
            />
          </div>

          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sizes và số lượng
            </label>
            <div className="grid grid-cols-2 gap-4">
              {sizes.map((size) => (
                <div key={size.idSize} className="flex items-center gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        formData.productSizes?.[size.idSize] !== undefined
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleSizeChange(size.idSize, 0);
                        } else {
                          const newSizes = { ...formData.productSizes };
                          delete newSizes[size.idSize];
                          setFormData((prev: any) => ({
                            ...prev,
                            productSizes: newSizes,
                          }));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span>{size.tenSize}</span>
                  </label>
                  {formData.productSizes?.[size.idSize] !== undefined && (
                    <Input
                      type="number"
                      value={formData.productSizes[size.idSize]}
                      onChange={(e) =>
                        handleSizeChange(
                          size.idSize,
                          parseInt(e.target.value) || 0
                        )
                      }
                      min="0"
                      className="w-24"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang xử lý..." : product ? "Cập nhật" : "Thêm mới"}
        </Button>
      </div>
    </form>
  );
}
