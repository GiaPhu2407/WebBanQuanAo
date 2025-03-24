import React, { useState, useRef, useEffect } from "react";
import { useDrag } from "react-dnd";
import { GripVertical, Heart } from "lucide-react";
import { useColors } from "../Admin/DashBoard/ProductManager/hooks/useColor";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

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
  isFavorite?: boolean;
}

interface ProductCardProps {
  product: Product;
  userId?: number;
  onToggleFavorite?: (productId: number, isFavorite: boolean) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  userId,
  onToggleFavorite,
}) => {
  const { colors } = useColors();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);
  const [isLoading, setIsLoading] = useState(false);

  // Simplified useDrag implementation
  const [{ isDragging }, drag] = useDrag({
    type: "PRODUCT_ITEM",
    item: product,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itemRef.current) {
      drag(itemRef.current);
    }
  }, [drag]);

  useEffect(() => {
    setIsFavorite(product.isFavorite || false);
  }, [product.isFavorite]);

  const discountedPrice =
    product.giamgia > 0
      ? product.gia * (1 - product.giamgia / 100)
      : product.gia;

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      toast.error(
        "Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích"
      );
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        // Remove from favorites
        await axios.delete(`/api/yeuthich`, {
          data: { idUsers: userId, idSanpham: product.idsanpham },
        });
        toast.success("Đã xóa khỏi danh sách yêu thích");
      } else {
        // Add to favorites
        await axios.post(`/api/yeuthich`, {
          idUsers: userId,
          idSanpham: product.idsanpham,
        });
        toast.success("Đã thêm vào danh sách yêu thích");
      }

      setIsFavorite(!isFavorite);
      if (onToggleFavorite) {
        onToggleFavorite(product.idsanpham, !isFavorite);
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={itemRef}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="group relative bg-gray-50 rounded-lg overflow-hidden cursor-move"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag handle */}
      <div className="absolute top-2 left-2 cursor-grab active:cursor-grabbing p-2 rounded-full bg-white/80 hover:bg-white z-10">
        <GripVertical className="w-5 h-5 text-gray-500" />
      </div>

      {/* Favorite button */}
      <button
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`absolute top-2 right-2 p-2 rounded-full z-10 transition-colors duration-200 ${
          isFavorite
            ? "bg-red-100 text-red-500"
            : "bg-white/80 hover:bg-white text-gray-400 hover:text-red-500"
        }`}
      >
        <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500" : ""}`} />
      </button>

      <Link
        href={`/component/Category?id=${product.idsanpham}`}
        className="block"
      >
        <div className="aspect-square overflow-hidden">
          {product.hinhanh.startsWith("http") ? (
            <img
              src={product.hinhanh}
              alt={product.tensanpham}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Image
              src={product.hinhanh}
              alt={product.tensanpham}
              width={300}
              height={300}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          )}

          {product.giamgia > 0 && (
            <div className="absolute top-2 left-16 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
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

          <div className="flex card-actions flex flex-col sm:flex-row gap-2 sm:gap-4 w-full mt-4">
            <button className="btn bg-blue-500 hover:bg-blue-600 w-full sm:w-auto text-white text-sm">
              Thêm vào giỏ
            </button>
            <Link
              href={`/component/Category?id=${product.idsanpham}`}
              className="btn btn-outline w-full sm:w-auto text-sm"
            >
              Xem Chi Tiết
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
