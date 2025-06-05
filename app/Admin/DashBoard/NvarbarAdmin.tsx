"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingCart,
  Package,
  ChevronDown,
  ChevronUp,
  Heart,
  Users,
  ShoppingBag,
  CreditCard,
  RotateCcw,
  Tags,
  Truck,
  Award,
  Menu as MenuIcon,
  X,
  ChevronRight,
  ChevronLeft,
  Star,
  Calendar,
} from "lucide-react";
import Menu from "./HeaderDashboard";

// Interfaces
interface SidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  isExpanded: boolean;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isExpanded: boolean;
}

interface OpenSections {
  products: boolean;
  customers: boolean;
  orders: boolean;
  staff: boolean;
}

interface SalesDashboardProps {
  onSidebarToggle?: (expanded: boolean) => void;
}

// Sidebar Section Component
const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  icon,
  children,
  isOpen,
  onToggle,
  isExpanded,
}) => {
  return (
    <div className="text-gray-600">
      <button
        onClick={onToggle}
        className={`w-full flex items-center ${
          isExpanded ? "px-4" : "px-2 justify-center"
        } py-2 hover:bg-gray-100 transition-colors rounded-md`}
        title={!isExpanded ? title : ""}
      >
        <span className={isExpanded ? "mr-3" : ""}>{icon}</span>
        {isExpanded && (
          <span className="flex-1 text-sm font-medium">{title}</span>
        )}
        {children && isExpanded && (
          <span className="ml-2">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        )}
      </button>
      {children && isOpen && isExpanded && (
        <div className="ml-8 space-y-1 mt-1">{children}</div>
      )}
    </div>
  );
};

// Sidebar Item Component
const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  onClick,
  isExpanded,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center ${
        isExpanded ? "px-4 justify-start" : "px-2 justify-center"
      } py-2 text-gray-600 hover:bg-gray-100 transition-colors rounded-md text-sm`}
      title={!isExpanded ? label : ""}
    >
      <span className={isExpanded ? "mr-3" : ""}>{icon}</span>
      {isExpanded && <span>{label}</span>}
    </button>
  );
};

const SalesDashboard: React.FC<SalesDashboardProps> = ({ onSidebarToggle }) => {
  const router = useRouter();
  const [openSections, setOpenSections] = useState<OpenSections>({
    products: false,
    customers: false,
    orders: false,
    staff: false,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarExpansion = () => {
    const newExpandedState = !sidebarExpanded;
    setSidebarExpanded(newExpandedState);

    // Notify parent component about sidebar state changes
    if (onSidebarToggle) {
      onSidebarToggle(newExpandedState);
    }

    // Dispatch a custom event for components that aren't directly connected
    const event = new CustomEvent("sidebarToggle", {
      detail: { expanded: newExpandedState },
    });
    window.dispatchEvent(event);
  };

  const toggleSection = (section: keyof OpenSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    const handleRouteChange = () => {
      setSidebarOpen(false);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  // Notify parent about initial state when component mounts
  useEffect(() => {
    if (onSidebarToggle) {
      onSidebarToggle(sidebarExpanded);
    }
  }, []);

  return (
    <div className="flex bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <Menu />
      </header>

      {/* Desktop Sidebar */}
      <nav
        className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-white shadow-md transition-all duration-300 ease-in-out z-40 ${
          sidebarExpanded ? "w-64" : "w-16"
        } hidden md:block`}
      >
        {/* Expand/Collapse Button */}
        <div className="flex justify-end p-2">
          <button
            onClick={toggleSidebarExpansion}
            className="p-1 rounded-full hover:bg-gray-100"
            title={sidebarExpanded ? "Thu gọn" : "Mở rộng"}
          >
            {sidebarExpanded ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        </div>

        <div className="p-2 space-y-2">
          {/* Product Management Section */}
          <SidebarSection
            title="Quản Lý Sản Phẩm"
            icon={<Package size={20} />}
            isOpen={openSections.products}
            onToggle={() => toggleSection("products")}
            isExpanded={sidebarExpanded}
          >
            <SidebarItem
              icon={<Tags size={18} />}
              label="Loại sản phẩm"
              onClick={() => router.push("/Admin/DashBoard/LoaiSanPham")}
              isExpanded={sidebarExpanded}
            />
            <SidebarItem
              icon={<ShoppingBag size={18} />}
              label="Sản phẩm"
              onClick={() => router.push("/Admin/DashBoard/ProductManager")}
              isExpanded={sidebarExpanded}
            />
            <SidebarItem
              icon={<Truck size={18} />}
              label="Nhà cung cấp"
              onClick={() => router.push("/Admin/DashBoard/Nhacungcap")}
              isExpanded={sidebarExpanded}
            />
            <SidebarItem
              icon={<Award size={18} />}
              label="Người dùng"
              onClick={() => router.push("/Admin/DashBoard/ManagerUser")}
              isExpanded={sidebarExpanded}
            />
            <SidebarItem
              icon={<Award size={18} />}
              label="Hình ảnh"
              onClick={() => router.push("/Admin/DashBoard/ManagerImage")}
              isExpanded={sidebarExpanded}
            />
            <SidebarItem
              icon={<Award size={18} />}
              label="Đánh giá"
              onClick={() => router.push("/Admin/DashBoard/ReviewManagement")}
              isExpanded={sidebarExpanded}
            />
          </SidebarSection>

          {/* Customer Management Section */}
          <SidebarSection
            title="Quản Lý Khách Hàng"
            icon={<Users size={20} />}
            isOpen={openSections.customers}
            onToggle={() => toggleSection("customers")}
            isExpanded={sidebarExpanded}
          >
            <SidebarItem
              icon={<User size={18} />}
              label="Khách hàng"
              onClick={() => router.push("/customer")}
              isExpanded={sidebarExpanded}
            />
            <SidebarItem
              icon={<ShoppingCart size={18} />}
              label="Giỏ hàng"
              onClick={() => router.push("/cart")}
              isExpanded={sidebarExpanded}
            />
            <SidebarItem
              icon={<Star size={18} />}
              label="Đánh giá"
              onClick={() => router.push("/Admin/ManagerEvaluate")}
              isExpanded={true}
            />
          </SidebarSection>

          {/* Order Management Section */}
          <SidebarSection
            title="Quản Lý Đơn Hàng"
            icon={<ShoppingBag size={20} />}
            isOpen={openSections.orders}
            onToggle={() => toggleSection("orders")}
            isExpanded={sidebarExpanded}
          >
            <SidebarItem
              icon={<ShoppingBag size={18} />}
              label="Đơn hàng"
              onClick={() => router.push("/Admin/DashBoard/ManagerDonhang")}
              isExpanded={sidebarExpanded}
            />
            <SidebarItem
              icon={<CreditCard size={18} />}
              label="Thanh toán"
              onClick={() => router.push("/Admin/DashBoard/Managerpayment")}
              isExpanded={sidebarExpanded}
            />
            <SidebarItem
              icon={<RotateCcw size={18} />}
              label="Trả hàng"
              onClick={() => router.push("/return")}
              isExpanded={sidebarExpanded}
            />
          </SidebarSection>

          <SidebarSection
            title="Quản Lý Nhân Viên"
            icon={<ShoppingBag size={20} />}
            isOpen={openSections.staff}
            onToggle={() => toggleSection("staff")}
            isExpanded={sidebarExpanded}
          >
            <SidebarItem
              icon={<ShoppingBag size={18} />}
              label="Ca Làm Việc"
              onClick={() => router.push("/Admin/DashBoard/CaLamViec")}
              isExpanded={sidebarExpanded}
            />
            <SidebarItem
              icon={<CreditCard size={18} />}
              label="Tính Lương"
              onClick={() => router.push("/Admin/DashBoard/TinhLuong")}
              isExpanded={sidebarExpanded}
            />
            <SidebarItem
              icon={<Calendar size={18} />}
              label="Lịch Làm Việc"
              onClick={() => router.push("/Admin/LichLamViec")}
              isExpanded={sidebarExpanded}
            />
          </SidebarSection>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-16 left-4 z-50 md:hidden bg-white p-2 rounded-md shadow-md"
      >
        <MenuIcon size={24} />
      </button>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50"
            onClick={toggleSidebar}
          />
          <nav className="fixed left-0 top-14 w-64 h-[calc(100vh-3.5rem)] bg-white shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-bold text-lg">Menu</h2>
              <button onClick={toggleSidebar} className="p-1">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {/* Mobile Product Management Section */}
              <SidebarSection
                title="Quản Lý Sản Phẩm"
                icon={<Package size={20} />}
                isOpen={openSections.products}
                onToggle={() => toggleSection("products")}
                isExpanded={true}
              >
                <SidebarItem
                  icon={<Tags size={18} />}
                  label="Loại sản phẩm"
                  onClick={() => router.push("/Admin/DashBoard/LoaiSanPham")}
                  isExpanded={true}
                />
                <SidebarItem
                  icon={<ShoppingBag size={18} />}
                  label="Sản phẩm"
                  onClick={() => router.push("/Admin/DashBoard/ProductManager")}
                  isExpanded={true}
                />
                <SidebarItem
                  icon={<Truck size={18} />}
                  label="Nhà cung cấp"
                  onClick={() => router.push("/Admin/DashBoard/Nhacungcap")}
                  isExpanded={true}
                />
                <SidebarItem
                  icon={<Award size={18} />}
                  label="Người dùng"
                  onClick={() => router.push("/Admin/DashBoard/ManagerUser")}
                  isExpanded={true}
                />
                <SidebarItem
                  icon={<Award size={18} />}
                  label="Đánh giá"
                  onClick={() =>
                    router.push("/Admin/DashBoard/ReviewManagement")
                  }
                  isExpanded={true}
                />
              </SidebarSection>

              {/* Mobile Customer Management Section */}
              <SidebarSection
                title="Quản Lý Khách Hàng"
                icon={<Users size={20} />}
                isOpen={openSections.customers}
                onToggle={() => toggleSection("customers")}
                isExpanded={true}
              >
                <SidebarItem
                  icon={<User size={18} />}
                  label="Khách hàng"
                  onClick={() => router.push("/customer")}
                  isExpanded={true}
                />
                <SidebarItem
                  icon={<ShoppingCart size={18} />}
                  label="Giỏ hàng"
                  onClick={() => router.push("/cart")}
                  isExpanded={true}
                />
                <SidebarItem
                  icon={<Heart size={18} />}
                  label="Đánh giá"
                  onClick={() => router.push("/Admin/ManagerEvaluate")}
                  isExpanded={true}
                />
              </SidebarSection>

              {/* Mobile Order Management Section */}
              <SidebarSection
                title="Quản Lý Đơn Hàng"
                icon={<ShoppingBag size={20} />}
                isOpen={openSections.orders}
                onToggle={() => toggleSection("orders")}
                isExpanded={true}
              >
                <SidebarItem
                  icon={<ShoppingBag size={18} />}
                  label="Đơn hàng"
                  onClick={() => router.push("/Admin/DashBoard/ManagerDonhang")}
                  isExpanded={true}
                />
                <SidebarItem
                  icon={<CreditCard size={18} />}
                  label="Thanh toán"
                  onClick={() => router.push("/Admin/DashBoard/Managerpayment")}
                  isExpanded={true}
                />
                <SidebarItem
                  icon={<RotateCcw size={18} />}
                  label="Trả hàng"
                  onClick={() => router.push("/return")}
                  isExpanded={true}
                />
              </SidebarSection>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content - We don't need this in the component version as it will be provided by the parent */}
    </div>
  );
};

export default SalesDashboard;
