// components/ProductDetail.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Header from "../Header";
import Footer from "../Footer";

interface Image {
  idImage: number;
  url: string;
  altText: string | null;
}

interface ProductWithImages {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: number;
  mota: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: boolean;
  size: string;
  images: Image[];
}

const ProductDetail = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [product, setProduct] = useState<ProductWithImages | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/category/${id}`);
        if (!response.ok) throw new Error("Không thể lấy thông tin sản phẩm");

        const data = await response.json();
        setProduct(data);
        setSelectedImage(data.hinhanh); // Set main product image as default
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-4">Đang tải...</div>;
  if (error) return <div className="p-4 text-red-500">Lỗi: {error}</div>;
  if (!product) return <div className="p-4">Không tìm thấy sản phẩm</div>;

  const discountedPrice =
    product.giamgia > 0
      ? product.gia * (1 - product.giamgia / 100)
      : product.gia;

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-xl">
              <img
                src={selectedImage}
                alt={product.tensanpham}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              <div
                className={`aspect-square cursor-pointer rounded-lg overflow-hidden border-2 ${
                  selectedImage === product.hinhanh
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImage(product.hinhanh)}
              >
                <img
                  src={product.hinhanh}
                  alt="Main"
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.map((image) => (
                <div
                  key={image.idImage}
                  className={`aspect-square cursor-pointer rounded-lg overflow-hidden border-2 ${
                    selectedImage === image.url
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(image.url)}
                >
                  <img
                    src={image.url}
                    alt={image.altText || "Product image"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{product.tensanpham}</h1>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(discountedPrice)}
                </span>
                {product.giamgia > 0 && (
                  <span className="text-lg text-gray-500 line-through">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.gia)}
                  </span>
                )}
              </div>
              {product.giamgia > 0 && (
                <span className="inline-block px-2 py-1 text-sm font-semibold text-white bg-red-500 rounded-full">
                  Giảm {product.giamgia}%
                </span>
              )}
            </div>

            <div className="prose prose-sm">
              <p>{product.mota}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-sm border border-gray-300 rounded-full">
                {product.gioitinh ? "Nam" : "Nữ"}
              </span>
            </div>

            {/* Sizes */}
            {product.size && (
              <div className="space-y-2">
                <h3 className="font-semibold">Kích thước có sẵn:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.size.split(",").map((size) => (
                    <span
                      key={size}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-full"
                    >
                      {size.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Thêm vào giỏ hàng
              </button>
              <button className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
