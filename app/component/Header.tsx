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
import { MenuIcon, X, ChevronDown } from "lucide-react";

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
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Determine device type based on window width
  const isDesktop = windowWidth >= 1024; // lg breakpoint
  const isTablet = windowWidth >= 768 && windowWidth < 1024; // md to lg
  const isMobile = windowWidth < 768; // below md

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

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

  // Mobile user profile dropdown
  const renderMobileUserProfile = () => {
    if (!userData) {
      return (
        <div className="py-4 border-t border-gray-200">
          <Link href="/auth/login" className="block py-2 px-4">
            Login
          </Link>
          <Link href="/auth/register" className="block py-2 px-4">
            Register
          </Link>
        </div>
      );
    }

    return (
      <div className="py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt={userData.Hoten || "User"}
            />
            <AvatarFallback>
              {userData.Hoten ? userData.Hoten[0] : "JP"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{userData.Hoten}</div>
            <div className="text-xs text-gray-500">{userData.Email}</div>
          </div>
        </div>
        <Link
          href="/Show/ShowProfile"
          className="block px-4 py-2 hover:bg-gray-100"
        >
          Profile
        </Link>
        {userData.role?.Tennguoidung === "Admin" && (
          <Link href="/Admin" className="block px-4 py-2 hover:bg-gray-100">
            Dashboard
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    );
  };

  // Mobile menu component
  const renderMobileMenu = () => (
    <div
      className={`fixed inset-0 bg-white z-[100] transform ${
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out lg:hidden`}
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
            <Link href="/sale" className="block py-2 font-medium">
              Sale
            </Link>
            <Link href="/new-arrivals" className="block py-2 font-medium">
              Mới về
            </Link>
            <Link href="/bestsellers" className="block py-2 font-medium">
              Bán chạy
            </Link>

            {/* Mobile Nam Section */}
            <div className="border-b pb-2">
              <button
                onClick={() => setShowMaleDropdown(!showMaleDropdown)}
                className="flex items-center justify-between w-full py-2 font-medium"
              >
                <span className="flex items-center">
                  <FaMars className="mr-2" />
                  Nam
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showMaleDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showMaleDropdown && (
                <div className="pl-4 space-y-3 mt-2">
                  <div>
                    <p className="font-semibold mb-1 text-gray-800">Áo</p>
                    <ul className="pl-4 space-y-1 text-gray-600">
                      <li className="hover:text-black">
                        <Link href="/nam/ao/polo">Áo polo</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nam/ao/thun">Áo thun</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nam/ao/somi">Áo sơ mi</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nam/ao/khoac">Áo khoác</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nam/ao/hoodie">Áo hoodie - Áo nỉ</Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1 text-gray-800">Quần</p>
                    <ul className="pl-4 space-y-1 text-gray-600">
                      <li className="hover:text-black">
                        <Link href="/nam/quan/jeans">Quần jeans</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nam/quan/au">Quần âu</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nam/quan/kaki">Quần kaki</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nam/quan/dai">Quần dài</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nam/quan/short">Quần short</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nam/quan/ni">Quần nỉ</Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1 text-gray-800">Đồ Bộ</p>
                    <ul className="pl-4 space-y-1 text-gray-600">
                      <li className="hover:text-black">
                        <Link href="/nam/do-bo/ngan-tay">Đồ bộ ngắn tay</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nam/do-bo/dai-tay">Đồ bộ dài tay</Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1 text-gray-800">
                      Đồ mặc trong
                    </p>
                    <ul className="pl-4 space-y-1 text-gray-600">
                      <li className="hover:text-black">
                        <Link href="/nam/do-mac-trong/ao-ba-lo">Áo ba lỗ</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nam/do-mac-trong/quan-lot">Quần lót</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Nữ Section */}
            <div className="border-b pb-2">
              <button
                onClick={() => setShowFemaleDropdown(!showFemaleDropdown)}
                className="flex items-center justify-between w-full py-2 font-medium"
              >
                <span className="flex items-center">
                  <FaVenus className="mr-2" />
                  Nữ
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showFemaleDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showFemaleDropdown && (
                <div className="pl-4 space-y-3 mt-2">
                  <div>
                    <p className="font-semibold mb-1 text-gray-800">Áo</p>
                    <ul className="pl-4 space-y-1 text-gray-600">
                      <li className="hover:text-black">
                        <Link href="/nu/ao/polo">Áo polo</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nu/ao/thun">Áo thun</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nu/ao/somi">Áo sơ mi</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nu/ao/khoac">Áo khoác</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nu/ao/hoodie">Áo hoodie - Áo nỉ</Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1 text-gray-800">Quần</p>
                    <ul className="pl-4 space-y-1 text-gray-600">
                      <li className="hover:text-black">
                        <Link href="/nu/quan/jeans">Quần jeans</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nu/quan/au">Quần âu</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nu/quan/kaki">Quần kaki</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nu/quan/dai">Quần dài</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nu/quan/short">Quần short</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nu/quan/ni">Quần nỉ</Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1 text-gray-800">Đồ Bộ</p>
                    <ul className="pl-4 space-y-1 text-gray-600">
                      <li className="hover:text-black">
                        <Link href="/nu/do-bo/ngan-tay">Đồ bộ ngắn tay</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nu/do-bo/dai-tay">Đồ bộ dài tay</Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1 text-gray-800">
                      Đồ mặc trong
                    </p>
                    <ul className="pl-4 space-y-1 text-gray-600">
                      <li className="hover:text-black">
                        <Link href="/nu/do-mac-trong/ao-ba-lo">Áo ba lỗ</Link>
                      </li>
                      <li className="hover:text-black">
                        <Link href="/nu/do-mac-trong/quan-lot">Quần lót</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <Link href="/children" className="block py-2 font-medium">
              Trẻ Em
            </Link>
            <Link href="/collections" className="block py-2 font-medium">
              Bộ sưu tập
            </Link>
            <Link href="/uniform" className="block py-2 font-medium">
              Đồng phục
            </Link>
            <Link href="/hot-news" className="block py-2 font-medium">
              Tin Hot
            </Link>
          </div>

          {/* Mobile User Profile */}
          {renderMobileUserProfile()}
        </div>
      </div>
    </div>
  );

  // Tablet menu component (similar to desktop but with some adjustments)
  const renderTabletMenu = () => (
    <div className="hidden md:block lg:hidden">
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo and Navigation */}
        <div className="flex items-center">
          <button
            className="p-2 mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <Link href="/" className="text-xl font-bold">
            Logo
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xs mx-4">
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow rounded-full w-full h-10"
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

          {/* User Profile */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
              onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
            >
              <Avatar className="h-8 w-8">
                {userData ? (
                  <>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt={userData.Hoten || "User"}
                    />
                    <AvatarFallback>
                      {userData.Hoten ? userData.Hoten[0] : "JP"}
                    </AvatarFallback>
                  </>
                ) : (
                  <AvatarFallback>?</AvatarFallback>
                )}
              </Avatar>
            </div>
            <ul
              tabIndex={0}
              className={`mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 ${
                isMobileProfileOpen ? "block" : "hidden"
              }`}
            >
              {userData ? (
                <>
                  <li className="p-2 border-b">
                    <div className="flex flex-col">
                      <span className="font-medium">{userData.Hoten}</span>
                      <span className="text-xs text-gray-500">
                        {userData.Email}
                      </span>
                    </div>
                  </li>
                  <li>
                    <Link href="/Show/ShowProfile" className="justify-between">
                      Profile
                    </Link>
                  </li>
                  {userData.role?.Tennguoidung === "Admin" && (
                    <li>
                      <Link href="/Admin">Dashboard</Link>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout} className="text-red-600">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/auth/login">Login</Link>
                  </li>
                  <li>
                    <Link href="/auth/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop menu component
  const renderDesktopMenu = () => (
    <div className="hidden lg:block">
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold mr-8">
          Logo
        </Link>

        {/* Desktop Navigation */}
        <div className="flex items-center justify-center flex-1">
          <ul className="flex gap-8 content-center">
            <li>
              <Link
                href="/sale"
                className="hover:text-gray-600 transition-colors"
              >
                Sale
              </Link>
            </li>
            <li>
              <Link
                href="/new-arrivals"
                className="hover:text-gray-600 transition-colors"
              >
                Mới về
              </Link>
            </li>
            <li>
              <Link
                href="/bestsellers"
                className="hover:text-gray-600 transition-colors"
              >
                Bán chạy
              </Link>
            </li>

            {/* Male Dropdown Trigger */}
            <li
              onMouseEnter={() => {
                setShowMaleDropdown(true);
                setShowFemaleDropdown(false);
              }}
            >
              <span className="relative cursor-pointer group flex items-center">
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
              <span className="relative cursor-pointer group flex items-center">
                <FaVenus className="inline mr-1 mb-[3px]" />
                Nữ
                <span className="absolute left-0 bottom-0 h-0.5 w-full bg-pink-500 border-dotted transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </span>
            </li>

            <li>
              <Link
                href="/children"
                className="hover:text-gray-600 transition-colors"
              >
                Trẻ Em
              </Link>
            </li>
            <li>
              <Link
                href="/collections"
                className="hover:text-gray-600 transition-colors"
              >
                Bộ sưu tập
              </Link>
            </li>
            <li>
              <Link
                href="/uniform"
                className="hover:text-gray-600 transition-colors"
              >
                Đồng phục
              </Link>
            </li>
            <li>
              <Link
                href="/hot-news"
                className="hover:text-gray-600 transition-colors"
              >
                Tin Hot
              </Link>
            </li>
          </ul>
        </div>

        {/* Search Bar */}
        <div className="mr-4">
          <label className="input input-bordered flex items-center gap-2">
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

          {/* User Profile Section */}
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
                    <div className="text-sm font-medium">{userData.Hoten}</div>
                    <div>
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
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
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
    </div>
  );

  // Desktop Dropdowns
  const renderDesktopDropdowns = () => (
    <>
      {/* Nam Dropdown */}
      <div
        onMouseLeave={() => setShowMaleDropdown(false)}
        className={`${
          showMaleDropdown
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        } bg-white w-full h-[300px] shadow fixed top-20 transition-all duration-300 ease-in-out transform z-20 hidden lg:block`}
      >
        <div className="flex gap-11 justify-center items-start mt-4">
          <div className="flex flex-col items-center border-r h-48 pr-4">
            <p className="mb-2 font-semibold">Áo</p>
            <ul className="space-y-1">
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/ao/polo">Áo polo</Link>
              </li>
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/ao/thun">Áo thun</Link>
              </li>
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/ao/somi">Áo sơ mi</Link>
              </li>
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/ao/khoac">Áo khoác</Link>
              </li>
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/ao/hoodie">Áo hoodie - Áo nỉ</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center border-r h-48 pr-4">
            <p className="mb-2 font-semibold">Quần</p>
            <ul className="space-y-1">
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/quan/jeans">Quần jeans</Link>
              </li>
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/quan/au">Quần âu</Link>
              </li>
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/quan/kaki">Quần kaki</Link>
              </li>
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/quan/dai">Quần dài</Link>
              </li>
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/quan/short">Quần short</Link>
              </li>
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/quan/ni">Quần nỉ</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center border-r h-48 pr-4">
            <p className="mb-2 font-semibold">Đồ Bộ</p>
            <ul className="space-y-1">
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/do-bo/ngan-tay">Đồ bộ ngắn tay</Link>
              </li>
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/do-bo/dai-tay">Đồ bộ dài tay</Link>
              </li>
            </ul>
            <p className="mb-2 font-semibold mt-10">Đồ mặc trong</p>
            <ul className="space-y-1">
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/do-mac-trong/ao-ba-lo">Áo ba lỗ</Link>
              </li>
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/do-mac-trong/quan-lot">Quần lót</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center border-r h-48 pr-4">
            <p className="mb-2 font-semibold">Đồ Thể Thao Nam</p>
            <ul className="space-y-1">
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/the-thao/ao-thun">Áo thun thể thao</Link>
              </li>
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/the-thao/ao-polo">Áo polo thể thao</Link>
              </li>
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/the-thao/quan">Quần Thể Thao</Link>
              </li>
              <li className="hover:text-blue-600 transition-colors">
                <Link href="/nam/the-thao/bo">Bộ Thể Thao</Link>
              </li>
            </ul>
          </div>
          <div>
            <img
              src="https://yody.vn/images/menu-desktop/menu_man.png"
              alt="Thời trang nam"
              className="w-56 h-32 object-cover rounded"
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
            : "opacity-0 -translate-y-full pointer-events-none"
        } bg-white w-full h-[300px] shadow fixed top-20 transition-all duration-300 ease-in-out transform z-20 hidden lg:block`}
      >
        <div className="flex gap-11 justify-center items-start mt-4">
          <div className="flex flex-col items-center border-r h-48 pr-4">
            <p className="mb-2 font-semibold">Áo</p>
            <ul className="space-y-1">
              <li className="hover:text-pink-600 transition-colors">
                <Link href="/nu/ao/polo">Áo polo</Link>
              </li>
              <li className="hover:text-pink-600 transition-colors">
                <Link href="/nu/ao/thun">Áo thun</Link>
              </li>
              <li className="hover:text-pink-600 transition-colors">
                <Link href="/nu/ao/somi">Áo sơ mi</Link>
              </li>
              <li className="hover:text-pink-600 transition-colors">
                <Link href="/nu/ao/khoac">Áo khoác</Link>
              </li>
              <li className="hover:text-pink-600 transition-colors">
                <Link href="/nu/ao/hoodie">Áo hoodie - Áo nỉ</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center border-r h-48 pr-4">
            <p className="mb-2 font-semibold">Quần</p>
            <ul className="space-y-1">
              <li className="hover:text-pink-600 transition-colors">
                <Link href="/nu/quan/jeans">Quần jeans</Link>
              </li>
              <li className="hover:text-pink-600 transition-colors">
                <Link href="/nu/quan/au">Quần âu</Link>
              </li>
              <li className="hover:text-pink-600 transition-colors">
                <Link href="/nu/quan/kaki">Quần kaki</Link>
              </li>
              <li className="hover:text-pink-600 transition-colors">
                <Link href="/nu/quan/dai">Quần dài</Link>
              </li>
              <li className="hover:text-pink-600 transition-colors">
                <Link href="/nu/quan/short">Quần short</Link>
              </li>
              <li className="hover:text-pink-600 transition-colors">
                <Link href="/nu/quan/ni">Quần nỉ</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center border-r h-48 pr-4">
            <p className="mb-2 font-semibold">Đồ Bộ</p>
            <ul className="space-y-1">
              <li className="hover:text-pink-600 transition-colors">
                <Link href="/nu/do-bo/ngan-tay">Đồ bộ ngắn tay</Link>
              </li>
              <li className="hover:text-pink-600 transition-colors">
                <Link href="/nu/do-bo/dai-tay">Đồ bộ dài tay</Link>
              </li>
            </ul>
            <p className="mb-2 font-semibold mt-10">Đồ mặc trong</p>
            <ul className="space-y-1">
              <li className="hover:text-pink-600 transition-colors">
                <Link href="/nu/do-mac-trong/ao-ba-lo">Áo ba lỗ</Link>
              </li>
              <li className="hover:text-pink-600 transition-colors">
                <Link href="/nu/do-mac-trong/quan-lot">Quần lót</Link>
              </li>
            </ul>
          </div>
          <div>
            <img
              src="https://yody.vn/images/menu-desktop/menu_woman.png"
              alt="Thời trang nữ"
              className="w-56 h-32 object-cover rounded"
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div>
      <div className="bg-white w-full h-20 shadow fixed z-[99]">
        {/* Render appropriate menu based on screen size */}
        {renderMobileMenu()}
        {renderTabletMenu()}
        {renderDesktopMenu()}
      </div>

      {/* Desktop Dropdowns */}
      {renderDesktopDropdowns()}

      {/* Spacer */}
      <div className="h-20"></div>
    </div>
  );
};

export default Menu;
// "use client";
// import React, { useState, useEffect } from "react";

// import { User, CartItem } from "@/app/Menu/type/menu";
// import DesktopDropdowns from "../Menu/DesktopDropdown";
// import DesktopMenu from "../Menu/DesktopMenu";
// import TabletMenu from "../Menu/TableMenu";
// import MobileMenu from "../Menu/MobileMenu";

// const Menu: React.FC = () => {
//   // State management
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showMaleDropdown, setShowMaleDropdown] = useState(false);
//   const [showFemaleDropdown, setShowFemaleDropdown] = useState(false);
//   const [userData, setUserData] = useState<User | null>(null);
//   const [orderCount, setOrderCount] = useState<number>(0);
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
//   const [windowWidth, setWindowWidth] = useState<number>(
//     typeof window !== "undefined" ? window.innerWidth : 0
//   );

//   // Determine device type based on window width
//   const isDesktop = windowWidth >= 1024; // lg breakpoint
//   const isTablet = windowWidth >= 768 && windowWidth < 1024; // md to lg
//   const isMobile = windowWidth < 768; // below md

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     if (typeof window !== "undefined") {
//       window.addEventListener("resize", handleResize);
//       return () => window.removeEventListener("resize", handleResize);
//     }
//   }, []);

//   // Fetch user session and order count on component mount
//   useEffect(() => {
//     // Fetch user session
//     const fetchUserSession = async () => {
//       try {
//         const response = await fetch("/api/auth/session");
//         if (!response.ok) throw new Error("Failed to fetch session");
//         const data = await response.json();
//         setUserData(data);
//       } catch (error) {
//         console.error("Session fetch error:", error);
//       }
//     };

//     // Fetch order count
//     const fetchOrderCount = async () => {
//       try {
//         const response = await fetch("/api/countdonhang");
//         if (!response.ok) throw new Error("Failed to fetch order count");
//         const count = await response.json();
//         setOrderCount(count);
//       } catch (error) {
//         console.error("Order count fetch error:", error);
//       }
//     };

//     // Fetch cart items
//     const fetchCartItems = async () => {
//       try {
//         const response = await fetch("/api/giohang");
//         if (!response.ok) throw new Error("Failed to fetch cart items");
//         const data = await response.json();
//         setCartItems(data);
//       } catch (error) {
//         console.error("Cart items fetch error:", error);
//       }
//     };

//     fetchUserSession();
//     fetchOrderCount();
//     fetchCartItems();
//   }, []);

//   // Logout handler
//   const handleLogout = async () => {
//     try {
//       await fetch("/api/auth/logout", { method: "POST" });
//       setUserData(null);
//       window.location.href = "/";
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <div>
//       <div className="bg-white w-full h-20 shadow fixed z-[99]">
//         {/* Mobile Menu Component */}
//         <MobileMenu
//           userData={userData}
//           handleLogout={handleLogout}
//           showMaleDropdown={showMaleDropdown}
//           setShowMaleDropdown={setShowMaleDropdown}
//           showFemaleDropdown={showFemaleDropdown}
//           setShowFemaleDropdown={setShowFemaleDropdown}
//           isMobileMenuOpen={isMobileMenuOpen}
//           setIsMobileMenuOpen={setIsMobileMenuOpen}
//         />

//         {/* Tablet Menu Component */}
//         <TabletMenu
//           userData={userData}
//           orderCount={orderCount}
//           handleLogout={handleLogout}
//           isMobileMenuOpen={isMobileMenuOpen}
//           setIsMobileMenuOpen={setIsMobileMenuOpen}
//           isMobileProfileOpen={isMobileProfileOpen}
//           setIsMobileProfileOpen={setIsMobileProfileOpen}
//         />

//         {/* Desktop Menu Component */}
//         <DesktopMenu
//           userData={userData}
//           orderCount={orderCount}
//           handleLogout={handleLogout}
//           showMaleDropdown={showMaleDropdown}
//           setShowMaleDropdown={setShowMaleDropdown}
//           showFemaleDropdown={showFemaleDropdown}
//           setShowFemaleDropdown={setShowFemaleDropdown}
//         />
//       </div>

//       {/* Desktop Dropdowns Component */}
//       <DesktopDropdowns
//         showMaleDropdown={showMaleDropdown}
//         setShowMaleDropdown={setShowMaleDropdown}
//         showFemaleDropdown={showFemaleDropdown}
//         setShowFemaleDropdown={setShowFemaleDropdown}
//       />

//       {/* Spacer */}
//       <div className="h-20"></div>
//     </div>
//   );
// };

// export default Menu;
