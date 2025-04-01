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
import {
  MenuIcon,
  Bell,
  Search,
  User,
  LogOut,
  Home,
  Settings,
} from "lucide-react";
import AdminNotification from "@/app/component/AdminNotification";
import Notification from "@/app/component/Notification";
// import Noti from "./Noti";
import { NotificationBell } from "@/components/ui/notification-bell";

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
  const [showMaleDropdown, setShowMaleDropdown] = useState(false);
  const [showFemaleDropdown, setShowFemaleDropdown] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="fixed top-0 w-full z-50">
      <div className="bg-white w-full h-14 md:h-12 shadow-md">
        <div className="container mx-auto px-2 sm:px-4 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo and Dashboard Title */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <h1 className="font-Giaphu text-lg md:text-xl lg:text-2xl font-bold tracking-wider">
                DASHBOARD
              </h1>
            </div>

            {/* User Profile Section - Right side */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Search Button */}
              <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full">
                <Search className="h-4 w-4 md:h-5 md:w-5" />
              </button>

              {/* Notification Component */}
              <div className="hidden sm:block">
                <Notification />
              </div>
              <NotificationBell />

              {/* User Avatar and Menu */}
              {userData ? (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex items-center gap-1 md:gap-2 cursor-pointer">
                      <Avatar className="h-7 w-7 md:h-8 md:w-8 ring-2 ring-offset-1 md:ring-offset-2 ring-gray-200">
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
                    </div>
                  </HoverCardTrigger>

                  <HoverCardContent className="w-64 md:w-72 p-0">
                    <div className="p-3 md:p-4 border-b">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 md:h-12 w-10 md:w-12">
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
                    </div>
                    <div className="py-2">
                      <Link
                        href="/Show/ShowProfile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Hồ sơ cá nhân
                      </Link>
                      {userData.role?.Tennguoidung === "NhanVien" && (
                        <Link
                          href="/Profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <MenuIcon className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      )}
                      {userData.role?.Tennguoidung === "NhanVien" && (
                        <Link
                          href="/Show"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Home className="mr-2 h-4 w-4" />
                          Trang Chủ Bán Hàng
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ) : (
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs md:text-sm"
                  >
                    Đăng nhập
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button - Only visible on mobile */}
              <button
                className="md:hidden p-1.5 hover:bg-gray-100 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
              >
                <MenuIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Only visible when toggled on mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t animate-in slide-in-from-top duration-300">
          <div className="py-2 px-4">
            <div className="sm:hidden mb-2">
              <Notification />
            </div>
            <Link
              href="/Show"
              className="flex items-center py-2.5 hover:bg-gray-100 rounded px-2"
            >
              <Home className="mr-2 h-5 w-5" />
              <span>Trang Chủ</span>
            </Link>
            {userData?.role?.Tennguoidung === "Admin" && (
              <Link
                href="/Admin/orders"
                className="flex items-center py-2.5 hover:bg-gray-100 rounded px-2"
              >
                <FaBagShopping className="mr-2 h-5 w-5" />
                <span>Đơn Hàng</span>
                {orderCount > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {orderCount}
                  </span>
                )}
              </Link>
            )}
            <Link
              href="/Admin/settings"
              className="flex items-center py-2.5 hover:bg-gray-100 rounded px-2"
            >
              <Settings className="mr-2 h-5 w-5" />
              <span>Cài Đặt</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
