import Link from "next/link";
import React from "react";
import { FaMars, FaVenus } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, ChevronDown } from "lucide-react";
import { MenuProps, User } from "@/app/Menu/type/menu";

interface MobileMenuProps extends Pick<MenuProps, 
  'userData' | 
  'handleLogout' | 
  'showMaleDropdown' | 
  'setShowMaleDropdown' | 
  'showFemaleDropdown' | 
  'setShowFemaleDropdown' | 
  'isMobileMenuOpen' | 
  'setIsMobileMenuOpen'
> {}

const MobileMenu: React.FC<MobileMenuProps> = ({
  userData,
  handleLogout,
  showMaleDropdown,
  setShowMaleDropdown,
  showFemaleDropdown,
  setShowFemaleDropdown,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
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

  return (
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
};

export default MobileMenu;