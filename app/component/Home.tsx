"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import hinh from "@/app/image/hinh.png";
import { Heart } from "lucide-react";

interface Product {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: number;
  mota: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: Boolean;
  loaisanpham: {
    tenloai: string;
    mota: string;
  };
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sanpham")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Có lỗi khi tải dữ liệu sản phẩm:", e);
        setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="light"
      >
        <div className="loading loading-spinner text-blue-600 loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="light"
      >
        <div className="text-2xl font-bold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6 p-8 bg-gray-50">
      {products && products.length > 0 ? (
        products.map((product) => (
          <div
            key={product.idsanpham}
            className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
            onMouseEnter={() => setHoveredId(product.idsanpham)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-t-xl">
              <img
                src={product.hinhanh || hinh.src}
                alt={product.tensanpham}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                <button className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
                  <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                </button>
              </div>
              {product.giamgia > 0 && (
                <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                  -{product.giamgia}%
                </span>
              )}
            </div>

            {/* Content Container */}
            <div className="p-4 space-y-4">
              {/* Product Info */}
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h2 className="font-semibold text-lg line-clamp-1">
                    {product.tensanpham}
                  </h2>
                  <span className="px-2 py-1 text-xs border border-gray-300 rounded-full">
                    {product.gioitinh ? "Nam" : "Nữ"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.mota}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-blue-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.gia)}
                  </p>
                  {product.giamgia > 0 && (
                    <p className="text-sm text-gray-500 line-through">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.gia * (1 + product.giamgia / 100))}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Mua
                </button>
                <Link
                  href={`/component/Category?id=${product.idsanpham}`}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  Xem Chi Tiết
                </Link>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="w-full text-center text-gray-500">
          Không có sản phẩm nào để hiển thị
        </div>
      )}
    </div>
  );
};

export default Home;
