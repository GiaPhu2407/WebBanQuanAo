import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaMars, FaVenus } from "react-icons/fa";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MenuProps } from "@/app/Menu/type/menu";
import { ShoppingCart } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NotificationBell } from "@/components/ui/notification-bell";

interface DesktopMenuProps
  extends Pick<
    MenuProps,
    | "userData"
    | "orderCount"
    | "handleLogout"
    | "showMaleDropdown"
    | "setShowMaleDropdown"
    | "showFemaleDropdown"
    | "setShowFemaleDropdown"
  > {
  dropRef: any;
  isOverCart: boolean;
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({
  userData,
  orderCount,
  handleLogout,
  showMaleDropdown,
  setShowMaleDropdown,
  showFemaleDropdown,
  setShowFemaleDropdown,
  dropRef,
  isOverCart,
}) => {
  const [showDragTip, setShowDragTip] = useState(false);

  // Hiển thị thông báo mẹo khi người dùng mới vào trang
  useEffect(() => {
    const hasSeenTip = localStorage.getItem("hasSeenDragTip");
    if (!hasSeenTip) {
      setShowDragTip(true);
      const timer = setTimeout(() => {
        setShowDragTip(false);
        localStorage.setItem("hasSeenDragTip", "true");
      }, 8000); // Tự động ẩn sau 8 giây
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseTip = () => {
    setShowDragTip(false);
    localStorage.setItem("hasSeenDragTip", "true");
  };

  return (
    <div className="hidden lg:block">
      {showDragTip && (
        <div className="fixed top-16 right-4 z-50 w-64 animate-fade-in">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="flex items-center justify-between">
              <div className="text-sm text-blue-600">
                Mẹo: Bạn có thể kéo thả sản phẩm vào giỏ hàng để thêm nhanh
              </div>
              <Button
                variant="ghost"
                className="h-6 w-6 p-0 text-blue-500"
                onClick={handleCloseTip}
              >
                ✕
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex items-center justify-between h-full px-4">
        {/* Logo */}
        <Link href="/Show" className="text-xl font-bold mr-8">
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
          {/* Shopping Cart with Drop Zone */}
          <div className="dropdown dropdown-end relative">
            <Link href="/component/shopping">
              <div
                ref={dropRef}
                className={`relative p-2 transition-all duration-500 rounded-full cursor-pointer
                  ${isOverCart ? "bg-blue-100 scale-110" : ""}
                  hover:bg-blue-50
                `}
                style={{
                  transform: isOverCart ? "scale(1.1)" : "scale(1)",
                  transition: "all 0.5s ease-in-out",
                }}
              >
                <ShoppingCart
                  className={`h-6 w-6 transition-all duration-500
                    ${
                      isOverCart
                        ? "text-blue-600 animate-pulse"
                        : "text-current"
                    }
                  `}
                />
                <span
                  className={`absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs 
                    flex items-center justify-center transition-all duration-500
                    ${isOverCart ? "w-6 h-6 animate-bounce" : "w-5 h-5"}
                  `}
                >
                  {orderCount}
                </span>
                {isOverCart && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-blue-600 whitespace-nowrap font-medium">
                    Thả để thêm vào giỏ
                  </div>
                )}
              </div>
            </Link>

            {/* Tooltip hiển thị khi hover vào giỏ hàng */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 hidden group-hover:block">
              <div className="bg-white px-2 py-1 rounded shadow-md text-xs text-gray-700 whitespace-nowrap">
                Kéo và thả sản phẩm vào đây để thêm vào giỏ
              </div>
            </div>
          </div>
          <NotificationBell />
          {/* User Profile Section */}
          <div className="flex items-center">
            {userData ? (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={
                          userData?.avatar || "https://github.com/shadcn.png"
                        }
                        alt={userData?.Hoten || "User"}
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
                      <Avatar className="h-12 w-14">
                        <AvatarImage
                          src={
                            userData?.avatar || "https://github.com/shadcn.png"
                          }
                          alt={userData?.Hoten || "User"}
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
                      {userData.role?.Tennguoidung === "NhanVien" && (
                        <Link
                          href="/Staff/DashBoard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          StaffDashboard
                        </Link>
                      )}
                      <Link
                        href="/component/Yeuthich"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Yêu Thích
                      </Link>
                      <Link
                        href="/component/Order"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Xem Đơn Hàng
                      </Link>
                      <Link
                        href="/ChangePassword"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Đổi mật khẩu
                      </Link>
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
};

export default DesktopMenu;
