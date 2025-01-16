import React, { useState } from "react";
import Link from "next/link";

interface Product {
  idsanpham: number;
  tensanpham: string;
  gia: number;
  giamgia: number;
  hinhanh: string;
  mausac: string;
}

// Hàm chuyển đổi tên màu sang mã màu CSS
const getColorCode = (colorName: string): string => {
  // Map các tên màu tiếng Việt sang mã màu CSS
  const colorMap: { [key: string]: string } = {
    đỏ: "#FF0000",
    xanh: "#0000FF",
    vàng: "#FFFF00",
    đen: "#000000",
    trắng: "#FFFFFF",
    xám: "#808080",
    nâu: "#A52A2A",
    hồng: "#FFC0CB",
    tím: "#800080",
    cam: "#FFA500",
    "xanh lá": "#008000",
    "xanh dương": "#0000FF",
    "xanh nước biển": "#000080",
    // Thêm các màu khác tùy theo nhu cầu
  };

  const normalizedColor = colorName.toLowerCase().trim();
  return colorMap[normalizedColor] || colorName; // Trả về mã màu hoặc tên màu gốc nếu không tìm thấy
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const discountedPrice =
    product.giamgia > 0
      ? product.gia * (1 - product.giamgia / 100)
      : product.gia;

  // Xử lý chuỗi màu sắc
  const colors = product.mausac
    ? product.mausac
        .split(",")
        .map((color) => color.trim())
        .filter((color) => color) // Lọc bỏ chuỗi rỗng
    : [];

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

          <div className="flex gap-2">
            {colors.map((color, index) => {
              const colorCode = getColorCode(color);
              return (
                <div
                  key={index}
                  className="w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-transform border border-gray-200"
                  style={{ backgroundColor: colorCode }}
                  title={color}
                />
              );
            })}
          </div>
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
