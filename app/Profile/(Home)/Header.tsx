"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

// import { useAuth, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/app/types/auth";
const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  // const { userId } = useAuth();
  const [user, setUser] = useState<UserAuth | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const router = useRouter();
  const refreshData = () => {
    setReloadKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    fetch("api/auth/session")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch session");
        return response.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Failed to fetch session", error);
      });
  }, []);
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div
    //className={`bg-white dark:bg-gray-400 -mt-24 flex flex-col items-center p-[30px_152px_125px_152px] w-full box-sizing-border ${
    //userId ? "hidden" : "block"
    //}`}
    >
      <div className="m-[0_0_98px_0] flex flex-row justify-between items-center gap-10 w-[1286px] max-w-full box-sizing-border mb-96">
        <div className="flex flex-row items-center gap-2">
          {/* <img className="w-[37px] h-[36.8px]" alt="" />
          <img className="w-[14.9px] h-[16.6px]" alt="" />
          <div className="bg-[var(--gray-900,#18181B)] w-[2.8px] h-[16.3px]"></div>
          <img className="w-[10.4px] h-[12.3px]" alt="" />
          <img className="w-[6.5px] h-[11.9px]" alt="" />
          <img className="w-[2.8px] h-[16.1px]" alt="" />
          <img className="w-[7.6px] h-[14.5px]" alt="" />
          <img className="w-[12.2px] h-[16.5px]" alt="" />
          <img className="w-[12.8px] h-[16.3px]" alt="" /> */}
          {/* <div className="bg-[var(--gray-900,#18181B)] w-[2.9px] h-[16.1px]"></div> */}
        </div>
        <nav className=" border-gray-200 dark:bg-gray-900 absolute top-0 left-0 w-full text-center">
          <div className="flex flex-wrap items-center justify-between max-w-screen-xl mx-auto p-4">
            <a
              href="https://flowbite.com"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <img
                src="https://logo-suggestion.renderforest.com/suggestions-images/0008/a533/0008a533e7d0fdc0dd2cb35fb5194474.png"
                className="h-20"
                alt="Flowbite Logo"
              />
            </a>
            <div className="flex justify-center items-center md:order-2 space-x-1 md:space-x-2 rtl:space-x-reverse">
              <div>
                {/* {!user ? ( */}
                <div className="flex gap-5">
                  <Link
                    href="/Login"
                    className="btn transition-all duration-500 bg-green-400 hover:text-red-500 px-4 w-20 sm:w-28 "
                  >
                    Login
                  </Link>
                  <Link
                    href="/Register"
                    className="btn transition-all duration-500 hover:text-red-500 bg-blue-400 px-5 w-20 sm:w-28"
                  >
                    Register
                  </Link>
                </div>
                {/* ) : ( */}
                {/* <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        {user.Hoten?.[0] || user.Tentaikhoan?.[0] || "U"}
                      </div>
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                        {user.role?.TenNguoiDung === "Admin" && (
                          <Link
                            href="/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )} */}
              </div>
              <button
                data-collapse-toggle="mega-menu-icons"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="mega-menu-icons"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            </div>
            <div
              id="mega-menu-icons"
              className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            >
              <ul className="flex flex-col mt-4 font-medium md:flex-row md:mt-0 md:space-x-8 rtl:space-x-reverse">
                <li>
                  <Link
                    href={"/"}
                    className="block py-2 px-3 text-black border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-blue-500 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                    aria-current="page"
                  >
                    TRANG CHỦ
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/ShowIntro"}
                    className="block py-2 px-3 text-black border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-blue-500 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                    aria-current="page"
                  >
                    GIỚI THIỆU
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/ShowBlog"}
                    className="block py-2 px-3 text-black border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-blue-500 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                    aria-current="page"
                  >
                    BLOG
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/ShowContact"}
                    className="block py-2 px-3 text-black border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-blue-500 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                    aria-current="page"
                  >
                    LIÊN HỆ
                  </Link>
                </li>

                {/* <li>
                    <Link
                      href={"/ShowMeeting"}
                      className="block py-2 px-3 text-black border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                    >
                      Meeting&Event
                    </Link>
                  </li> */}
              </ul>
            </div>
          </div>
        </nav>
        {/* <div className="rounded-[8px] border-2 border-[var(--blue-900,#0F172A)] p-[11px_16px] cursor-pointer">
          <span className="font-['Inter'] font-semibold text-[16px] text-[var(--blue-900,#0F172A)]">
            Start free trial
          </span>
        </div> */}

        {/* <div className="menu-container flex  h-full">
          
          <div className="ml-20">
            <ModeToggle />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Header;
