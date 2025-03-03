import Link from "next/link";
import React from "react";
import { MenuProps } from "@/app/Menu/type/menu";

interface DesktopDropdownsProps
  extends Pick<
    MenuProps,
    | "showMaleDropdown"
    | "setShowMaleDropdown"
    | "showFemaleDropdown"
    | "setShowFemaleDropdown"
  > {}

const DesktopDropdowns: React.FC<DesktopDropdownsProps> = ({
  showMaleDropdown,
  setShowMaleDropdown,
  showFemaleDropdown,
  setShowFemaleDropdown,
}) => {
  return (
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
};

export default DesktopDropdowns;
