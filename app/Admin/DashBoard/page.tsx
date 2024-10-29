"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Sử dụng next/navigation thay vì next/router
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
  ArrowUpRight,
  Settings,
  BarChart2,
  Calendar,
  Clipboard,
  Package,
  Home,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SalesDashboard = () => {
  const router = useRouter();

  const data = [
    { name: "Jan", sales: 4000, revenue: 2400, profit: 2400 },
    { name: "Feb", sales: 3000, revenue: 1398, profit: 2210 },
    { name: "Mar", sales: 2000, revenue: 9800, profit: 2290 },
    { name: "Apr", sales: 2780, revenue: 3908, profit: 2000 },
    { name: "May", sales: 1890, revenue: 4800, profit: 2181 },
    { name: "Jun", sales: 2390, revenue: 3800, profit: 2500 },
    { name: "Jul", sales: 3490, revenue: 4300, profit: 2100 },
  ];

  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const [isStatisticsExpanded, setIsStatisticsExpanded] = useState(false);

  const navItems = [
    {
      icon: <Home color="#4CAF50" size={24} />,
      label: "Dashboard",
      id: "dashboard",
      onClick: () => router.push("/"),
    },
    {
      icon: <Calendar color="#E91E63" size={24} />,
      label: "Dates",
      id: "dates",
      onClick: () => router.push("/dates"),
    },
    {
      icon: <BarChart2 color="#FFA500" size={24} />,
      label: "Statistics",
      id: "statistics",
      subItems: [
        {
          label: "Daily",
          id: "daily",
          onClick: () => router.push("/statistics/daily"),
        },
        {
          label: "Monthly",
          id: "monthly",
          onClick: () => router.push("/statistics/monthly"),
        },
        {
          label: "Yearly",
          id: "yearly",
          onClick: () => router.push("/statistics/yearly"),
        },
        {
          label: "Quarterly",
          id: "quarterly",
          onClick: () => router.push("/statistics/quarterly"),
        },
      ],
    },
    {
      icon: <Package color="#673AB7" size={24} />,
      label: "Products",
      id: "products",
      onClick: () => router.push("/Admin/DashBoard/ProductManager"),
    },
    {
      icon: <ShoppingCart color="#2196F3" size={24} />,
      label: "Cart",
      id: "cart",
      onClick: () => router.push("/cart"),
    },
    {
      icon: <Clipboard color="#9C27B0" size={24} />,
      label: "Orders",
      id: "orders",
      onClick: () => router.push("/orders"),
    },
    {
      icon: <Settings color="#607D8B" size={24} />,
      label: "Settings",
      id: "settings",
      onClick: () => router.push("/settings"),
    },
  ];

  const handleNavItemClick = (item: any) => {
    setActiveNavItem(item.id);
    setIsStatisticsExpanded(item.id === "statistics");
    item.onClick();
  };

  return (
    <div className="flex h-screen">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 flex flex-col space-y-4 w-64">
        {navItems.map((item) => (
          <div key={item.id} className="relative">
            <button
              className={`flex items-center p-4 rounded-md hover:bg-gray-800 transition-colors ${
                activeNavItem === item.id ? "bg-gray-800" : ""
              }`}
              onClick={() => handleNavItemClick(item)}
            >
              {item.icon}
              <span className="ml-2 font-medium">{item.label}</span>
            </button>
            {item.id === "statistics" && (
              <AnimatePresence>
                {isStatisticsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="ml-8 mt-2 bg-gray-800 rounded-md w-48"
                  >
                    {item.subItems?.map((subItem) => (
                      <button
                        className="block px-4 py-2 hover:bg-gray-700 transition-colors"
                        key={subItem.id}
                        onClick={() => handleNavItemClick(subItem)}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ))}
      </nav>

      {/* Dashboard Content */}
      {/* <div className="flex-1 p-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sales Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-md shadow">
                <div>
                  <h3 className="text-2xl font-bold">2,854</h3>
                  <p className="text-gray-500">Total Customers</p>
                </div>
                <User color="#4CAF50" size={48} />
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-md shadow">
                <div>
                  <h3 className="text-2xl font-bold">$125,840</h3>
                  <p className="text-gray-500">Total Revenue</p>
                </div>
                <ShoppingCart color="#E91E63" size={48} />
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-md shadow">
                <div>
                  <h3 className="text-2xl font-bold">$48,120</h3>
                  <p className="text-gray-500">Total Profit</p>
                </div>
                <div className="flex items-center">
                  <ArrowUpRight color="#4CAF50" size={24} />
                  <span className="text-green-500 font-medium">12.5%</span>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Sales Trends</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                  <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="profit" stroke="#FFA500" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};

export default SalesDashboard;
