"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  const [inventory, setInventory] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [size, setSize] = useState<string>("");
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductAndInventory = async () => {
      if (!id) return;

      try {
        // Fetch product details
        const productResponse = await fetch(`/api/category/${id}`);
        if (!productResponse.ok)
          throw new Error("Không thể lấy thông tin sản phẩm");

        const productData = await productResponse.json();
        setProduct(productData);
        setSelectedImage(productData.hinhanh);
        setAvailableSizes(
          productData.size.split(",").map((s: string) => s.trim())
        );
        setSize(productData.size.split(",")[0].trim());

        // Fetch inventory for this specific product
        const inventoryResponse = await fetch(
          `/api/kho?idsanpham=${id}&size=${size}`
        );
        if (!inventoryResponse.ok)
          throw new Error("Không thể lấy thông tin tồn kho");

        const inventoryData = await inventoryResponse.json();
        if (inventoryData.kho && inventoryData.kho.length > 0) {
          setInventory(inventoryData.kho[0].soluong);
        } else {
          setInventory(0);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndInventory();
  }, [id, size]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= inventory) {
      setQuantity(newQuantity);
      setInventory(inventory - newQuantity + quantity);
    }
  };

  const handleSizeChange = (newSize: string) => {
    setSize(newSize);
    // Fetch inventory for the new size
    fetchInventoryForSize(newSize);
  };

  const fetchInventoryForSize = async (newSize: string) => {
    try {
      const inventoryResponse = await fetch(
        `/api/kho?idsanpham=${product?.idsanpham}&size=${newSize}`
      );
      if (!inventoryResponse.ok)
        throw new Error("Không thể lấy thông tin tồn kho");

      const inventoryData = await inventoryResponse.json();
      if (inventoryData.kho && inventoryData.kho.length > 0) {
        setInventory(inventoryData.kho[0].soluong);
      } else {
        setInventory(0);
      }
    } catch (err) {
      console.error("Lỗi khi lấy tồn kho theo size:", err);
      setInventory(0);
    }
  };

  const handleAddToCart = async () => {
    if (!product || quantity > inventory) return;

    try {
      // Update inventory on the server
      const updateResponse = await fetch("/api/kho", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idsanpham: product.idsanpham,
          size: size,
          soluong: inventory - quantity,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Không thể cập nhật số lượng");
      }

      // Reset quantity to 1
      setQuantity(1);

      // Add to cart logic would go here
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng");
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
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Số lượng còn lại:
                <span
                  className={`ml-2 font-semibold ${
                    inventory === 0 ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {inventory}
                </span>
              </div>
              {/* Size Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Kích thước:</span>
                <div className="flex items-center space-x-2">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      className={`px-3 py-1 text-sm border rounded-full transition-colors ${
                        size === s
                          ? "bg-blue-600 text-white"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handleSizeChange(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {/* Thêm phần hiển thị size đã chọn */}
                <span className="text-sm font-medium ml-4">
                  Size: <span className="font-bold">{size}</span>
                </span>
              </div>  

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Số lượng:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="px-3 py-1 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= inventory}
                    className="px-3 py-1 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                disabled={inventory === 0}
                className={`flex-1 px-6 py-3 text-white rounded-lg transition-colors ${
                  inventory === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={handleAddToCart}
              >
                {inventory === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
              </button>
              <button
                disabled={inventory === 0}
                className={`flex-1 px-6 py-3 rounded-lg transition-colors ${
                  inventory === 0
                    ? "border border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {inventory === 0 ? "Hết hàng" : "Mua ngay"}
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
