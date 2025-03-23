import Link from "next/link";
import React, { useRef } from "react";
import { FaMars, FaVenus } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, ChevronDown, Info } from "lucide-react";
import { MenuProps, User, Product } from "@/app/Menu/type/menu";

interface MobileMenuProps
  extends Pick<
    MenuProps,
    | "userData"
    | "handleLogout"
    | "showMaleDropdown"
    | "setShowMaleDropdown"
    | "showFemaleDropdown"
    | "setShowFemaleDropdown"
    | "isMobileMenuOpen"
    | "setIsMobileMenuOpen"
  > {
  dropRef: React.RefObject<HTMLDivElement>;
  isOverCart: boolean;
  // Add the following props for long press functionality
  onProductLongPress?: (product: Product) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  userData,
  handleLogout,
  showMaleDropdown,
  setShowMaleDropdown,
  showFemaleDropdown,
  setShowFemaleDropdown,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  dropRef,
  isOverCart,
  onProductLongPress,
}) => {
  // Use refs to store touch data instead of dataset
  const touchStartTimeRef = useRef<number>(0);
  const touchPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentProductRef = useRef<Product | null>(null);

  // Mobile touch handlers for product cards
  const handleTouchStart = (product: Product, e: React.TouchEvent) => {
    // Store the current timestamp to calculate press duration
    touchStartTimeRef.current = Date.now();

    // Store the touch position to detect movement
    touchPositionRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };

    // Store the current product
    currentProductRef.current = product;

    // Clear any existing timeout
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }

    // Set up a timeout for the long press
    longPressTimeoutRef.current = setTimeout(() => {
      if (onProductLongPress && currentProductRef.current) {
        onProductLongPress(currentProductRef.current);
        // Provide haptic feedback when available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, 500); // 500ms for long press
  };

  const handleTouchEnd = () => {
    // Clear the long press timeout
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Get the current touch position
    const currentTouchX = e.touches[0].clientX;
    const currentTouchY = e.touches[0].clientY;

    // Calculate the distance moved
    const moveDistance = Math.sqrt(
      Math.pow(currentTouchX - touchPositionRef.current.x, 2) +
        Math.pow(currentTouchY - touchPositionRef.current.y, 2)
    );

    // If moved more than a small threshold, cancel the long press
    if (moveDistance > 10 && longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  // Render mobile user profile section
  const renderUserProfile = () => {
    if (!userData) {
      return (
        <div className="border-t border-gray-200 py-4">
          <Link href="/login" className="block px-4 py-2 hover:bg-gray-100">
            Login / Register
          </Link>
        </div>
      );
    }

    return (
      <div className="py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={userData?.avatar || "https://github.com/shadcn.png"}
              alt={userData?.Hoten || "User"}
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
          {renderUserProfile()}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
