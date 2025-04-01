"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  Grid,
  Image,
  Users,
  Settings,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PaymentChart from "@/app/Staff/DashBoard/component/linechart";

const menuItems = [
  {
    label: "Quản Lý Sản Phẩm",
    icon: Package,
    href: "/Staff/DashBoard/ProductManager",
  },
  {
    label: "Quản Lý Loại Sản Phẩm",
    icon: Package,
    href: "/Admin/Dashboard/LoaiSanPham",
  },
  {
    label: "Quản Lý Hình Ảnh",
    icon: Image,
    href: "/Admin/Dashboard/ManagerImage",
  },
  {
    label: "Cài Đặt",
    icon: Settings,
    href: "/staff/settings",
  },
];

const StaffSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <motion.div
      initial={{ width: 250 }}
      animate={{ width: isOpen ? 250 : 80 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-lg h-full relative overflow-hidden"
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 z-10 text-gray-600 hover:text-gray-900"
      >
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </button>

      <nav className="pt-16 px-4">
        {menuItems.map((item) => (
          <div key={item.label} className="mb-2">
            <Link
              href={item.href}
              className="flex items-center cursor-pointer p-2 hover:bg-gray-100 rounded"
            >
              <item.icon className="mr-3" />
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        ))}
      </nav>
    </motion.div>
  );
};

export default StaffSidebar;
