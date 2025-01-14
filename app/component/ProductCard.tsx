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
//   mausac: string; // Giá trị là mã màu (hex, rgb, hoặc tên màu)
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

//   const sizes = product.size
//     ? product.size.split(",").map((s) => s.trim())
//     : [];

//   const handleFavoriteClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsFavorite(!isFavorite);
//   };

//   return (
//     <Link href={`/component/Category?id=${product.idsanpham}`}>
//       <div
//         className="w-full bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         <div className="relative aspect-square overflow-hidden rounded-t-xl">
//           <img
//             src={product.hinhanh}
//             alt={product.tensanpham}
//             className={`w-full h-full object-cover transition-transform duration-300 ${
//               isHovered ? "scale-105" : ""
//             }`}
//           />
//           <button
//             onClick={handleFavoriteClick}
//             className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
//           >
//             <Heart
//               className={`w-5 h-5 transition-colors ${
//                 isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
//               }`}
//             />
//           </button>
//           {product.giamgia > 0 && (
//             <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
//               -{product.giamgia}%
//             </span>
//           )}
//         </div>

//         <div className="p-4 space-y-3">
//           <div className="flex items-center space-x-2">
//             <span className="px-2 py-1 text-xs border border-gray-300 rounded-full">
//               {product.gioitinh ? "Nam" : "Nữ"}
//             </span>
//           </div>

//           <h3 className="font-semibold truncate">{product.tensanpham}</h3>

//           {/* Hiển thị màu sắc dưới dạng hình tròn */}
//           <div className="w-6 h-6 rounded-full ">{product.mausac}</div>

//           <div className="flex items-center justify-between">
//             <span className="text-lg font-bold text-blue-600">
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

//           <div className="flex flex-wrap gap-2">
//             {sizes.map((size, index) => (
//               <span
//                 key={`${size}-${index}`}
//                 className="px-2 py-1 text-xs border border-gray-300 rounded-full"
//               >
//                 {size}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default ProductCard;

import React, { useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

interface Product {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: number;
  mota: string;
  idloaisanpham: number;
  mausac: string; // Chuỗi các màu phân cách bằng dấu phẩy
  giamgia: number;
  gioitinh: boolean;
  size: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const discountedPrice =
    product.giamgia > 0
      ? product.gia * (1 - product.giamgia / 100)
      : product.gia;

  // Chuyển đổi chuỗi màu sắc thành mảng
  const colors = product.mausac.split(",").map((color) => color.trim());

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link href={`/component/Category?id=${product.idsanpham}`}>
      <div className="group relative bg-gray-50 rounded-lg overflow-hidden">
        {/* Image Container */}
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

        {/* Product Info */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            {product.tensanpham}
          </h3>

          {/* Price Section */}
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

          {/* Color Circles */}
          <div className="flex gap-2">
            {colors.map((color, index) => (
              <div
                key={index}
                className="w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-transform border border-gray-200"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
