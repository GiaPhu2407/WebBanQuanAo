"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import hinh from "@/app/image/hinh.png";
import Image from "next/image";

interface Product {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: number;
  mota: string;
  idloaisanpham: number;
  giamgia: number;
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

  // Mảng các URL hình ảnh, tương ứng với các sản phẩm có idsanpham từ 1 đến n
  const imageUrls = [
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-2.jpg", // idsanpham 1
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-hog-qjn6034-xnh-3.jpg", // idsanpham 2
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-hog-qjn6034-xnh-3.jpg", // idsanpham 3
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-hog-qjn6034-xnh-3.jpg", // idsanpham 4
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-2.jpg", // idsanpham 5
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-hog-qjn6034-xnh-3.jpg", // idsanpham 6
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-hog-qjn6034-xnh-3.jpg", // idsanpham 7
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-hog-qjn6034-xnh-3.jpg", // idsanpham 8

    // Thêm các URL hình ảnh khác theo idsanpham
  ];

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
    <div className="flex flex-wrap gap-6 min-h-screen p-8 bg-gray-50 mt-10">
      {products && products.length > 0 ? (
        products.map((product) => (
          <div
            key={product.idsanpham}
            className="card bg-base-100 w-72 h-[600px] shadow-xl relative transition-all duration-300"
            onMouseEnter={() => setHoveredId(product.idsanpham)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              className={`absolute bg-gradient-to-bl from-blue-600 to-blue-400 w-[303px] h-[303px] z-[-1] -top-2 -left-2 rounded-2xl transition-opacity duration-300 ${
                hoveredId === product.idsanpham ? "opacity-100" : "opacity-0"
              }`}
            ></div>
            <div className="w-full h-full flex flex-col z-10">
              <div>
                <figure className="px-4 pt-4">
                  {/* Dùng hình ảnh từ mảng imageUrls theo idsanpham, nếu không có thì dùng hình mặc định */}
                  <img
                    src={product.hinhanh || hinh.src}
                    alt={product.tensanpham}
                    className="rounded-xl w-full h-full object-cover"
                  />
                </figure>
              </div>
              <div className="card-body flex flex-col justify-between">
                <div className="text-center">
                  <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                    {product.tensanpham}
                  </h2>
                  <p className="text-sm mb-4 line-clamp-2">{product.mota}</p>
                  <p className="text-lg font-bold text-blue-600 mb-4">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.gia)}
                  </p>
                </div>
                <div className="flex justify-center gap-2">
                  <button className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700">
                    Đặt Cọc
                  </button>
                  <Link
                    href={`/component/Category?id=${product.idsanpham}`}
                    className="btn btn-sm btn-outline hover:bg-gray-100"
                  >
                    Xem Chi Tiết
                  </Link>
                </div>
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
