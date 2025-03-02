import Link from "next/link";
import React from "react";
import { FaMars, FaVenus } from "react-icons/fa";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MenuProps } from "@/app/Menu/type/menu";

interface DesktopMenuProps extends Pick<MenuProps, 
  'userData' | 
  'orderCount' | 
  'handleLogout' | 
  'showMaleDropdown' | 
  'setShowMaleDropdown' | 
  'showFemaleDropdown' | 
  'setShowFemaleDropdown'
> {}

const DesktopMenu: React.FC<DesktopMenuProps> = ({
  userData,
  orderCount,
  handleLogout,
  showMaleDropdown,
  setShowMaleDropdown,
  showFemaleDropdown,
  setShowFemaleDropdown,
}) => {
  return (
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
              <Link href="/sale" className="hover:text-gray-600 transition-colors">
                Sale
              </Link>
            </li>
            <li>
              <Link href="/new-arrivals" className="hover:text-gray-600 transition-colors">
                Mới về
              </Link>
            </li>
            <li>
              <Link href="/bestsellers" className="hover:text-gray-600 transition-colors">
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
              <Link href="/children" className="hover:text-gray-600 transition-colors">
                Trẻ Em
              </Link>
            </li>
            <li>
              <Link href="/collections" className="hover:text-gray-600 transition-colors">
                Bộ sưu tập
              </Link>
            </li>
            <li>
              <Link href="/uniform" className="hover:text-gray-600 transition-colors">
                Đồng phục
              </Link>
            </li>
            <li>
              <Link href="/hot-news" className="hover:text-gray-600 transition-colors">
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
                    <div className="text-sm font-medium">
                      {userData.Hoten}
                    </div>
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
};

export default DesktopMenu;