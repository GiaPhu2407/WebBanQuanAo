"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Header from "../Header";
import Footer from "../Footer";

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
  images: { idImage: number; url: string; altText: string | null }[];
}

interface Size {
  idSize: number; // Changed to number to match database
  tenSize: string;
}

const ProductDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [product, setProduct] = useState<ProductWithImages | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
  const [selectedSize, setSelectedSize] = useState<number | null>(null); // Changed to number
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    const fetchProductAndSizes = async () => {
      if (!id) return;

      try {
        const [productResponse, sizeResponse] = await Promise.all([
          fetch(`/api/category/${id}`),
          fetch(`/api/size`),
        ]);

        if (!productResponse.ok)
          throw new Error("Không thể lấy thông tin sản phẩm");
        if (!sizeResponse.ok)
          throw new Error("Không thể lấy thông tin kích thước");

        const productData = await productResponse.json();
        const sizeData = await sizeResponse.json();

        setProduct(productData);
        setSelectedImage(productData.hinhanh);
        setAvailableSizes(sizeData.size);

        // Set default size to first available size
        if (sizeData.size.length > 0) {
          setSelectedSize(sizeData.size[0].idSize);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndSizes();
  }, [id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleSizeChange = (newSize: string) => {
    setSelectedSize(parseInt(newSize));
    setQuantity(1);
  };

  const handleOrderCreation = async (isInstantBuy: boolean) => {
    if (!product || !selectedSize || quantity <= 0) {
      toast.error("Vui lòng chọn size và số lượng");
      return;
    }

    setOrderLoading(true);

    try {
      const orderResponse = await fetch("/api/giohang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idsanpham: product.idsanpham,
          soluong: quantity,
          sizeId: selectedSize,
        }),
      });

      const result = await orderResponse.json();

      if (orderResponse.ok) {
        // Tìm tên size để hiển thị trong thông báo
        const selectedSizeObj = availableSizes.find(
          (s) => s.idSize === selectedSize
        );
        const sizeName = selectedSizeObj
          ? selectedSizeObj.tenSize
          : selectedSize;

        toast.success(
          `Đã thêm ${quantity} sản phẩm ${product.tensanpham} size ${sizeName} vào giỏ hàng`
        );

        if (isInstantBuy) {
          setTimeout(() => {
            router.push("/component/shopping");
          }, 500);
        }
      } else {
        toast.error(result.error || "Có lỗi xảy ra khi đặt hàng");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra khi đặt hàng");
    } finally {
      setOrderLoading(false);
    }
  };

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
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#4CAF50",
              color: "white",
            },
          },
          error: {
            style: {
              background: "#F44336",
              color: "white",
            },
          },
        }}
      />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <div
                className={`w-20 aspect-square cursor-pointer rounded-lg overflow-hidden border-2 ${
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
                  className={`w-20 aspect-square cursor-pointer rounded-lg overflow-hidden border-2 ${
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

            {/* Main Image */}
            <div className="flex-1">
              <div className="aspect-square relative overflow-hidden rounded-xl">
                <img
                  src={selectedImage}
                  alt={product.tensanpham}
                  className="w-full h-full object-cover"
                />
              </div>
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

            {/* Size Selector */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Kích thước:</span>
                <select
                  value={selectedSize || ""}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  className="border border-gray-300 rounded-lg py-2 px-3"
                >
                  {availableSizes.map((sizeOption) => (
                    <option key={sizeOption.idSize} value={sizeOption.idSize}>
                      {sizeOption.tenSize}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-2 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value) || 1)
                    }
                    className="w-16 text-center border-x border-gray-300"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => handleOrderCreation(false)}
                disabled={orderLoading}
                className="flex-1 px-6 py-3 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50"
              >
                {orderLoading ? "Đang xử lý..." : "Thêm vào giỏ hàng"}
              </button>
              <button
                onClick={() => handleOrderCreation(true)}
                disabled={orderLoading}
                className="flex-1 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {orderLoading ? "Đang xử lý..." : "Mua ngay"}
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
