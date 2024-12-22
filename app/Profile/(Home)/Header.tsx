"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import hinh from "@/app/image/hinhlogo.png";
import { useRouter } from "next/navigation";
import { User } from "@/app/types/auth";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

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
    <header className="bg-white shadow fixed w-full z-50 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <Image
                src={hinh}
                alt="Logo"
                width={150}
                height={100}
                className="h-auto w-auto max-h-12 md:max-h-16 animate-borderrun rounded-full"
              />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/" className="text-gray-900 hover:text-blue-600 font-medium">
              TRANG CHỦ
            </Link>
            <Link href="/ShowIntro" className="text-gray-900 hover:text-blue-600 font-medium">
              GIỚI THIỆU
            </Link>
            <Link href="/ShowBlog" className="text-gray-900 hover:text-blue-600 font-medium">
              BLOG
            </Link>
            <Link href="/ShowContact" className="text-gray-900 hover:text-blue-600 font-medium">
              LIÊN HỆ
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/Login" className="btn btn-outline btn-success">
              Login
            </Link>
            <Link href="/Register" className="btn btn-outline btn-info">
              Register
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50"
            >
              TRANG CHỦ
            </Link>
            <Link
              href="/ShowIntro"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50"
            >
              GIỚI THIỆU
            </Link>
            <Link
              href="/ShowBlog"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50"
            >
              BLOG
            </Link>
            <Link
              href="/ShowContact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50"
            >
              LIÊN HỆ
            </Link>
            <div className="pt-4 flex flex-col space-y-2">
              <Link href="/Login" className="btn btn-outline btn-success w-full">
                Login
              </Link>
              <Link href="/Register" className="btn btn-outline btn-info w-full">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;