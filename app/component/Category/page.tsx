"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Footer from "../Footer";
import { FaBagShopping, FaMars, FaVenus } from "react-icons/fa6";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

// Interfaces
interface User {
  idUsers: number;
  Tentaikhoan: string;
  Hoten: string;
  Email?: string;
  role?: {
    Tennguoidung: string;
  };
}

interface Review {
  iddanhgia: number;
  idUsers: number;
  sao: number;
  noidung: string;
  ngaydanhgia: string;
  users: {
    Tentaikhoan: string;
    Hoten: string;
  };
}

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
  danhgia?: Review[];
}

const ProductDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // State for header
  const [showMaleDropdown, setShowMaleDropdown] = useState(false);
  const [showFemaleDropdown, setShowFemaleDropdown] = useState(false);

  // State for product details
  const [sanpham, setSanpham] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentImage, setCurrentImage] = useState(
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-2.jpg"
  );
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [newReview, setNewReview] = useState({
    sao: 5,
    noidung: "",
  });

  // Image gallery
  const Images = [
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-2.jpg",
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-7.jpg",
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-1.jpg",
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-8.jpg",
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-11.jpg",
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-10.jpg",
    "https://m.yodycdn.com/videos/website/AKN/AKN5042.mp4",
  ];

  // Fetch user session and product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch session data
        const sessionRes = await fetch("/api/auth/session");
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          setCurrentUser(sessionData);
        }

        // Fetch product data if ID exists
        if (id) {
          const productRes = await fetch(`/api/sanpham/${id}`);
          if (!productRes.ok) throw new Error("Lỗi khi tải thông tin sản phẩm");
          const productData = await productRes.json();
          setSanpham(productData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Product detail handlers
  const handleImageClick = (image: string) => setCurrentImage(image);
  const handleSizeSelect = (size: string) => setSelectedSize(size);
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  // Review submission handler
  const submitReview = async () => {
    if (!currentUser || !sanpham) {
      setReviewError("Vui lòng đăng nhập để đánh giá");
      return;
    }

    setReviewSubmitting(true);
    setReviewError(null);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idsanpham: sanpham.idsanpham,
          idUsers: currentUser.idUsers,
          sao: newReview.sao,
          noidung: newReview.noidung,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi gửi đánh giá");
      }

      const newReviewData = {
        iddanhgia: data.data.iddanhgia,
        idUsers: currentUser.idUsers,
        sao: newReview.sao,
        noidung: newReview.noidung,
        ngaydanhgia: data.data.ngaydanhgia || new Date().toISOString(),
        users: {
          Tentaikhoan: currentUser.Tentaikhoan,
          Hoten: currentUser.Hoten,
        },
      };

      setSanpham((prevSanpham) => {
        if (!prevSanpham) return null;
        return {
          ...prevSanpham,
          danhgia: prevSanpham.danhgia
            ? [...prevSanpham.danhgia, newReviewData]
            : [newReviewData],
        };
      });

      setNewReview({ sao: 5, noidung: "" });
    } catch (err) {
      setReviewError(
        err instanceof Error ? err.message : "Lỗi khi gửi đánh giá"
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  const calculateAverageRating = (reviews?: Review[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.sao, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="light"
      >
        <span className="loading loading-spinner text-blue-600 loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-red-600">{error}</div>
      </div>
    );
  }

  if (!sanpham) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-gray-800">
          Không tìm thấy sản phẩm
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white w-full h-20 shadow fixed z-[99]">
        <div className="flex items-center justify-center h-full">
          <div className="flex gap-10 content-center">
            <ul className="flex gap-10 content-center">
              <li>
                <Link href="">Sale</Link>
              </li>
              <li>
                <Link href="">Mới về</Link>
              </li>
              <li>
                <Link href="">Bán chạy</Link>
              </li>
              <li
                onMouseEnter={() => {
                  setShowMaleDropdown(true);
                  setShowFemaleDropdown(false);
                }}
              >
                <span className="relative cursor-pointer group">
                  <FaMars className="inline mr-1 mb-[3px]" />
                  Nam
                  <span className="absolute left-0 bottom-0 h-0.5 w-full bg-black transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </span>
              </li>
              <li
                onMouseEnter={() => {
                  setShowFemaleDropdown(true);
                  setShowMaleDropdown(false);
                }}
              >
                <span className="relative cursor-pointer group">
                  <FaVenus className="inline mr-1 mb-[3px]" />
                  Nữ
                  <span className="absolute left-0 bottom-0 h-0.5 w-full bg-pink-500 border-dotted transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </span>
              </li>
              <li>
                <Link href="">Trẻ Em</Link>
              </li>
              <li>
                <Link href="">Bộ sưu tập</Link>
              </li>
              <li>
                <Link href="">Đồng phục</Link>
              </li>
              <li>
                <Link href="">Tin Hot</Link>
              </li>
            </ul>
          </div>

          {/* Search bar */}
          <label className="input input-bordered flex items-center gap-2 ml-3">
            <input
              type="text"
              className="grow rounded-full w-32 h-10"
              placeholder="Search"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>

          {/* Shopping cart */}
          <div className="cursor-pointer">
            <FaBagShopping className="ml-5 text-2xl text-rose-500" />
          </div>

          {/* User section */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt={currentUser?.Hoten || "User"}
                        />
                        <AvatarFallback>
                          {currentUser?.Hoten ? currentUser.Hoten[0] : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-sm font-medium">
                        {currentUser?.Hoten}
                      </div>
                      <Button variant="destructive" onClick={handleLogout}>
                        Logout
                      </Button>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt={currentUser?.Hoten || "User"}
                          />
                          <AvatarFallback>
                            {currentUser?.Hoten ? currentUser.Hoten[0] : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5">
                          <div className="text-sm font-medium">
                            {currentUser?.Hoten}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {currentUser?.Email}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                        {currentUser.role?.Tennguoidung === "Admin" && (
                          <Link
                            href="/Admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Dashboard
                          </Link>
                        )}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            ) : (
              <div>
                <Link href="/contact">
                  <Button variant="blue" className="me-2">
                    Contact
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="green">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="destructive" className="ms-2">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dropdowns */}
      {/* Male Dropdown */}
      <div
        onMouseLeave={() => setShowMaleDropdown(false)}
        // {/* Male Dropdown */}
        // <div
        // onMouseLeave={() => setShowMaleDropdown(false)}
        className={`absolute top-20 left-0 w-full bg-white shadow-lg transition-all duration-300 ${
          showMaleDropdown ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="container mx-auto py-6 grid grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Áo Nam</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/nam/ao-polo">Áo Polo</Link>
              </li>
              <li>
                <Link href="/nam/ao-thun">Áo Thun</Link>
              </li>
              <li>
                <Link href="/nam/ao-so-mi">Áo Sơ Mi</Link>
              </li>
              <li>
                <Link href="/nam/ao-khoac">Áo Khoác</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quần Nam</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/nam/quan-jean">Quần Jean</Link>
              </li>
              <li>
                <Link href="/nam/quan-tay">Quần Tây</Link>
              </li>
              <li>
                <Link href="/nam/quan-short">Quần Short</Link>
              </li>
              <li>
                <Link href="/nam/quan-kaki">Quần Kaki</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Phụ Kiện Nam</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/nam/that-lung">Thắt Lưng</Link>
              </li>
              <li>
                <Link href="/nam/vi">Ví Nam</Link>
              </li>
              <li>
                <Link href="/nam/tui-xach">Túi Xách</Link>
              </li>
              <li>
                <Link href="/nam/non">Nón</Link>
              </li>
            </ul>
          </div>
          <div>
            <img
              src="/images/men-fashion-preview.jpg"
              alt="Men's Fashion Preview"
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Female Dropdown */}
      <div
        onMouseLeave={() => setShowFemaleDropdown(false)}
        className={`absolute top-20 left-0 w-full bg-white shadow-lg transition-all duration-300 ${
          showFemaleDropdown ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="container mx-auto py-6 grid grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4 text-pink-500">Áo Nữ</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/nu/ao-kieu">Áo Kiểu</Link>
              </li>
              <li>
                <Link href="/nu/ao-so-mi">Áo Sơ Mi</Link>
              </li>
              <li>
                <Link href="/nu/ao-thun">Áo Thun</Link>
              </li>
              <li>
                <Link href="/nu/ao-khoac">Áo Khoác</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-pink-500">Quần/Váy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/nu/chan-vay">Chân Váy</Link>
              </li>
              <li>
                <Link href="/nu/quan-jean">Quần Jean</Link>
              </li>
              <li>
                <Link href="/nu/quan-tay">Quần Tây</Link>
              </li>
              <li>
                <Link href="/nu/vay-dam">Váy Đầm</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-pink-500">Phụ Kiện Nữ</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/nu/tui-xach">Túi Xách</Link>
              </li>
              <li>
                <Link href="/nu/giay">Giày</Link>
              </li>
              <li>
                <Link href="/nu/phu-kien">Phụ Kiện</Link>
              </li>
              <li>
                <Link href="/nu/trang-suc">Trang Sức</Link>
              </li>
            </ul>
          </div>
          <div>
            <img
              src="/images/women-fashion-preview.jpg"
              alt="Women's Fashion Preview"
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto pt-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={currentImage}
                alt={sanpham.tensanpham}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Images.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
                    currentImage === image
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mt-8">
              Giá bán
            </h3>
            {sanpham.giamgia > 0 ? (
              <div>
                {/* Giá gốc (hiển thị kèm gạch ngang nếu có giảm giá) */}
                <p className="mt-2 text-xl text-gray-500 line-through">
                  {Number(sanpham.gia).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
                {/* Giá sau khi giảm */}
                <p className="mt-1 text-3xl font-bold text-red-600">
                  {Number(
                    sanpham.gia * (1 - sanpham.giamgia / 100)
                  ).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
                {/* Phần trăm giảm giá */}
                <p className="mt-1 text-sm font-medium text-green-600">
                  Giảm {sanpham.giamgia}%!
                </p>
              </div>
            ) : (
              <p className="mt-2 text-3xl font-bold text-black">
                {Number(sanpham.gia).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            )}

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Kích thước</h3>
              <div className="flex gap-2">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-500"
                    }`}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Số lượng</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={decrementQuantity}
                  className="px-3 py-1 border rounded-md"
                >
                  -
                </button>
                <span className="px-4 py-1 border rounded-md">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="px-3 py-1 border rounded-md"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              variant="default"
              className="w-full py-3 bg-blue-600 text-white hover:bg-blue-700"
            >
              Thêm vào giỏ hàng
            </Button>

            {/* Product Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h3>
              <p className="text-gray-600">{sanpham.mota}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h2>

          {/* Review Stats */}
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl font-bold">
              {calculateAverageRating(sanpham.danhgia)}
            </div>
            <div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${
                      star <=
                      Math.round(
                        Number(calculateAverageRating(sanpham.danhgia))
                      )
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {sanpham.danhgia?.length || 0} đánh giá
              </div>
            </div>
          </div>

          {/* Write Review Form */}
          {currentUser && (
            <div className="mb-8 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Viết đánh giá</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Đánh giá sao</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() =>
                          setNewReview({ ...newReview, sao: star })
                        }
                        className="focus:outline-none"
                      >
                        <svg
                          className={`w-8 h-8 ${
                            star <= newReview.sao
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block mb-2">Nội dung đánh giá</label>
                  <textarea
                    value={newReview.noidung}
                    onChange={(e) =>
                      setNewReview({ ...newReview, noidung: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                    rows={4}
                  />
                </div>
                {reviewError && (
                  <div className="text-red-500">{reviewError}</div>
                )}
                <Button
                  onClick={submitReview}
                  disabled={reviewSubmitting}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {reviewSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                </Button>
              </div>
            </div>
          )}

          {/* Review List */}
          <div className="space-y-6">
            {sanpham.danhgia?.map((review) => (
              <div key={review.iddanhgia} className="border-b pb-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="font-semibold">{review.users.Hoten}</div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= review.sao
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.ngaydanhgia).toLocaleDateString("vi-VN")}
                  </div>
                </div>
                <p className="text-gray-600">{review.noidung}</p>
              </div>
            ))}
          </div>

          {/* No Reviews Message */}
          {(!sanpham.danhgia || sanpham.danhgia.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Chưa có đánh giá nào cho sản phẩm này
            </div>
          )}
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
          {/* Add your related products component here */}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductDetail;
