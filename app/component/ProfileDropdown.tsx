"use client";
import React, { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut } from "lucide-react";

interface ProfileDropdownProps {
  userData?: {
    username: string;
    fullname: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
  };
  onLogout: () => void;
  onProfileClick: () => void;
}

export default function ProfileDropdown({
  userData,
  onLogout,
  onProfileClick,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Simple loading state if userData is not available yet
  if (!userData) {
    return (
      <div className="relative">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none"
      >
        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
          <span className="text-indigo-600 font-semibold">
            {userData.username && userData.username.length > 0
              ? userData.username[0].toUpperCase()
              : "U"}
          </span>
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-700">
          {userData.fullname || "User"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {userData.fullname || "User"}
                </p>
                <p className="text-sm text-gray-500">
                  {userData.email || "N/A"}
                </p>
                <p className="text-xs text-indigo-600 mt-1">
                  {userData.role
                    ? userData.role.charAt(0).toUpperCase() +
                      userData.role.slice(1)
                    : "User"}
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 py-2">
            <div className="space-y-1">
              <button
                onClick={() => {
                  onProfileClick();
                  setIsOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <User className="h-4 w-4" />
                <span>Thông tin cá nhân</span>
              </button>
              <button className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                <Settings className="h-4 w-4" />
                <span>Cài đặt tài khoản</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
