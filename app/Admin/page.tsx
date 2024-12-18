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
} from "lucide-react";
import Globe from "./Footer/Globe";

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
  children: React.ReactNode;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
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

// Sidebar Item Component
const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center space-x-2 px-4 py-2  hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
  >
    {icon}
    <span>{label}</span>
  </button>
);

// Sidebar Section Component
const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}) => (
  <div className="space-y-2">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-2 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
    >
      <div className="flex items-center space-x-2">
        {icon}
        <span>{title}</span>
      </div>
      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
    {isOpen && <div className="ml-4 space-y-1">{children}</div>}
  </div>
);

// Main Dashboard Component
const SalesDashboard: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for metrics
  const [metrics, setMetrics] = useState({
    // totalReservations: 0,
    pendingReservations: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalUsers: 0,
  });

  // State for sidebar sections
  const [openSections, setOpenSections] = useState({
    products: true,
    customers: false,
    orders: false,
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

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchAndValidate = async (url: string) => {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          return Number(data);
        };

        const [
          // totalReservations,
          pendingReservations,
          totalOrders,
          pendingOrders,
          totalUsers,
        ] = await Promise.all([
          // fetchAndValidate("/api/tongdondatcoccxn"),
          fetchAndValidate("/api/tongdoanhthu"),
          fetchAndValidate("/api/tongdonhang"),
          fetchAndValidate("/api/tongdonhangcxn"),
          fetchAndValidate("/api/tongkhachhang"),
        ]);

        setMetrics({
          // totalReservations,
          pendingReservations,
          totalOrders,
          pendingOrders,
          totalUsers,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle sidebar sections
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="flex min-h-screen  ">
      {/* Sidebar */}
      <nav className="w-72 font-semibold p-4 space-y-2">
        <SidebarSection
          title="Quản Lý Sản Phẩm"
          icon={<Package size={18} />}
          isOpen={openSections.products}
          onToggle={() => toggleSection("products")}
        >
          <SidebarItem
            icon={<Tags size={16} />}
            label="Category"
            onClick={() => router.push("/category")}
          />
          <SidebarItem
            icon={<Tags size={16} />}
            label="Product Type"
            onClick={() => router.push("/Admin/DashBoard/LoaiSanPham")}
          />
          <SidebarItem
            icon={<ShoppingBag size={16} />}
            label="Product"
            onClick={() => router.push("/Admin/DashBoard/ProductManager")}
          />
          <SidebarItem
            icon={<Truck size={16} />}
            label="Supplier"
            onClick={() => router.push("/Admin/DashBoard/Nhacungcap")}
          />
          <SidebarItem
            icon={<Award size={16} />}
            label="User"
            onClick={() => router.push("/Admin/DashBoard/ManagerUser")}
          />
          <SidebarItem
            icon={<Tags size={16} />}
            label="Image"
            onClick={() => router.push("/Admin/DashBoard/ManagerImage")}
          />
        </SidebarSection>

        <SidebarSection
          title="Quản Lý Khách Hàng"
          icon={<Users size={18} />}
          isOpen={openSections.customers}
          onToggle={() => toggleSection("customers")}
        >
          <SidebarItem
            icon={<User size={16} />}
            label="Customer"
            onClick={() => router.push("/customer")}
          />
          <SidebarItem
            icon={<ShoppingCart size={16} />}
            label="Cart"
            onClick={() => router.push("/cart")}
          />
          <SidebarItem
            icon={<Heart size={16} />}
            label="Wishlist"
            onClick={() => router.push("/wishlist")}
          />
        </SidebarSection>

        <SidebarSection
          title="Quản Lý Đơn Hàng"
          icon={<ShoppingBag size={18} />}
          isOpen={openSections.orders}
          onToggle={() => toggleSection("orders")}
        >
          <SidebarItem
            icon={<ShoppingBag size={16} />}
            label="Order"
            onClick={() => router.push("/order")}
          />
          <SidebarItem
            icon={<CreditCard size={16} />}
            label="Payment"
            onClick={() => router.push("/payment")}
          />
          <SidebarItem
            icon={<RotateCcw size={16} />}
            label="Return"
            onClick={() => router.push("/return")}
          />
        </SidebarSection>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative ">
       
       
        <div className="p-8 relative z-10 top-0">
          <div  className="absolute -z-10 top-0 left-[600px]"> 
          <Globe/>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 mb-8 w-[500px]">
               {/* <StatsCard
                title="Tổng Đơn Đặt Cọc"
                // value={metrics.totalReservations.toString()}
                icon={<DollarSign size={24} className="text-green-500" />}
                trend="up"
                trendValue="12%"
                isLoading={isLoading}
              /> */}
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
      </div>
    </div>
  );
};

export default SalesDashboard;
