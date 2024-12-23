import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from '@/app/Admin/type/product';

interface ProductDetailsDialogProps {
  product: Product | null;
  onClose: () => void;
}

const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({
  product,
  onClose,
}) => {
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
                {product.ProductSizes?.map((productSize) => (
                  <div key={productSize.idProductSize} className="border p-2 rounded">
                    <p className="font-medium">{productSize.size?.tenSize}</p>
                    <p>SL: {productSize.soluong}</p>
                  </div>
                ))}
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