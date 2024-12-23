import React, { useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product, Size } from '@/app/Admin/type/product';
import { ProductSizes } from './ProductFormGender';
import { FileUpload } from '../ui/fileupload';

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
}: ProductFormProps) {
  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        tensanpham: product.tensanpham || '',
        gia: product.gia || '',
        idloaisanpham: product.idloaisanpham || '',
        giamgia: product.giamgia || '',
        mausac: product.mausac || '',
        gioitinh: product.gioitinh?.toString() || '',
        mota: product.mota || '',
        productSizes: product.sizes?.reduce((acc: any, curr: any) => {
          acc[curr.idSize] = curr.soluong;
          return acc;
        }, {}) || {},
      });
      setImageUrl(product.hinhanh || '');
    }
  }, [product, setFormData, setImageUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]:
        name === "idloaisanpham" ? parseInt(value) :
        name === "gioitinh" ? value === "true" : 
        name === "giamgia" ? parseFloat(value) :
        name === "gia" ? parseFloat(value) :
        value,
    }));
  };

  return (
    <form 
      onSubmit={(e) => { 
        e.preventDefault(); 
        onSubmit(formData); 
      }} 
      className="space-y-6 bg-white p-6 rounded-lg shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cột 1 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình ảnh sản phẩm
            </label>
            <FileUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url || '')}
              onRemove={() => setImageUrl('')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm
            </label>
            <Input
              name="tensanpham"
              value={formData.tensanpham || ''}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá
            </label>
            <Input
              type="number"
              name="gia"
              value={formData.gia || ''}
              onChange={handleChange}
              required
              min="0"
              className="w-full"
            />
          </div>
        </div>

        {/* Cột 2 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại sản phẩm
            </label>
            <select
              name="idloaisanpham"
              value={formData.idloaisanpham || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Chọn loại sản phẩm</option>
              {categories.map((category) => (
                <option key={category.idloaisanpham} value={category.idloaisanpham}>
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
              value={formData.giamgia || ''}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Màu sắc
            </label>
            <Input
              name="mausac"
              value={formData.mausac || ''}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giới tính
            </label>
            <select
              name="gioitinh"
              value={formData.gioitinh?.toString() || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="true">Nam</option>
              <option value="false">Nữ</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả
        </label>
        <textarea
          name="mota"
          value={formData.mota || ''}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sizes và số lượng
        </label>
        <ProductSizes
          sizes={sizes}
          selectedSizes={formData.productSizes || {}}
          onSizeChange={(sizeId, quantity) => {
            setFormData((prev: any) => ({
              ...prev,
              productSizes: {
                ...prev.productSizes,
                [sizeId]: quantity,
              },
            }));
          }}
          onSizeRemove={(sizeId) => {
            setFormData((prev: any) => {
              const newSizes = { ...prev.productSizes };
              delete newSizes[sizeId];
              return { ...prev, productSizes: newSizes };
            });
          }}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="px-4 py-2"
        >
          Hủy
        </Button>
        <Button 
          type="submit"
          className="px-4 py-2"
        >
          {product ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </div>
    </form>
  );
}