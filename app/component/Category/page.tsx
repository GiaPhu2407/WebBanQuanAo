"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Barcode from "react-barcode";
import Header from "../Header";
import Footer from "../Footer";
import ProductReviews from "../Review/Productreviews";
import BarcodeScanner from "../BarcodeScanner";

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
  idSize: number;
  tenSize: string;
  soluong: number;
}

interface CartItem {
  productId: number;
  quantity: number;
  sizeId: number;
}

interface Review {
  iddanhgia: number;
  idsanpham: number;
  idUsers: number;
  sao: number;
  noidung: string;
  ngaydanhgia: string;
  Users?: {
    tentaikhoan: string;
  };
}

interface ScannedProductInfo {
  productId: number;
  name: string;
  price: number;
  discountedPrice: number;
  discount: number;
}

const ProductDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [product, setProduct] = useState<ProductWithImages | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ idUsers: number } | null>(
    null
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedProductInfo, setScannedProductInfo] =
    useState<ScannedProductInfo | null>(null);
  const [scannerStatus, setScannerStatus] = useState<
    "idle" | "scanning" | "success" | "error"
  >("idle");

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/check");
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    const fetchProductAndSizes = async () => {
      if (!id) return;

      try {
        const productResponse = await fetch(`/api/category/${id}`);
        if (!productResponse.ok) {
          throw new Error("Không thể tải thông tin sản phẩm");
        }
        const productData = await productResponse.json();
        setProduct(productData);
        setSelectedImage(productData.hinhanh);

        const sizesResponse = await fetch("/api/size");
        if (!sizesResponse.ok) {
          throw new Error("Không thể tải thông tin size");
        }
        const sizeData = await sizesResponse.json();
        const sizes = sizeData.size;

        const productSizesResponse = await fetch("/api/productsize");
        if (!productSizesResponse.ok) {
          throw new Error("Không thể tải thông tin số lượng");
        }
        const productSizeData = await productSizesResponse.json();
        const productSizes = productSizeData.getProductSize;

        const sizesWithQuantities = sizes.map(
          (size: { idSize: any; tenSize: any }) => {
            const productSize = productSizes.find(
              (ps: { idSize: any; idsanpham: number }) =>
                ps.idSize === size.idSize && ps.idsanpham === parseInt(id)
            );
            return {
              idSize: size.idSize,
              tenSize: size.tenSize,
              soluong: productSize ? productSize.soluong : 0,
            };
          }
        );

        setAvailableSizes(sizesWithQuantities);

        const firstAvailableSize = sizesWithQuantities.find(
          (size: { soluong: number }) => size.soluong > 0
        );
        if (firstAvailableSize) {
          setSelectedSize(firstAvailableSize.idSize);
          setQuantity(1);
        }

        const reviewsResponse = await fetch(`/api/evaluate?idsanpham=${id}`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.data || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    const loadCartItems = () => {
      const savedCartItems = localStorage.getItem("cartItems");
      if (savedCartItems) {
        try {
          const parsedItems = JSON.parse(savedCartItems);
          setCartItems(Array.isArray(parsedItems) ? parsedItems : []);
        } catch (err) {
          console.error("Error parsing cart items:", err);
          setCartItems([]);
        }
      }
    };

    loadCartItems();
    fetchProductAndSizes();
  }, [id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (!selectedSize) return;

    const selectedSizeData = availableSizes.find(
      (s) => s.idSize === selectedSize
    );
    if (!selectedSizeData) return;

    const maxQuantity = selectedSizeData.soluong;
    const validQuantity = Math.min(Math.max(1, newQuantity), maxQuantity);
    setQuantity(validQuantity);
  };

  const handleSizeChange = (sizeId: number) => {
    setSelectedSize(sizeId);
    setQuantity(1);
  };

  // Improved barcode scanning handler
  const handleBarcodeScanned = async (code: string) => {
    setScannerStatus("scanning");

    try {
      // Check if the code is for the current product first
      if (product && code === `PROD${product.idsanpham}`) {
        const discountedPrice = product.gia * (1 - product.giamgia / 100);
        setScannedProductInfo({
          productId: product.idsanpham,
          name: product.tensanpham,
          price: product.gia,
          discountedPrice: discountedPrice,
          discount: product.giamgia,
        });
        setScannerStatus("success");
        setShowScanner(false);
        toast.success("Mã vạch hợp lệ! Đã hiển thị thông tin sản phẩm.");
        return;
      }

      // Extract product ID from barcode (assuming format PROD{id})
      const productIdMatch = code.match(/PROD(\d+)/);

      if (productIdMatch) {
        const productId = parseInt(productIdMatch[1]);

        // If different from current product, fetch that product's details
        if (productId !== parseInt(id || "0")) {
          try {
            const otherProductResponse = await fetch(
              `/api/sanpham/${productId}`
            );
            if (!otherProductResponse.ok) {
              throw new Error("Không tìm thấy sản phẩm với mã vạch này");
            }

            const otherProductData = await otherProductResponse.json();
            const discountedPrice =
              otherProductData.gia * (1 - otherProductData.giamgia / 100);

            setScannedProductInfo({
              productId: otherProductData.idsanpham,
              name: otherProductData.tensanpham,
              price: otherProductData.gia,
              discountedPrice: discountedPrice,
              discount: otherProductData.giamgia,
            });

            setScannerStatus("success");
            toast.success("Đã quét mã vạch sản phẩm khác!");
          } catch (err) {
            console.error("Error fetching scanned product:", err);
            setScannerStatus("error");
            toast.error("Không thể tìm thấy sản phẩm với mã vạch này");
          }
        }
      } else {
        // If the barcode format is invalid
        setScannerStatus("error");
        toast.error("Mã vạch không hợp lệ! Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Error processing barcode:", err);
      setScannerStatus("error");
      toast.error("Có lỗi xảy ra khi xử lý mã vạch");
    }
  };

  // Function to view the scanned product
  const viewScannedProduct = () => {
    if (
      scannedProductInfo &&
      scannedProductInfo.productId !== parseInt(id || "0")
    ) {
      router.push(`/component/product?id=${scannedProductInfo.productId}`);
    }
  };

  const handleAddToCart = async (isInstantBuy: boolean) => {
    if (!product || !selectedSize || quantity <= 0) {
      toast.error("Vui lòng chọn size và số lượng");
      return;
    }

    const selectedSizeData = availableSizes.find(
      (s) => s.idSize === selectedSize
    );
    if (!selectedSizeData || selectedSizeData.soluong < quantity) {
      toast.error("Số lượng trong kho không đủ");
      return;
    }

    setOrderLoading(true);
    setIsAddingToCart(true);

    try {
      const response = await fetch("/api/productsize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idsanpham: product.idsanpham,
          idSize: selectedSize,
          soluong: selectedSizeData.soluong - quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi cập nhật số lượng");
      }

      const cartResponse = await fetch("/api/giohang", {
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

      const cartData = await cartResponse.json();

      if (cartResponse.ok) {
        setAvailableSizes((prevSizes) =>
          prevSizes.map((size) =>
            size.idSize === selectedSize
              ? { ...size, soluong: size.soluong - quantity }
              : size
          )
        );

        const newCartItem: CartItem = {
          productId: product.idsanpham,
          quantity,
          sizeId: selectedSize,
        };

        setCartItems((prevItems) => {
          const existingItemIndex = prevItems.findIndex(
            (item) =>
              item.productId === newCartItem.productId &&
              item.sizeId === newCartItem.sizeId
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...prevItems];
            updatedItems[existingItemIndex].quantity += quantity;
            return updatedItems;
          }

          return [...prevItems, newCartItem];
        });

        toast.success(
          `Đã thêm ${quantity} sản phẩm ${product.tensanpham} size ${selectedSizeData.tenSize} vào giỏ hàng`
        );

        if (isInstantBuy) {
          router.push("/component/shopping");
        }
      } else {
        throw new Error(
          cartData.error || "Có lỗi xảy ra khi thêm vào giỏ hàng"
        );
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setOrderLoading(false);
      setIsAddingToCart(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để đánh giá");
      return;
    }

    if (!comment.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    setIsSubmittingReview(true);

    try {
      const response = await fetch("/api/danhgia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idsanpham: parseInt(id!),
          idUsers: currentUser.idUsers,
          sao: rating,
          noidung: comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi gửi đánh giá");
      }

      toast.success("Đánh giá thành công");
      setComment("");
      setRating(5);

      const reviewsResponse = await fetch(`/api/evaluate?idsanpham=${id}`);
      const reviewsData = await reviewsResponse.json();
      setReviews(reviewsData.data || []);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error instanceof Error ? error.message : "Lỗi khi gửi đánh giá"
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Lỗi: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Không tìm thấy sản phẩm
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, review) => acc + review.sao, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Toaster position="top-center" />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-row-reverse gap-6">
              <div className="flex-1 max-w-2xl">
                <div className="relative h-[500px]">
                  <img
                    src={selectedImage}
                    alt={product.tensanpham}
                    className="w-full h-full object-contain rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 w-20">
                {product.images.map((image) => (
                  <button
                    key={image.idImage}
                    onClick={() => setSelectedImage(image.url)}
                    className={`relative w-full h-20 border-2 rounded-md overflow-hidden transition-all ${
                      selectedImage === image.url
                        ? "border-blue-500 shadow-md"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.altText || ""}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{product.tensanpham}</h1>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-semibold text-red-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.gia * (1 - product.giamgia / 100))}
                  </p>
                  {product.giamgia > 0 && (
                    <p className="text-sm text-gray-500 line-through">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.gia)}
                    </p>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Tổng số lượng:{" "}
                  {availableSizes.reduce((acc, size) => acc + size.soluong, 0)}
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h2 className="text-xl font-semibold">Mã vạch sản phẩm</h2>
                <div className="flex justify-center bg-white p-4 rounded-lg">
                  <Barcode
                    value={`PROD${product.idsanpham}`}
                    format="CODE128"
                    width={1.5}
                    height={50}
                    displayValue={true}
                  />
                </div>

                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={() => {
                      setShowScanner(!showScanner);
                      setScannedProductInfo(null);
                      setScannerStatus("idle");
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {showScanner ? "Đóng máy quét" : "Quét mã vạch"}
                  </button>

                  {showScanner && (
                    <div className="w-full max-w-lg">
                      <BarcodeScanner onDetected={handleBarcodeScanned} />
                    </div>
                  )}

                  {scannedProductInfo && (
                    <div className="bg-white p-4 rounded-lg shadow-lg w-full">
                      <h3 className="text-xl font-semibold mb-2">
                        Thông tin sản phẩm đã quét
                      </h3>
                      <p className="text-lg font-medium">
                        {scannedProductInfo.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-semibold text-red-600">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(scannedProductInfo.discountedPrice)}
                        </p>
                        {scannedProductInfo.discount > 0 && (
                          <p className="text-sm text-gray-500 line-through">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(scannedProductInfo.price)}
                          </p>
                        )}
                      </div>
                      {scannedProductInfo.discount > 0 && (
                        <p className="text-sm text-green-600">
                          Giảm giá: {scannedProductInfo.discount}%
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-medium">Kích thước:</p>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size.idSize}
                      onClick={() => handleSizeChange(size.idSize)}
                      disabled={size.soluong === 0}
                      className={`px-4 py-2 border rounded-md transition-all ${
                        selectedSize === size.idSize
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : size.soluong === 0
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {size.tenSize} ({size.soluong})
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-medium">Số lượng:</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={
                      !selectedSize ||
                      quantity >=
                        (availableSizes.find((s) => s.idSize === selectedSize)
                          ?.soluong || 0)
                    }
                    className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleAddToCart(false)}
                  disabled={orderLoading || !selectedSize}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {orderLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                      Đang xử lý...
                    </span>
                  ) : (
                    "Thêm vào giỏ hàng"
                  )}
                </button>
                <button
                  onClick={() => handleAddToCart(true)}
                  disabled={orderLoading || !selectedSize}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mua ngay
                </button>
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Mô tả sản phẩm</h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {product.mota}
                </p>
              </div>
            </div>
          </div>
        </div>
        <ProductReviews productId={product?.idsanpham || 0} />
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
