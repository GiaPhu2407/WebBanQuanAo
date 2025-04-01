"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
  ArrowUpRight,
  DollarSign,
  Loader2,
  Menu as MenuIcon,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Globe from "./Footer/Globe";
import Menu from "./DashBoard/HeaderDashboard";

// Types
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
  isLoading?: boolean;
}

interface SalesDataPoint {
  name: string;
  sales: number;
  revenue: number;
  profit: number;
}

interface SidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
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

interface ApiResponse {
  error?: string;
  count?: number;
}

// StatsCard Component
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  isLoading = false,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    {isLoading ? (
      <div className="flex items-center justify-center h-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    ) : (
      <>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
          <div
            className={`p-3 rounded-full ${
              trend === "up" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {icon}
          </div>
        </div>
        {trendValue && (
          <div className="mt-4 flex items-center">
            <ArrowUpRight
              className={trend === "up" ? "text-green-500" : "text-red-500"}
              size={16}
            />
            <span
              className={`ml-1 text-sm ${
                trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {trendValue}
            </span>
            <span className="text-gray-500 text-sm ml-1">vs last month</span>
          </div>
        )}
      </>
    )}
  </div>
);

// Sidebar components
const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  onClick,
  isExpanded,
}) => (
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

const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  icon,
  isOpen,
  onToggle,
  children,
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

// Main Dashboard Component
const SalesDashboard: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // State for metrics
  const [metrics, setMetrics] = useState({
    totalReservations: 0,
    pendingReservations: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalUsers: 0,
  });

  // State for sidebar sections
  const [openSections, setOpenSections] = useState<OpenSections>({
    products: false,
    customers: false,
    orders: false,
    staff: false,
  });

  // Sample sales data
  const salesData: SalesDataPoint[] = [
    { name: "Jan", sales: 4000, revenue: 2400, profit: 2400 },
    { name: "Feb", sales: 3000, revenue: 1398, profit: 2210 },
    { name: "Mar", sales: 2000, revenue: 9800, profit: 2290 },
    { name: "Apr", sales: 2780, revenue: 3908, profit: 2000 },
    { name: "May", sales: 1890, revenue: 4800, profit: 2181 },
    { name: "Jun", sales: 2390, revenue: 3800, profit: 2500 },
    { name: "Jul", sales: 3490, revenue: 4300, profit: 2100 },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarExpansion = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const toggleSection = (section: keyof OpenSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Helper function to fetch and process API responses
        const fetchAndValidate = async (url: string): Promise<number> => {
          console.log(`Fetching from ${url}...`); // Log URL đang fetch
          const response = await fetch(url);

          if (!response.ok) {
            console.error(`Error with ${url}:`, response.statusText);
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log(`Data received from ${url}:`, data); // Log data nhận được

          if (typeof data === "number") {
            return data;
          } else if (data && typeof data.count === "number") {
            return data.count;
          } else {
            console.error(`Invalid data format from ${url}:`, data);
            return 0;
          }
        };

        const results = await Promise.all([
          fetchAndValidate("/api/tongthanhtoancxn"),
          fetchAndValidate("/api/tongdoanhthu"),
          fetchAndValidate("/api/tongdonhang"),
          fetchAndValidate("/api/tongdonhangcxn"),
          fetchAndValidate("/api/tongkhachhang"),
        ]);

        console.log("All results:", results); // Log tất cả kết quả

        setMetrics({
          totalReservations: results[0],
          pendingReservations: results[1],
          totalOrders: results[2],
          pendingOrders: results[3],
          totalUsers: results[4],
        });
      } catch (error) {
        console.error("Detailed error:", error); // Log chi tiết lỗi
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      setSidebarOpen(false);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
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
            {/* <SidebarItem
              icon={<ShoppingBag size={18} />}
              label="Sản phẩm"
              onClick={() => router.push("/Admin/DashBoard/ProductManager")}
              isExpanded={sidebarExpanded}
            /> */}
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
              icon={<Tags size={18} />}
              label="Hình ảnh"
              onClick={() => router.push("/Admin/DashBoard/ManagerImage")}
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
              icon={<Heart size={18} />}
              label="Yêu thích"
              onClick={() => router.push("/wishlist")}
              isExpanded={sidebarExpanded}
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

          {/* Staff Management Section */}
          <SidebarSection
            title="Quản Lý Nhân Viên"
            icon={<Users size={20} />}
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
                  icon={<Tags size={18} />}
                  label="Hình ảnh"
                  onClick={() => router.push("/Admin/DashBoard/ManagerImage")}
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
                  label="Yêu thích"
                  onClick={() => router.push("/wishlist")}
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

              {/* Mobile Staff Management Section */}
              <SidebarSection
                title="Quản Lý Nhân Viên"
                icon={<Users size={20} />}
                isOpen={openSections.staff}
                onToggle={() => toggleSection("staff")}
                isExpanded={true}
              >
                <SidebarItem
                  icon={<ShoppingBag size={18} />}
                  label="Ca Làm Việc"
                  onClick={() => router.push("/Admin/DashBoard/CaLamViec")}
                  isExpanded={true}
                />
                <SidebarItem
                  icon={<CreditCard size={18} />}
                  label="Tính Lương"
                  onClick={() => router.push("/Admin/DashBoard/TinhLuong")}
                  isExpanded={true}
                />
              </SidebarSection>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 pt-14 transition-all duration-300 ease-in-out ${
          sidebarExpanded ? "md:ml-64" : "md:ml-16"
        }`}
      >
        <div className="p-8 relative z-10">
          <div className="absolute -z-10 top-0 left-[600px]">
            <Globe />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 mb-8 w-[500px]">
              <StatsCard
                title="Tổng Thanh toán Đang xử lý"
                value={metrics.totalReservations.toString()}
                icon={<DollarSign size={24} className="text-green-500" />}
                trend="up"
                trendValue="12%"
                isLoading={isLoading}
              />
              <StatsCard
                title="Tổng đơn đã thanh toán"
                value={metrics.pendingReservations.toString()}
                icon={<DollarSign size={24} className="text-yellow-500" />}
                isLoading={isLoading}
              />
              <StatsCard
                title="Tổng Đơn Hàng"
                value={metrics.totalOrders.toString()}
                icon={<ShoppingCart size={24} className="text-blue-500" />}
                trend="up"
                trendValue="8%"
                isLoading={isLoading}
              />
              <StatsCard
                title="Tổng Đơn Hàng Pending"
                value={metrics.pendingOrders.toString()}
                icon={<ShoppingCart size={24} className="text-orange-500" />}
                isLoading={isLoading}
              />
              <StatsCard
                title="Tổng Users"
                value={metrics.totalUsers.toString()}
                icon={<Users size={24} className="text-purple-500" />}
                trend="up"
                trendValue="15%"
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#8884d8"
                        name="Sales"
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#82ca9d"
                        name="Revenue"
                      />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        stroke="#ffc658"
                        name="Profit"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalesDashboard;
