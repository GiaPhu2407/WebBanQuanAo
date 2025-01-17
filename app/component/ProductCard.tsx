import React from "react";
import Link from "next/link";
import { useColors } from "../Admin/DashBoard/ProductManager/hooks/useColor";

interface Product {
  idsanpham: number;
  tensanpham: string;
  gia: number;
  giamgia: number;
  hinhanh: string;
  ProductColors?: {
    idmausac: number;
    hinhanh: string;
  }[];
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { colors } = useColors();
  const discountedPrice =
    product.giamgia > 0
      ? product.gia * (1 - product.giamgia / 100)
      : product.gia;

  return (
    <Link href={`/component/Category?id=${product.idsanpham}`}>
      <div className="group relative bg-gray-50 rounded-lg overflow-hidden">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.hinhanh}
            alt={product.tensanpham}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          {product.giamgia > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
              -{product.giamgia}%
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            {product.tensanpham}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-gray-900">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(discountedPrice)}
            </span>
            {product.giamgia > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.gia)}
              </span>
            )}
          </div>

          {product.ProductColors && product.ProductColors.length > 0 && (
            <div className="flex gap-2">
              {product.ProductColors.map((productColor) => {
                const color = colors.find(
                  (c) => c.idmausac === productColor.idmausac
                );
                if (!color) return null;

                return (
                  <div
                    key={productColor.idmausac}
                    className="group/color relative w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-transform border border-gray-200"
                    style={{ backgroundColor: color.mamau }}
                  >
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap">
                      {color.tenmau}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

const ProductGrid: React.FC<{ products: Product[] }> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {products.map((product) => (
        <ProductCard key={product.idsanpham} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
// import React, { useState } from "react";
// import { Heart } from "lucide-react";
// import Link from "next/link";

// interface Product {
//   idsanpham: number;
//   tensanpham: string;
//   hinhanh: string;
//   gia: number;
//   mota: string;
//   idloaisanpham: number;
//   mausac: string; // Chuỗi các màu phân cách bằng dấu phẩy
//   giamgia: number;
//   gioitinh: boolean;
//   size: string;
// }

// interface ProductCardProps {
//   product: Product;
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);

//   const discountedPrice =
//     product.giamgia > 0
//       ? product.gia * (1 - product.giamgia / 100)
//       : product.gia;

//   // Chuyển đổi chuỗi màu sắc thành mảng
//   const colors = product.mausac.split(",").map((color) => color.trim());

//   const handleFavoriteClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsFavorite(!isFavorite);
//   };

//   return (
//     <Link href={`/component/Category?id=${product.idsanpham}`}>
//       <div className="group relative bg-gray-50 rounded-lg overflow-hidden">
//         {/* Image Container */}
//         <div className="aspect-square overflow-hidden">
//           <img
//             src={product.hinhanh}
//             alt={product.tensanpham}
//             className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
//           />
//           {product.giamgia > 0 && (
//             <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
//               -{product.giamgia}%
//             </div>
//           )}
//         </div>

//         {/* Product Info */}
//         <div className="p-4">
//           {/* Product Name */}
//           <h3 className="text-sm font-medium text-gray-900 mb-2">
//             {product.tensanpham}
//           </h3>

//           {/* Price Section */}
//           <div className="flex items-center gap-2 mb-3">
//             <span className="text-sm font-semibold text-gray-900">
//               {new Intl.NumberFormat("vi-VN", {
//                 style: "currency",
//                 currency: "VND",
//               }).format(discountedPrice)}
//             </span>
//             {product.giamgia > 0 && (
//               <span className="text-sm text-gray-500 line-through">
//                 {new Intl.NumberFormat("vi-VN", {
//                   style: "currency",
//                   currency: "VND",
//                 }).format(product.gia)}
//               </span>
//             )}
//           </div>

//           {/* Color Circles */}
//           <div className="flex gap-2">
//             {colors.map((color, index) => (
//               <div
//                 key={index}
//                 className="w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-transform border border-gray-200"
//                 style={{ backgroundColor: color }}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default ProductCard;
