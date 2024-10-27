"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaBagShopping } from "react-icons/fa6";
import { FaMars, FaVenus } from "react-icons/fa"; // Importing icons
import { UserButton } from "@clerk/nextjs";
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
const Menu = () => {
  const [showMaleDropdown, setShowMaleDropdown] = useState(false);
  const [showFemaleDropdown, setShowFemaleDropdown] = useState(false);

  const AddProducttoCard = () => {
    // const payLoad = {
    //   idsanpham,
    //   tensanpham,
    //   hinhanh,
    // };
  };

  return (
    <div>
      <div className="bg-white w-full h-20 shadow fixed z-[99]">
        <div className="flex items-center justify-center h-full">
          <div className="flex gap-10 content-center">
            <ul className="flex gap-10 content-center ">
              <li>
                <Link href={""}>Sale</Link>
              </li>
              <li>
                <Link href={""}>Mới về</Link>
              </li>
              <li>
                <Link href={""}>Bán chạy</Link>
              </li>
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
                <Link href={""}>Trẻ Em</Link>
              </li>
              <li>
                <Link href={""}>Bộ sưu tập</Link>
              </li>
              <li>
                <Link href={""}>Đồng phục</Link>
              </li>
              <li>
                <Link href={""}>Tin Hot</Link>
              </li>
            </ul>
          </div>
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
          <div className="" onClick={AddProducttoCard}>
            <FaBagShopping className="ml-5 text-2xl text-rose-500" />
          </div>
          <div className="ml-10 mt-[4px]">
            <UserButton />
          </div>
        </div>
      </div>

      {/* Spacer to push content down */}
      <div className="h-20"></div>

      {/* Dropdown for "Nam" */}
      <div
        onMouseLeave={() => setShowMaleDropdown(false)}
        className={`${
          showMaleDropdown
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full"
        } bg-white w-full h-[300px] shadow fixed top-20 transition-all duration-300 ease-in-out transform z-20`}
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

      {/* Dropdown for "Nữ" */}
      <div
        onMouseLeave={() => setShowFemaleDropdown(false)}
        className={`${
          showFemaleDropdown
            ? "opacity-100 translate-y-0 "
            : "opacity-0 -translate-y-full"
        } bg-white w-full h-[300px] shadow fixed top-20 transition-all duration-300 ease-in-out transform z-20`}
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
