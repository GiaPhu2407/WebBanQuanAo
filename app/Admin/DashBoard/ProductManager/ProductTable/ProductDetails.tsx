import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from '@/app/Admin/type/product';

interface Size {
  idSize: number;
  tenSize: string;
}

interface ProductSize {
  idProductSize: number;
  soluong: number;
  idSize: number;
}

interface ProductDetailsDialogProps {
  product: Product | null;
  onClose: () => void;
}

const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({
  product,
  onClose,
}) => {
  const [sizes, setSizes] = useState<{ [key: number]: Size }>({});

  useEffect(() => {
    const fetchSizes = async () => {
      if (product?.ProductSizes) {
        const sizesData: { [key: number]: Size } = {};
        
        // Fetch size data for each product size
        await Promise.all(
          product.ProductSizes.map(async (productSize: ProductSize) => {
            try {
              const response = await fetch(`/api/size/${productSize.idSize}`);
              const data = await response.json();
              if (data.getSizeId) {
                sizesData[productSize.idSize] = data.getSizeId;
              }
            } catch (error) {
              console.error('Error fetching size:', error);
            }
          })
        );
        
        setSizes(sizesData);
      }
    };

    fetchSizes();
  }, [product]);

  if (!product) return null;

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Chi tiết sản phẩm</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <img
              src={product.hinhanh}
              alt={product.tensanpham}
              className="w-full h-auto rounded-lg"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Tên sản phẩm</h3>
              <p>{product.tensanpham}</p>
            </div>

            <div>
              <h3 className="font-semibold">Giá</h3>
              <p>{new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(product.gia))}</p>
            </div>

            <div>
              <h3 className="font-semibold">Loại sản phẩm</h3>
              <p>{product.loaisanpham?.tenloai}</p>
            </div>

            <div>
              <h3 className="font-semibold">Giảm giá</h3>
              <p>{product.giamgia}%</p>
            </div>

            <div>
              <h3 className="font-semibold">Màu sắc</h3>
              <p>{product.mausac}</p>
            </div>

            <div>
              <h3 className="font-semibold">Giới tính</h3>
              <p>{product.gioitinh ? 'Nam' : 'Nữ'}</p>
            </div>

            <div>
              <h3 className="font-semibold">Sizes và số lượng</h3>
              <div className="grid grid-cols-3 gap-2">
                {product.ProductSizes && product.ProductSizes.length > 0 ? (
                  product.ProductSizes.map((productSize) => (
                    <div 
                      key={productSize.idProductSize}
                      className="border p-2 rounded text-center"
                    >
                      <p className="font-medium">
                        {sizes[productSize.idSize]?.tenSize || 'Đang tải...'}
                      </p>
                      <p className="text-sm text-gray-600">
                        SL: {productSize.soluong}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-3 text-gray-500 italic">
                    Chưa có thông tin size
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Mô tả</h3>
              <p className="text-sm">{product.mota}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;