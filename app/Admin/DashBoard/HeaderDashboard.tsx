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
import { MenuIcon } from "lucide-react";
import AdminNotification from "@/app/component/AdminNotification";

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

  return (
    <div>
      <div className="bg-white w-full h-20 shadow fixed">
        <div className="flex items-center justify-center h-full gap-[1000px]">
          {/* Main Navigation */}
          <h1 className="font-Giaphu">DASHBOARD</h1>

          {/* User Profile Section */}
          <div className="flex items-center gap-4">
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
                    <Button variant="destructive" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </HoverCardTrigger>
                <AdminNotification />

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
                      {userData.role?.Tennguoidung === "Admin" && (
                        <Link
                          href="/Show"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Trang Chủ Bán Hàng
                        </Link>
                      )}
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
};

export default Menu;
