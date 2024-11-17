"use client";
import React, { useState } from "react";
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
  AreaChart,
  Area,
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
  TrendingUp,
} from "lucide-react";

// Interfaces
interface SidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
}

interface OpenSections {
  products: boolean;
  customers: boolean;
  orders: boolean;
}

interface SalesDataPoint {
  name: string;
  sales: number;
  revenue: number;
  profit: number;
}

interface Transaction {
  id: number;
  customer: string;
  amount: string;
  status: "Completed" | "Pending" | "Processing";
}

// Sidebar Section Component
const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  icon,
  children,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="text-white">
      <button
        onClick={onToggle}
        className="w-full flex items-center px-4 py-2 hover:bg-gray-800 transition-colors rounded-md"
      >
        {icon}
        <span className="ml-2 flex-1 text-sm font-medium">{title}</span>
        {children && (
          <span className="ml-2">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        )}
      </button>
      {children && isOpen && (
        <div className="ml-8 space-y-1 mt-1 transition-all duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

// Sidebar Item Component
const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors rounded-md text-sm"
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
};

// Stats Card Component
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
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
    </div>
  );
};

const SalesDashboard: React.FC = () => {
  const router = useRouter();
  const [openSections, setOpenSections] = useState<OpenSections>({
    products: false,
    customers: false,
    orders: false,
  });

  // Sample data
  // const salesData: SalesDataPoint[] = [
  //   { name: "Jan", sales: 4000, revenue: 2400, profit: 2400 },
  //   { name: "Feb", sales: 3000, revenue: 1398, profit: 2210 },
  //   { name: "Mar", sales: 2000, revenue: 9800, profit: 2290 },
  //   { name: "Apr", sales: 2780, revenue: 3908, profit: 2000 },
  //   { name: "May", sales: 1890, revenue: 4800, profit: 2181 },
  //   { name: "Jun", sales: 2390, revenue: 3800, profit: 2500 },
  //   { name: "Jul", sales: 3490, revenue: 4300, profit: 2100 },
  // ];

  // const recentTransactions: Transaction[] = [
  //   { id: 1, customer: "John Doe", amount: "$524.99", status: "Completed" },
  //   { id: 2, customer: "Jane Smith", amount: "$299.99", status: "Pending" },
  //   { id: 3, customer: "Mike Johnson", amount: "$149.99", status: "Completed" },
  //   {
  //     id: 4,
  //     customer: "Sarah Williams",
  //     amount: "$749.99",
  //     status: "Processing",
  //   },
  // ];

  const toggleSection = (section: keyof OpenSections): void => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-gray-900 p-4 space-y-2">
        {/* Product Management Section */}
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
            label="Brand"
            onClick={() => router.push("/Admin/DashBoard/ManagerUser")}
          />
          <SidebarItem
            icon={<Tags size={16} />}
            label="Season"
            onClick={() => router.push("/season")}
          />
        </SidebarSection>

        {/* Customer Management Section */}
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

        {/* Order Management Section */}
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
      {/* Main Content */}{" "}
    </div>
  );
};

export default SalesDashboard;
