// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
// } from "recharts";
// import {
//   User,
//   ShoppingCart,
//   Package,
//   ChevronDown,
//   ChevronUp,
//   Heart,
//   Users,
//   ShoppingBag,
//   CreditCard,
//   RotateCcw,
//   Tags,
//   Truck,
//   Award,
//   ArrowUpRight,
//   DollarSign,
//   TrendingUp,
//   Menu as MenuIcon,
//   X,
//   ChevronRight,
//   ChevronLeft,
// } from "lucide-react";
// import Menu from "./HeaderDashboard";

// // Interfaces
// interface SidebarSectionProps {
//   title: string;
//   icon: React.ReactNode;
//   children?: React.ReactNode;
//   isOpen: boolean;
//   onToggle: () => void;
//   isExpanded: boolean;
// }

// interface SidebarItemProps {
//   icon: React.ReactNode;
//   label: string;
//   onClick: () => void;
//   isExpanded: boolean;
// }

// interface StatsCardProps {
//   title: string;
//   value: string;
//   icon: React.ReactNode;
//   trend?: "up" | "down";
//   trendValue?: string;
// }

// interface OpenSections {
//   products: boolean;
//   customers: boolean;
//   orders: boolean;
// }

// interface SalesDataPoint {
//   name: string;
//   sales: number;
//   revenue: number;
//   profit: number;
// }

// interface Transaction {
//   id: number;
//   customer: string;
//   amount: string;
//   status: "Completed" | "Pending" | "Processing";
// }

// // Sidebar Section Component
// const SidebarSection: React.FC<SidebarSectionProps> = ({
//   title,
//   icon,
//   children,
//   isOpen,
//   onToggle,
//   isExpanded,
// }) => {
//   return (
//     <div className="text-white">
//       <button
//         onClick={onToggle}
//         className={`w-full flex items-center ${
//           isExpanded ? "px-3 sm:px-4" : "px-2 justify-center"
//         } py-2 text-black hover:bg-gray-800 hover:text-white transition-colors rounded-md`}
//         title={!isExpanded ? title : ""}
//       >
//         <span className={isExpanded ? "mr-2" : ""}>{icon}</span>
//         {isExpanded && (
//           <span className="flex-1 text-xs sm:text-sm font-medium">{title}</span>
//         )}
//         {children && isExpanded && (
//           <span className="ml-1">
//             {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//           </span>
//         )}
//       </button>
//       {children && isOpen && isExpanded && (
//         <div className="ml-4 sm:ml-8 space-y-1 mt-1 transition-all duration-200">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// };

// // Sidebar Item Component
// const SidebarItem: React.FC<SidebarItemProps> = ({
//   icon,
//   label,
//   onClick,
//   isExpanded,
// }) => {
//   return (
//     <button
//       onClick={onClick}
//       className={`w-full flex items-center ${
//         isExpanded ? "px-3 sm:px-4 justify-start" : "px-2 justify-center"
//       } py-1.5 sm:py-2 text-black hover:bg-gray-800 hover:text-white transition-colors rounded-md text-xs sm:text-sm`}
//       title={!isExpanded ? label : ""}
//     >
//       <span className={isExpanded ? "mr-2" : ""}>{icon}</span>
//       {isExpanded && <span>{label}</span>}
//     </button>
//   );
// };

// // Stats Card Component
// const StatsCard: React.FC<StatsCardProps> = ({
//   title,
//   value,
//   icon,
//   trend,
//   trendValue,
// }) => {
//   return (
//     <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-gray-500 text-xs sm:text-sm mb-1">{title}</p>
//           <h3 className="text-lg sm:text-2xl font-bold">{value}</h3>
//         </div>
//         <div
//           className={`p-2 sm:p-3 rounded-full ${
//             trend === "up" ? "bg-green-100" : "bg-red-100"
//           }`}
//         >
//           {icon}
//         </div>
//       </div>
//       {trendValue && (
//         <div className="mt-3 sm:mt-4 flex items-center">
//           <ArrowUpRight
//             className={trend === "up" ? "text-green-500" : "text-red-500"}
//             size={14}
//           />
//           <span
//             className={`ml-1 text-xs sm:text-sm ${
//               trend === "up" ? "text-green-500" : "text-red-500"
//             }`}
//           >
//             {trendValue}
//           </span>
//           <span className="text-gray-500 text-xs sm:text-sm ml-1">
//             vs last month
//           </span>
//         </div>
//       )}
//     </div>
//   );
// };

// const SalesDashboard: React.FC = () => {
//   const router = useRouter();
//   const [openSections, setOpenSections] = useState<OpenSections>({
//     products: false,
//     customers: false,
//     orders: false,
//   });
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [sidebarExpanded, setSidebarExpanded] = useState(false);

//   // Toggle sidebar for mobile view
//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   // Toggle sidebar expansion for desktop/tablet
//   const toggleSidebarExpansion = () => {
//     setSidebarExpanded(!sidebarExpanded);
//   };

//   // Close sidebar when route changes
//   useEffect(() => {
//     const handleRouteChange = () => {
//       setSidebarOpen(false);
//     };

//     window.addEventListener("popstate", handleRouteChange);
//     return () => {
//       window.removeEventListener("popstate", handleRouteChange);
//     };
//   }, []);

//   const toggleSection = (section: keyof OpenSections): void => {
//     setOpenSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="relative">
//         <Menu />

//         {/* Mobile Menu Button - Top Left Corner */}
//         <button
//           onClick={toggleSidebar}
//           className="md:hidden fixed top-16 left-4 z-50 bg-white p-2 rounded-md shadow-md"
//           aria-label="Toggle menu"
//         >
//           <MenuIcon size={24} />
//         </button>
//       </div>

//       <div className="flex pt-14">
//         {/* Sidebar Navigation - Desktop/Tablet (Collapsible) */}
//         <nav
//           className={`hidden md:block ${
//             sidebarExpanded ? "w-64" : "w-16"
//           } bg-white shadow-md h-[calc(100vh-3.5rem)] overflow-y-auto transition-all duration-300 ease-in-out`}
//         >
//           {/* Expand/Collapse Button */}
//           <div className="flex justify-end p-2">
//             <button
//               onClick={toggleSidebarExpansion}
//               className="p-1 rounded-full hover:bg-gray-100"
//               title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
//             >
//               {sidebarExpanded ? (
//                 <ChevronLeft size={18} />
//               ) : (
//                 <ChevronRight size={18} />
//               )}
//             </button>
//           </div>

//           <div className="p-2 space-y-2">
//             {/* Product Management Section */}
//             <SidebarSection
//               title="Quản Lý Sản Phẩm"
//               icon={<Package size={18} />}
//               isOpen={openSections.products}
//               onToggle={() => toggleSection("products")}
//               isExpanded={sidebarExpanded}
//             >
//               <SidebarItem
//                 icon={<Tags size={16} />}
//                 label="Category"
//                 onClick={() => router.push("/category")}
//                 isExpanded={sidebarExpanded}
//               />
//               <SidebarItem
//                 icon={<Tags size={16} />}
//                 label="Product Type"
//                 onClick={() => router.push("/Admin/DashBoard/LoaiSanPham")}
//                 isExpanded={sidebarExpanded}
//               />
//               <SidebarItem
//                 icon={<ShoppingBag size={16} />}
//                 label="Product"
//                 onClick={() => router.push("/Admin/DashBoard/ProductManager")}
//                 isExpanded={sidebarExpanded}
//               />
//               <SidebarItem
//                 icon={<Truck size={16} />}
//                 label="Supplier"
//                 onClick={() => router.push("/Admin/DashBoard/Nhacungcap")}
//                 isExpanded={sidebarExpanded}
//               />
//               <SidebarItem
//                 icon={<Award size={16} />}
//                 label="User"
//                 onClick={() => router.push("/Admin/DashBoard/ManagerUser")}
//                 isExpanded={sidebarExpanded}
//               />
//               <SidebarItem
//                 icon={<Tags size={16} />}
//                 label="Image"
//                 onClick={() => router.push("/Admin/DashBoard/ManagerImage")}
//                 isExpanded={sidebarExpanded}
//               />
//             </SidebarSection>

//             {/* Customer Management Section */}
//             <SidebarSection
//               title="Quản Lý Khách Hàng"
//               icon={<Users size={18} />}
//               isOpen={openSections.customers}
//               onToggle={() => toggleSection("customers")}
//               isExpanded={sidebarExpanded}
//             >
//               <SidebarItem
//                 icon={<User size={16} />}
//                 label="Customer"
//                 onClick={() => router.push("/customer")}
//                 isExpanded={sidebarExpanded}
//               />
//               <SidebarItem
//                 icon={<ShoppingCart size={16} />}
//                 label="Cart"
//                 onClick={() => router.push("/")}
//                 isExpanded={sidebarExpanded}
//               />
//               <SidebarItem
//                 icon={<Heart size={16} />}
//                 label="Wishlist"
//                 onClick={() => router.push("/wishlist")}
//                 isExpanded={sidebarExpanded}
//               />
//             </SidebarSection>

//             {/* Order Management Section */}
//             <SidebarSection
//               title="Quản Lý Đơn Hàng"
//               icon={<ShoppingBag size={18} />}
//               isOpen={openSections.orders}
//               onToggle={() => toggleSection("orders")}
//               isExpanded={sidebarExpanded}
//             >
//               <SidebarItem
//                 icon={<ShoppingBag size={16} />}
//                 label="Order"
//                 onClick={() => router.push("/Admin/DashBoard/ManagerDonhang")}
//                 isExpanded={sidebarExpanded}
//               />
//               <SidebarItem
//                 icon={<CreditCard size={16} />}
//                 label="Payment"
//                 onClick={() => router.push("/Admin/DashBoard/Managerpayment")}
//                 isExpanded={sidebarExpanded}
//               />
//               <SidebarItem
//                 icon={<RotateCcw size={16} />}
//                 label="Return"
//                 onClick={() => router.push("/return")}
//                 isExpanded={sidebarExpanded}
//               />
//             </SidebarSection>
//           </div>
//         </nav>

//         {/* Mobile Sidebar - Slide in from left */}
//         {sidebarOpen && (
//           <div className="fixed inset-0 z-40 md:hidden">
//             {/* Backdrop */}
//             <div
//               className="absolute inset-0 bg-gray-800 bg-opacity-50"
//               onClick={toggleSidebar}
//             ></div>

//             {/* Sidebar */}
//             <nav className="absolute left-0 top-10 w-64 h-full bg-white shadow-lg p-4 space-y-2 overflow-y-auto transform transition-transform duration-300 ease-in-out">
//               <div className="flex justify-between items-center mb-4 border-b pb-2">
//                 <h2 className="font-bold text-lg">Menu</h2>
//                 <button onClick={toggleSidebar} className="p-1">
//                   <X size={20} />
//                 </button>
//               </div>

//               {/* Product Management Section */}
//               <SidebarSection
//                 title="Quản Lý Sản Phẩm"
//                 icon={<Package size={18} />}
//                 isOpen={openSections.products}
//                 onToggle={() => toggleSection("products")}
//                 isExpanded={true}
//               >
//                 <SidebarItem
//                   icon={<Tags size={16} />}
//                   label="Category"
//                   onClick={() => router.push("/category")}
//                   isExpanded={true}
//                 />
//                 <SidebarItem
//                   icon={<Tags size={16} />}
//                   label="Product Type"
//                   onClick={() => router.push("/Admin/DashBoard/LoaiSanPham")}
//                   isExpanded={true}
//                 />
//                 <SidebarItem
//                   icon={<ShoppingBag size={16} />}
//                   label="Product"
//                   onClick={() => router.push("/Admin/DashBoard/ProductManager")}
//                   isExpanded={true}
//                 />
//                 <SidebarItem
//                   icon={<Truck size={16} />}
//                   label="Supplier"
//                   onClick={() => router.push("/Admin/DashBoard/Nhacungcap")}
//                   isExpanded={true}
//                 />
//                 <SidebarItem
//                   icon={<Award size={16} />}
//                   label="User"
//                   onClick={() => router.push("/Admin/DashBoard/ManagerUser")}
//                   isExpanded={true}
//                 />
//                 <SidebarItem
//                   icon={<Tags size={16} />}
//                   label="Image"
//                   onClick={() => router.push("/Admin/DashBoard/ManagerImage")}
//                   isExpanded={true}
//                 />
//               </SidebarSection>

//               {/* Customer Management Section */}
//               <SidebarSection
//                 title="Quản Lý Khách Hàng"
//                 icon={<Users size={18} />}
//                 isOpen={openSections.customers}
//                 onToggle={() => toggleSection("customers")}
//                 isExpanded={true}
//               >
//                 <SidebarItem
//                   icon={<User size={16} />}
//                   label="Customer"
//                   onClick={() => router.push("/customer")}
//                   isExpanded={true}
//                 />
//                 <SidebarItem
//                   icon={<ShoppingCart size={16} />}
//                   label="Cart"
//                   onClick={() => router.push("/")}
//                   isExpanded={true}
//                 />
//                 <SidebarItem
//                   icon={<Heart size={16} />}
//                   label="Wishlist"
//                   onClick={() => router.push("/wishlist")}
//                   isExpanded={true}
//                 />
//               </SidebarSection>

//               {/* Order Management Section */}
//               <SidebarSection
//                 title="Quản Lý Đơn Hàng"
//                 icon={<ShoppingBag size={18} />}
//                 isOpen={openSections.orders}
//                 onToggle={() => toggleSection("orders")}
//                 isExpanded={true}
//               >
//                 <SidebarItem
//                   icon={<ShoppingBag size={16} />}
//                   label="Order"
//                   onClick={() => router.push("/Admin/DashBoard/ManagerDonhang")}
//                   isExpanded={true}
//                 />
//                 <SidebarItem
//                   icon={<CreditCard size={16} />}
//                   label="Payment"
//                   onClick={() => router.push("/Admin/DashBoard/Managerpayment")}
//                   isExpanded={true}
//                 />
//                 <SidebarItem
//                   icon={<RotateCcw size={16} />}
//                   label="Return"
//                   onClick={() => router.push("/return")}
//                   isExpanded={true}
//                 />
//               </SidebarSection>
//             </nav>
//           </div>
//         )}

//         {/* Main Content */}
//         <div
//           className={`flex-1  p-4 md:p-6 ml-0 transition-all duration-300 ease-in-out ${
//             sidebarExpanded ? "md:ml-0" : "md:ml-0"
//           }`}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default SalesDashboard;

"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Package,
  ShoppingBag,
  Users,
  User,
  ShoppingCart,
  Heart,
  CreditCard,
  RotateCcw,
  Truck,
  Award,
  Tags,
  ChevronDown,
  ChevronUp,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Logo Components
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Admin Dashboard
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// Sidebar Section Component
interface SidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  icon,
  children,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center px-3 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-md"
      >
        <span className="mr-2">{icon}</span>
        <span className="flex-1 text-sm font-medium">{title}</span>
        <span className="ml-1">
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>
      {isOpen && (
        <div className="ml-8 space-y-1 mt-1 transition-all duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = () => {
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex gap-2">
          {[...new Array(4)].map((_, i) => (
            <div
              key={`first-array-${i}`}
              className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="flex gap-2 flex-1">
          {[...new Array(2)].map((_, i) => (
            <div
              key={`second-array-${i}`}
              className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Mobile Sidebar Component
interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-800 bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <nav className="absolute left-0 top-0 w-64 h-full bg-white dark:bg-neutral-900 shadow-lg p-4 space-y-2 overflow-y-auto transform transition-transform duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="font-bold text-lg">Menu</h2>
          <button onClick={onClose} className="p-1">
            <X size={20} />
          </button>
        </div>
        {children}
      </nav>
    </div>
  );
};

// Main Admin Dashboard Component
export function AdminDashboard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    products: false,
    customers: false,
    orders: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Product Management Links
  const productLinks = [
    {
      label: "Category",
      href: "/category",
      icon: (
        <Tags className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Product Type",
      href: "/Admin/DashBoard/LoaiSanPham",
      icon: (
        <Tags className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Product",
      href: "/Admin/DashBoard/ProductManager",
      icon: (
        <ShoppingBag className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Supplier",
      href: "/Admin/DashBoard/Nhacungcap",
      icon: (
        <Truck className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "User",
      href: "/Admin/DashBoard/ManagerUser",
      icon: (
        <Award className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Image",
      href: "/Admin/DashBoard/ManagerImage",
      icon: (
        <Tags className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  // Customer Management Links
  const customerLinks = [
    {
      label: "Customer",
      href: "/customer",
      icon: (
        <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Cart",
      href: "/",
      icon: (
        <ShoppingCart className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Wishlist",
      href: "/wishlist",
      icon: (
        <Heart className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  // Order Management Links
  const orderLinks = [
    {
      label: "Order",
      href: "/Admin/DashBoard/ManagerDonhang",
      icon: (
        <ShoppingBag className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Payment",
      href: "/Admin/DashBoard/Managerpayment",
      icon: (
        <CreditCard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Return",
      href: "/return",
      icon: (
        <RotateCcw className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  // Sidebar Content
  const sidebarContent = (
    <>
      {open ? <Logo /> : <LogoIcon />}
      <div className="mt-8 flex flex-col">
        {open ? (
          <>
            <SidebarSection
              title="Quản Lý Sản Phẩm"
              icon={
                <Package
                  size={18}
                  className="text-neutral-700 dark:text-neutral-200"
                />
              }
              isOpen={openSections.products}
              onToggle={() => toggleSection("products")}
            >
              {productLinks.map((link, idx) => (
                <SidebarLink key={`product-${idx}`} link={link} />
              ))}
            </SidebarSection>

            <SidebarSection
              title="Quản Lý Khách Hàng"
              icon={
                <Users
                  size={18}
                  className="text-neutral-700 dark:text-neutral-200"
                />
              }
              isOpen={openSections.customers}
              onToggle={() => toggleSection("customers")}
            >
              {customerLinks.map((link, idx) => (
                <SidebarLink key={`customer-${idx}`} link={link} />
              ))}
            </SidebarSection>

            <SidebarSection
              title="Quản Lý Đơn Hàng"
              icon={
                <ShoppingBag
                  size={18}
                  className="text-neutral-700 dark:text-neutral-200"
                />
              }
              isOpen={openSections.orders}
              onToggle={() => toggleSection("orders")}
            >
              {orderLinks.map((link, idx) => (
                <SidebarLink key={`order-${idx}`} link={link} />
              ))}
            </SidebarSection>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <SidebarLink
                link={{
                  label: "Products",
                  href: "#",
                  icon: (
                    <Package className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                  ),
                }}
              />
              <SidebarLink
                link={{
                  label: "Customers",
                  href: "#",
                  icon: (
                    <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                  ),
                }}
              />
              <SidebarLink
                link={{
                  label: "Orders",
                  href: "#",
                  icon: (
                    <ShoppingBag className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                  ),
                }}
              />
            </div>
          </>
        )}
      </div>
      <div className="mt-auto">
        <SidebarLink
          link={{
            label: "Admin User",
            href: "#",
            icon: (
              <Image
                src="https://assets.aceternity.com/manu.png"
                className="h-7 w-7 flex-shrink-0 rounded-full"
                width={50}
                height={50}
                alt="Avatar"
              />
            ),
          }}
        />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-800">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 bg-white dark:bg-neutral-900 p-2 rounded-md shadow-md"
        aria-label="Toggle menu"
      >
        <MenuIcon
          size={24}
          className="text-neutral-700 dark:text-neutral-200"
        />
      </button>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      >
        <div className="flex flex-col h-full">
          <Logo />
          <div className="mt-6 flex flex-col space-y-2">
            <SidebarSection
              title="Quản Lý Sản Phẩm"
              icon={
                <Package
                  size={18}
                  className="text-neutral-700 dark:text-neutral-200"
                />
              }
              isOpen={openSections.products}
              onToggle={() => toggleSection("products")}
            >
              {productLinks.map((link, idx) => (
                <SidebarLink key={`mobile-product-${idx}`} link={link} />
              ))}
            </SidebarSection>

            <SidebarSection
              title="Quản Lý Khách Hàng"
              icon={
                <Users
                  size={18}
                  className="text-neutral-700 dark:text-neutral-200"
                />
              }
              isOpen={openSections.customers}
              onToggle={() => toggleSection("customers")}
            >
              {customerLinks.map((link, idx) => (
                <SidebarLink key={`mobile-customer-${idx}`} link={link} />
              ))}
            </SidebarSection>

            <SidebarSection
              title="Quản Lý Đơn Hàng"
              icon={
                <ShoppingBag
                  size={18}
                  className="text-neutral-700 dark:text-neutral-200"
                />
              }
              isOpen={openSections.orders}
              onToggle={() => toggleSection("orders")}
            >
              {orderLinks.map((link, idx) => (
                <SidebarLink key={`mobile-order-${idx}`} link={link} />
              ))}
            </SidebarSection>
          </div>
        </div>
      </MobileSidebar>

      {/* Main Content */}
      <div
        className={cn(
          "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
          "h-screen mt-14 md:mt-4" // Adjust height and margin for mobile menu
        )}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            {sidebarContent}
          </SidebarBody>
        </Sidebar>
        <DashboardContent />
      </div>
    </div>
  );
}
