"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaBagShopping } from "react-icons/fa6";
import { FaMars, FaVenus } from "react-icons/fa";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";

// Interfaces for type safety
interface User {
  id: number;
  Hoten: string;
  Email: string;
  role?: {
    Tennguoidung: string;
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
  gioitinh: boolean;
  size: string;
}

interface CartItem {
  idgiohang: number;
  idsanpham: number;
  soluong: number;
  sanpham: {
    tensanpham: string;
    mota: string;
    gia: number;
    hinhanh: string | string[];
    giamgia: number;
    gioitinh: boolean;
    size: string;
  };
}

const Menu: React.FC = () => {
  // State management
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMaleDropdown, setShowMaleDropdown] = useState(false);
  const [showFemaleDropdown, setShowFemaleDropdown] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fetch user session and order count on component mount
  useEffect(() => {
    // Fetch user session
    const fetchUserSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) throw new Error("Failed to fetch session");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Session fetch error:", error);
      }
    };

    // Fetch order count
    const fetchOrderCount = async () => {
      try {
        const response = await fetch("/api/countdonhang");
        if (!response.ok) throw new Error("Failed to fetch order count");
        const count = await response.json();
        setOrderCount(count);
      } catch (error) {
        console.error("Order count fetch error:", error);
      }
    };

    // Fetch cart items
    const fetchCartItems = async () => {
      try {
        const response = await fetch("/api/giohang");
        if (!response.ok) throw new Error("Failed to fetch cart items");
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("Cart items fetch error:", error);
      }
    };

    fetchUserSession();
    fetchOrderCount();
    fetchCartItems();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUserData(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderMobileMenu = () => (
    <div
      className={`fixed inset-0 bg-white z-[100] transform ${
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out md:hidden`}
    >
      <div className="h-20 shadow px-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Logo
        </Link>
        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100vh-5rem)]">
        <div className="space-y-4">
          {/* Mobile Search */}
          <label className="input input-bordered flex items-center gap-2">
            <input type="text" className="grow" placeholder="Search" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>

          {/* Mobile Navigation Links */}
          <div className="space-y-2">
            <Link href="/sale" className="block py-2">
              Sale
            </Link>
            <Link href="/new-arrivals" className="block py-2">
              Mới về
            </Link>
            <Link href="/bestsellers" className="block py-2">
              Bán chạy
            </Link>

            {/* Mobile Nam Section */}
            <div>
              <button
                onClick={() => setShowMaleDropdown(!showMaleDropdown)}
                className="flex items-center w-full py-2"
              >
                <FaMars className="mr-2" />
                Nam
              </button>
              {showMaleDropdown && (
                <div className="pl-4 space-y-2">
                  <div>
                    <p className="font-semibold mb-1">Áo</p>
                    <ul className="pl-4 space-y-1">
                      <li>Áo polo</li>
                      <li>Áo thun</li>
                      <li>Áo sơ mi</li>
                      <li>Áo khoác</li>
                      <li>Áo hoodie - Áo nỉ</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Quần</p>
                    <ul className="pl-4 space-y-1">
                      <li>Quần jeans</li>
                      <li>Quần âu</li>
                      <li>Quần kaki</li>
                      <li>Quần dài</li>
                      <li>Quần short</li>
                      <li>Quần nỉ</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Nữ Section */}
            <div>
              <button
                onClick={() => setShowFemaleDropdown(!showFemaleDropdown)}
                className="flex items-center w-full py-2"
              >
                <FaVenus className="mr-2" />
                Nữ
              </button>
              {showFemaleDropdown && (
                <div className="pl-4 space-y-2">
                  <div>
                    <p className="font-semibold mb-1">Áo</p>
                    <ul className="pl-4 space-y-1">
                      <li>Áo polo</li>
                      <li>Áo thun</li>
                      <li>Áo sơ mi</li>
                      <li>Áo khoác</li>
                      <li>Áo hoodie - Áo nỉ</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Quần</p>
                    <ul className="pl-4 space-y-1">
                      <li>Quần jeans</li>
                      <li>Quần âu</li>
                      <li>Quần kaki</li>
                      <li>Quần dài</li>
                      <li>Quần short</li>
                      <li>Quần nỉ</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <Link href="/children" className="block py-2">
              Trẻ Em
            </Link>
            <Link href="/collections" className="block py-2">
              Bộ sưu tập
            </Link>
            <Link href="/uniform" className="block py-2">
              Đồng phục
            </Link>
            <Link href="/hot-news" className="block py-2">
              Tin Hot
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="bg-white w-full h-20 shadow fixed z-[99]">
        <div className="flex items-center justify-between h-full px-4 md:px-0">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          {/* Desktop Navigation - Hidden on Mobile */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <ul className="flex gap-10 content-center">
              <li>
                <Link href="/sale">Sale</Link>
              </li>
              <li>
                <Link href="/new-arrivals">Mới về</Link>
              </li>
              <li>
                <Link href="/bestsellers">Bán chạy</Link>
              </li>

              {/* Male Dropdown Trigger */}
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

              {/* Female Dropdown Trigger */}
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
                <Link href="/children">Trẻ Em</Link>
              </li>
              <li>
                <Link href="/collections">Bộ sưu tập</Link>
              </li>
              <li>
                <Link href="/uniform">Đồng phục</Link>
              </li>
              <li>
                <Link href="/hot-news">Tin Hot</Link>
              </li>
            </ul>
          </div>

          {/* Search Bar - Hidden on Mobile */}
          <div className="hidden md:block">
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
          </div>

          {/* Right Side Icons (Cart and User) */}
          <div className="flex items-center gap-4">
            {/* Shopping Cart */}
            <div className="dropdown dropdown-end">
              <Link href="/component/shopping">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle"
                >
                  <div className="indicator">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="badge badge-sm indicator-item">
                      {orderCount}
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* User Profile Section - Visible on both Mobile and Desktop */}
            <div className="flex items-center">
              {userData ? (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt={userData.Hoten || "User"}
                        />
                        <AvatarFallback>
                          {userData.Hoten ? userData.Hoten[0] : "JP"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-sm font-medium">
                        {userData.Hoten}
                      </div>
                      <div className="hidden md:block">
                        <Button variant="destructive" onClick={handleLogout}>
                          Logout
                        </Button>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-72">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt={userData.Hoten || "User"}
                          />
                          <AvatarFallback>
                            {userData.Hoten ? userData.Hoten[0] : "JP"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                          <div className="text-sm font-medium">
                            {userData.Hoten}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {userData.Email}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Link
                          href="/Show/ShowProfile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                        {userData.role?.Tennguoidung === "Admin" && (
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
              ) : (
                <>
                  {/* Login/Register buttons - Show on desktop */}
                  {/* <div className="hidden md:flex items-center gap-2">
                    <Link href="/contact">
                      <Button variant="outline" className="me-2">
                        Contact
                      </Button>
                    </Link>
                    <Link href="/auth/login">
                      <Button variant="ghost">Login</Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button variant="destructive" className="ms-2">
                        Register
                      </Button>
                    </Link>
                  </div> */}
                  {/* Show only avatar on mobile */}
                  <div className="md:hidden">
                    <Link href="/auth/login">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>?</AvatarFallback>
                      </Avatar>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {renderMobileMenu()}

      {/* Spacer */}
      <div className="h-20"></div>

      {/* Desktop Dropdowns */}
      {/* Nam Dropdown */}
      <div
        onMouseLeave={() => setShowMaleDropdown(false)}
        className={`${
          showMaleDropdown
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full"
        } bg-white w-full h-[300px] shadow fixed top-20 transition-all duration-300 ease-in-out transform z-20 hidden md:block`}
      >
        <div className="flex gap-11 justify-center items-start mt-4">
          <div className="flex flex-col items-center border-r h-48 pr-4">
            <p className="mb-2 font-semibold">Áo</p>
            <ul>
              <li>Áo polo</li>
              <li>Áo thun</li>
              <li>Áo sơ mi</li>
              <li>Áo khoác</li>
              <li>Áo hoodie - Áo nỉ</li>
            </ul>
          </div>
          <div className="flex flex-col items-center border-r h-48 pr-4">
            <p className="mb-2 font-semibold">Quần</p>
            <ul>
              <li>Quần jeans</li>
              <li>Quần âu</li>
              <li>Quần kaki</li>
              <li>Quần dài</li>
              <li>Quần short</li>
              <li>Quần nỉ</li>
            </ul>
          </div>
          <div className="flex flex-col items-center border-r h-48 pr-4">
            <p className="mb-2 font-semibold">Đồ Bộ</p>
            <ul>
              <li>Đồ bộ ngắn tay</li>
              <li>Đồ bộ dài tay</li>
            </ul>
            <p className="mb-2 font-semibold mt-10">Đồ mặc trong</p>
            <ul>
              <li>Áo ba lỗ</li>
              <li>Quần lót</li>
            </ul>
          </div>
          <div className="flex flex-col items-center border-r h-48 pr-4">
            <p className="mb-2 font-semibold">Đồ Thể Thao Nam</p>
            <ul>
              <li>Áo thun thể thao</li>
              <li>Áo polo thể thao</li>
              <li>Quần Thể Thao</li>
              <li>Bộ Thể Thao</li>
            </ul>
          </div>
          <div>
            <img
              src="https://yody.vn/images/menu-desktop/menu_man.png"
              alt=""
              className="w-56 h-32"
            />
          </div>
        </div>
      </div>

      {/* Nữ Dropdown */}
      <div
        onMouseLeave={() => setShowFemaleDropdown(false)}
        className={`${
          showFemaleDropdown
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full"
        } bg-white w-full h-[300px] shadow fixed top-20 transition-all duration-300 ease-in-out transform z-20 hidden md:block`}
      >
        <div className="flex gap-11 justify-center items-start mt-4">
          <div className="flex flex-col items-center border-r h-48 pr-4">
            <p className="mb-2 font-semibold">Áo</p>
            <ul>
              <li>Áo polo</li>
              <li>Áo thun</li>
              <li>Áo sơ mi</li>
              <li>Áo khoác</li>
              <li>Áo hoodie - Áo nỉ</li>
            </ul>
          </div>
          <div className="flex flex-col items-center border-r h-48 pr-4">
            <p className="mb-2 font-semibold">Quần</p>
            <ul>
              <li>Quần jeans</li>
              <li>Quần âu</li>
              <li>Quần kaki</li>
              <li>Quần dài</li>
              <li>Quần short</li>
              <li>Quần nỉ</li>
            </ul>
          </div>
          <div className="flex flex-col items-center border-r h-48 pr-4">
            <p className="mb-2 font-semibold">Đồ Bộ</p>
            <ul>
              <li>Đồ bộ ngắn tay</li>
              <li>Đồ bộ dài tay</li>
            </ul>
            <p className="mb-2 font-semibold mt-10">Đồ mặc trong</p>
            <ul>
              <li>Áo ba lỗ</li>
              <li>Quần lót</li>
            </ul>
          </div>
          <div>
            <img
              src="https://yody.vn/images/menu-desktop/menu_woman.png"
              alt=""
              className="w-56 h-32"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
