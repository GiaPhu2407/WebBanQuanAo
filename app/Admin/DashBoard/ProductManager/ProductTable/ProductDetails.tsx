// import React, { useEffect, useState } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Product } from '@/app/Admin/type/product';

// interface Size {
//   idSize: number;
//   tenSize: string;
// }

// interface ProductSize {
//   idProductSize: number;
//   soluong: number;
//   idSize: number;
// }

// interface ProductDetailsDialogProps {
//   product: Product | null;
//   onClose: () => void;
// }

// const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({
//   product,
//   onClose,
// }) => {
//   const [sizes, setSizes] = useState<{ [key: number]: Size }>({});

//   useEffect(() => {
//     const fetchSizes = async () => {
//       if (product?.ProductSizes) {
//         const sizesData: { [key: number]: Size } = {};

//         // Fetch size data for each product size
//         await Promise.all(
//           product.ProductSizes.map(async (productSize: ProductSize) => {
//             try {
//               const response = await fetch(`/api/size/${productSize.idSize}`);
//               const data = await response.json();
//               if (data.getSizeId) {
//                 sizesData[productSize.idSize] = data.getSizeId;
//               }
//             } catch (error) {
//               console.error('Error fetching size:', error);
//             }
//           })
//         );

//         setSizes(sizesData);
//       }
//     };

//     fetchSizes();
//   }, [product]);

//   if (!product) return null;

//   return (
//     <Dialog open={!!product} onOpenChange={onClose}>
//       <DialogContent className="max-w-3xl">
//         <DialogHeader>
//           <DialogTitle>Chi tiết sản phẩm</DialogTitle>
//         </DialogHeader>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <img
//               src={product.hinhanh}
//               alt={product.tensanpham}
//               className="w-full h-auto rounded-lg"
//             />
//           </div>

//           <div className="space-y-4">
//             <div>
//               <h3 className="font-semibold">Tên sản phẩm</h3>
//               <p>{product.tensanpham}</p>
//             </div>

//             <div>
//               <h3 className="font-semibold">Giá</h3>
//               <p>{new Intl.NumberFormat("vi-VN", {
//                 style: "currency",
//                 currency: "VND",
//               }).format(Number(product.gia))}</p>
//             </div>

//             <div>
//               <h3 className="font-semibold">Loại sản phẩm</h3>
//               <p>{product.loaisanpham?.tenloai}</p>
//             </div>

//             <div>
//               <h3 className="font-semibold">Giảm giá</h3>
//               <p>{product.giamgia}%</p>
//             </div>

//             <div>
//               <h3 className="font-semibold">Màu sắc</h3>
//               <p>{product.mausac}</p>
//             </div>

//             <div>
//               <h3 className="font-semibold">Giới tính</h3>
//               <p>{product.gioitinh ? 'Nam' : 'Nữ'}</p>
//             </div>

//             <div>
//               <h3 className="font-semibold">Sizes và số lượng</h3>
//               <div className="grid grid-cols-3 gap-2">
//                 {product.ProductSizes && product.ProductSizes.length > 0 ? (
//                   product.ProductSizes.map((productSize) => (
//                     <div
//                       key={productSize.idProductSize}
//                       className="border p-2 rounded text-center"
//                     >
//                       <p className="font-medium">
//                         {sizes[productSize.idSize]?.tenSize || 'Đang tải...'}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         SL: {productSize.soluong}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="col-span-3 text-gray-500 italic">
//                     Chưa có thông tin size
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div>
//               <h3 className="font-semibold">Mô tả</h3>
//               <p className="text-sm">{product.mota}</p>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ProductDetailsDialog;

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
      // Set the first color as selected by default
      if (product.ProductColors && product.ProductColors.length > 0) {
        setSelectedColorId(product.ProductColors[0].idmausac);
      }
    }
  }, [product]);

  if (!product) return null;

  const selectedColor = product.ProductColors?.find(
    (pc) => pc.idmausac === selectedColorId
  );
  const displayImage = selectedColor ? selectedColor.hinhanh : product.hinhanh;

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
                    return (
                      <button
                        key={productColor.idmausac}
                        onClick={() =>
                          setSelectedColorId(productColor.idmausac)
                        }
                        className={`group relative w-12 h-12 rounded-full border-2 transition-all ${
                          selectedColorId === productColor.idmausac
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <span
                          className="absolute inset-1 rounded-full"
                          style={{ backgroundColor: color?.mamau }}
                        />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-sm bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {color?.tenmau}
                        </span>
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
              <div className="mt-4 flex items-baseline gap-4">
                <p className="text-3xl font-bold text-gray-900">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(Number(product.gia))}
                </p>
                {product.giamgia > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    -{product.giamgia}%
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
