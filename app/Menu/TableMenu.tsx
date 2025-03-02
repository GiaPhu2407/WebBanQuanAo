import Link from "next/link";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MenuIcon } from "lucide-react";
import { MenuProps } from "@/app/Menu/type/menu";

interface TabletMenuProps
  extends Pick<
    MenuProps,
    | "userData"
    | "orderCount"
    | "handleLogout"
    | "isMobileMenuOpen"
    | "setIsMobileMenuOpen"
  > {
  isMobileProfileOpen: boolean;
  setIsMobileProfileOpen: (open: boolean) => void;
}

const TabletMenu: React.FC<TabletMenuProps> = ({
  userData,
  orderCount,
  handleLogout,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isMobileProfileOpen,
  setIsMobileProfileOpen,
}) => {
  return (
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
};

export default TabletMenu;
