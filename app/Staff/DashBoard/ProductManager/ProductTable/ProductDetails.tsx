import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product, Color, Size } from "@/app/Admin/type/product";
import { useColors } from "../hooks/useColor";

interface ProductDetailsDialogProps {
  product: Product | null;
  onClose: () => void;
}

const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({
  product,
  onClose,
}) => {
  const { colors } = useColors();
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [sizes, setSizes] = useState<{ [key: number]: Size }>({});

  useEffect(() => {
    const fetchSizes = async () => {
      if (product?.ProductSizes) {
        const sizesData: { [key: number]: Size } = {};
        await Promise.all(
          product.ProductSizes.map(async (productSize) => {
            try {
              const response = await fetch(`/api/size/${productSize.idSize}`);
              const data = await response.json();
              if (data.getSizeId) {
                sizesData[productSize.idSize] = data.getSizeId;
              }
            } catch (error) {
              console.error("Error fetching size:", error);
            }
          })
        );
        setSizes(sizesData);
      }
    };

    if (product) {
      fetchSizes();
      if (product.ProductColors && product.ProductColors.length > 0) {
        setSelectedColorId(product.ProductColors[0].idmausac);
      }
    }
  }, [product]);

  if (!product) return null;

  const selectedColor = product.ProductColors?.find(
    (pc) => pc.idmausac === selectedColorId
  );
  const displayImage = selectedColor?.hinhanh || product.hinhanh;

  const discountedPrice = product.giamgia
    ? Number(product.gia) * (1 - Number(product.giamgia) / 100)
    : Number(product.gia);

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Chi tiết sản phẩm
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-8">
          {/* Left column - Image and color selection */}
          <div className="space-y-6">
            <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
              <img
                src={displayImage}
                alt={product.tensanpham}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Color selection */}
            {product.ProductColors && product.ProductColors.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-gray-700">
                  Màu sắc có sẵn:
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.ProductColors.map((productColor) => {
                    const color = colors.find(
                      (c) => c.idmausac === productColor.idmausac
                    );
                    if (!color) return null;

                    return (
                      <button
                        key={productColor.idmausac}
                        onClick={() =>
                          setSelectedColorId(productColor.idmausac)
                        }
                        className={`group relative w-20 h-20 rounded-lg overflow-hidden ${
                          selectedColorId === productColor.idmausac
                            ? "ring-2 ring-primary"
                            : "ring-1 ring-gray-200"
                        }`}
                      >
                        {productColor.hinhanh ? (
                          <img
                            src={productColor.hinhanh}
                            alt={color.tenmau}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full"
                            style={{ backgroundColor: color.mamau }}
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-sm font-medium">
                            {color.tenmau}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right column - Product details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {product.tensanpham}
              </h2>
              <div className="mt-4 space-y-2">
                <div className="flex items-baseline gap-4">
                  <p className="text-3xl font-bold text-gray-900">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(discountedPrice)}
                  </p>
                  {product.giamgia > 0 && (
                    <p className="text-xl text-gray-500 line-through">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(Number(product.gia))}
                    </p>
                  )}
                </div>
                {product.giamgia > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Giảm {product.giamgia}%
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Loại sản phẩm
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {product.loaisanpham?.tenloai}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900">Giới tính</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {product.gioitinh ? "Nam" : "Nữ"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Sizes có sẵn
                </h3>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {product.ProductSizes && product.ProductSizes.length > 0 ? (
                    product.ProductSizes.map((productSize) => (
                      <div
                        key={productSize.idProductSize}
                        className="flex flex-col items-center p-2 border rounded-lg bg-gray-50"
                      >
                        <span className="font-medium">
                          {sizes[productSize.idSize]?.tenSize || "..."}
                        </span>
                        <span className="text-sm text-gray-500">
                          SL: {productSize.soluong}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-3 text-sm text-gray-500 italic">
                      Chưa có thông tin size
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Mô tả sản phẩm
                </h3>
                <p className="mt-1 text-sm text-gray-500 whitespace-pre-line">
                  {product.mota}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
