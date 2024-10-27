// components/ProductCard.tsx
"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import hinh from "@/app/image/hinh.png"; // Đảm bảo đường dẫn đúng
import Link from "next/link";

// Types
interface Product {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: number;
  mota: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: boolean;
  size: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const sizes = product.size
    ? product.size.split(",").map((s) => s.trim())
    : [];
  const discountedPrice =
    product.giamgia > 0
      ? product.gia * (1 - product.giamgia / 100)
      : product.gia;

  return (
    <div
      className="w-full bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        <img
          src={product.hinhanh || hinh.src}
          alt={product.tensanpham}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? "scale-105" : ""
          }`}
        />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
        {product.giamgia > 0 && (
          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
            -{product.giamgia}%
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-medium text-lg line-clamp-1">
          {product.tensanpham}
        </h3>

        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs border border-gray-300 rounded-full">
            {product.gioitinh ? "Nam" : "Nữ"}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{product.mota}</p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">
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

        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <span
              key={size}
              className="px-2 py-1 text-xs border border-gray-300 rounded-full"
            >
              {size}
            </span>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <button className="px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Mua ngay
          </button>
          <Link
            href={`/component/Category?id=${product.idsanpham}`}
            className="py-1 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
