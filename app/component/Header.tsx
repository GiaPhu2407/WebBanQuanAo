"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { useDrop } from "react-dnd";
import { User, CartItem, Product } from "@/app/Menu/type/menu";
import DesktopDropdowns from "../Menu/DesktopDropdown";
import DesktopMenu from "../Menu/DesktopMenu";
import TabletMenu from "../Menu/TableMenu";
import MobileMenu from "../Menu/MobileMenu";
import { Link, ShoppingCart, X, Plus, Minus, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import TawkMessenger from "./TawkMesseger";

// Theme Context
export const ThemeContext = createContext({
  theme: "light",
  setTheme: (theme: string) => {},
});

// Hook to use theme
export const useTheme = () => useContext(ThemeContext);

// Theme Provider Component
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("light");

  // Get theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Update theme and save to localStorage
  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme Switcher Component
const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
  ];

  // Add proper index signature to the type
  interface ThemeColorMap {
    [key: string]: string[];
  }

  // Theme-specific color configurations for the dots
  const themeColors: ThemeColorMap = {
    light: ["#2563eb", "#9333ea", "#16a34a", "#000000"],
    dark: ["#38bdf8", "#818cf8", "#fb7185", "#ffffff"],
    cupcake: ["#65c3c8", "#ef9fbc", "#eeaf3a", "#291334"],
    bumblebee: ["#e0a82e", "#181830", "#f9d72f", "#000000"],
    emerald: ["#66cc8a", "#377cfb", "#f49e0b", "#333333"],
    corporate: ["#4b6bfb", "#7b92b2", "#3abff8", "#282828"],
    synthwave: ["#e779c1", "#58c7f3", "#f3cc30", "#d8a0df"],
    retro: ["#ef9995", "#2cb67d", "#7d5ba6", "#16161a"],
    cyberpunk: ["#ff7598", "#75d1f0", "#ffea00", "#301934"],
    valentine: ["#e96d7b", "#a991f7", "#85d3f2", "#1f2937"],
    halloween: ["#f28c18", "#6d3a9c", "#51a800", "#000000"],
    garden: ["#5c7f67", "#ecf4e7", "#e5d9b6", "#285e61"],
    forest: ["#1eb854", "#1fd65f", "#d27444", "#171212"],
    // Additional theme colors
    aqua: ["#09ecf3", "#0c9ebb", "#59c4d4", "#111827"],
    lofi: ["#808080", "#c0c0c0", "#d9d9d9", "#1f2937"],
    pastel: ["#d1c1d7", "#f2cdcd", "#c9e4de", "#1f2937"],
    fantasy: ["#6e0b75", "#007552", "#8c7851", "#191d24"],
    wireframe: ["#b8b8b8", "#d1d1d1", "#e9e9e9", "#333333"],
    black: ["#333333", "#555555", "#777777", "#000000"],
    luxury: ["#917543", "#cda583", "#372f3c", "#000000"],
    dracula: ["#ff79c6", "#bd93f9", "#8be9fd", "#282a36"],
    cmyk: ["#00bcd4", "#ec407a", "#ffeb3b", "#111111"],
    autumn: ["#d58c32", "#a15c38", "#4e6e4e", "#1f2937"],
    business: ["#1c4f82", "#2d7ecb", "#94b9ed", "#f5f7fa"],
    acid: ["#00ff9d", "#ff7600", "#c1ff00", "#101010"],
    lemonade: ["#519903", "#e2d96e", "#f5f5f5", "#311402"],
    night: ["#3a60bf", "#7084cc", "#c3d7ff", "#05031a"],
    coffee: ["#6e4a2c", "#93725e", "#e1bc8e", "#20120c"],
    winter: ["#0f6cbd", "#88abda", "#d6e8ff", "#ffffff"],
  };

  // Default colors if theme isn't specifically defined
  const defaultColors = ["#3b82f6", "#ec4899", "#22c55e", "#6b7280"];

  // Function to get theme-specific colors
  const getThemeColors = (themeName: string) => {
    return themeColors[themeName] || defaultColors;
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-sm bg-base-300 rounded-md border-none h-8 min-h-8 w-10"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
          </div>
          <svg
            width="10"
            height="10"
            className="fill-current opacity-60"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2048 2048"
          >
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
          </svg>
        </div>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content bg-base-200 text-base-content rounded-box top-px max-h-96 h-[70vh] w-64 overflow-y-auto shadow-2xl mt-4"
      >
        <div className="p-3">
          <h3 className="font-bold text-lg mb-2">Theme</h3>
          <div className="grid grid-cols-1 gap-2">
            {themes.map((t) => {
              const colors = getThemeColors(t);
              return (
                <div
                  key={t}
                  className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-base-300 ${
                    t === theme ? "bg-base-300" : ""
                  }`}
                  onClick={() => setTheme(t)}
                >
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 rounded-md border border-base-content/20 overflow-hidden bg-neutral-900">
                      <div className="grid grid-cols-2 grid-rows-2 gap-0 h-full">
                        <div style={{ backgroundColor: colors[0] }}></div>
                        <div style={{ backgroundColor: colors[1] }}></div>
                        <div style={{ backgroundColor: colors[2] }}></div>
                        <div style={{ backgroundColor: colors[3] }}></div>
                      </div>
                    </div>
                  </div>
                  <span className="ml-3 text-sm">{t}</span>
                  {t === theme && (
                    <span className="ml-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface Size {
  idSize: number;
  tenSize: string;
  soluong: number;
}

export const Menu: React.FC = () => {
  // State management
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMaleDropdown, setShowMaleDropdown] = useState(false);
  const [showFemaleDropdown, setShowFemaleDropdown] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [isOverCart, setIsOverCart] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [showDragTip, setShowDragTip] = useState(true);

  // Long press functionality
  const [longPressProduct, setLongPressProduct] = useState<Product | null>(
    null
  );
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [showLongPressTip, setShowLongPressTip] = useState(true);

  // Size selection modal states
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Determine device type based on window width
  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isMobile = windowWidth < 768;

  // Long press handlers
  const handleTouchStart = (product: Product) => {
    const timer = setTimeout(() => {
      setLongPressProduct(product);
      handleLongPressSelect(product);
      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500); // 500ms for long press

    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleTouchMove = () => {
    // Cancel long press on move
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleLongPressSelect = async (product: Product) => {
    setSelectedProduct(product);
    await fetchSizesForProduct(product.idsanpham);
    setShowSizeModal(true);
  };

  // Fetch sizes for a product
  const fetchSizesForProduct = async (productId: number) => {
    try {
      const [sizesResponse, productSizesResponse] = await Promise.all([
        fetch("/api/size"),
        fetch("/api/productsize"),
      ]);

      const sizeData = await sizesResponse.json();
      const productSizeData = await productSizesResponse.json();

      const sizes = sizeData.size;
      const productSizes = productSizeData.getProductSize;

      const sizesWithQuantities = sizes.map(
        (size: { idSize: number; tenSize: string }) => {
          const productSize = productSizes.find(
            (ps: { idSize: number; idsanpham: number }) =>
              ps.idSize === size.idSize && ps.idsanpham === productId
          );
          return {
            idSize: size.idSize,
            tenSize: size.tenSize,
            soluong: productSize ? productSize.soluong : 0,
          };
        }
      );

      setAvailableSizes(sizesWithQuantities);

      const firstAvailableSize = sizesWithQuantities.find(
        (size: { soluong: number }) => size.soluong > 0
      );
      if (firstAvailableSize) {
        setSelectedSize(firstAvailableSize.idSize);
        setQuantity(1);
      }
    } catch (error) {
      console.error("Error fetching sizes:", error);
      toast.error("Không thể tải thông tin size");
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedProduct || !selectedSize || quantity <= 0) {
      toast.error("Vui lòng chọn size và số lượng");
      return;
    }

    const selectedSizeData = availableSizes.find(
      (s) => s.idSize === selectedSize
    );
    if (!selectedSizeData || selectedSizeData.soluong < quantity) {
      toast.error("Số lượng trong kho không đủ");
      return;
    }

    setIsLoading(true);

    try {
      // Update product size quantity
      const updateResponse = await fetch("/api/productsize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idsanpham: selectedProduct.idsanpham,
          idSize: selectedSize,
          soluong: selectedSizeData.soluong - quantity,
        }),
      });

      if (!updateResponse.ok) throw new Error("Lỗi cập nhật số lượng");

      // Add to cart
      const cartResponse = await fetch("/api/giohang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idsanpham: selectedProduct.idsanpham,
          soluong: quantity,
          sizeId: selectedSize,
        }),
      });

      if (!cartResponse.ok) throw new Error("Lỗi thêm vào giỏ hàng");

      setOrderCount((prev) => prev + 1);
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Thêm vào giỏ hàng thành công!");
      setShowSizeModal(false);
      setSelectedProduct(null);
      setSelectedSize(null);
      setQuantity(1);
      setShowAddedToast(true);
      setTimeout(() => setShowAddedToast(false), 2000);
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  // Setup drop target for cart
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "PRODUCT_ITEM",
    drop: async (item: Product) => {
      setSelectedProduct(item);
      await fetchSizesForProduct(item.idsanpham);
      setShowSizeModal(true);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Update isOverCart when isOver changes
  useEffect(() => {
    setIsOverCart(isOver);
  }, [isOver]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Fetch user session and order count on component mount
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) throw new Error("Failed to fetch session");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Session fetch error:", error);
      }
    };

    const fetchOrderCount = async () => {
      try {
        const response = await fetch("/api/countdonhang");
        if (!response.ok) throw new Error("Failed to fetch order count");
        const count = await response.json();
        setOrderCount(count);
      } catch (error) {
        console.error("Order count fetch error:", error);
      }
    };

    const fetchCartItems = async () => {
      try {
        const response = await fetch("/api/giohang");
        if (!response.ok) throw new Error("Failed to fetch cart items");
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("Cart items fetch error:", error);
      }
    };

    fetchUserSession();
    fetchOrderCount();
    fetchCartItems();

    const handleCartUpdate = () => {
      fetchCartItems();
      fetchOrderCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    // Auto-hide drag tip after 5 seconds
    const tipTimer = setTimeout(() => {
      setShowDragTip(false);
    }, 5000);

    // Auto-hide long press tip after 5 seconds
    const longPressTipTimer = setTimeout(() => {
      setShowLongPressTip(false);
    }, 5000);

    // Save to localStorage to avoid showing tips repeatedly
    if (typeof window !== "undefined") {
      const hasSeenDragTip = localStorage.getItem("hasSeenDragTip");
      if (hasSeenDragTip) {
        setShowDragTip(false);
      } else {
        localStorage.setItem("hasSeenDragTip", "true");
      }

      const hasSeenLongPressTip = localStorage.getItem("hasSeenLongPressTip");
      if (hasSeenLongPressTip) {
        setShowLongPressTip(false);
      } else {
        localStorage.setItem("hasSeenLongPressTip", "true");
      }
    }

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      clearTimeout(tipTimer);
      clearTimeout(longPressTipTimer);
    };
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUserData(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <ThemeProvider>
      <div className="">
        <div className="bg-base-100 w-full h-20 shadow">
          {/* Mobile Header */}
          <div className="block md:hidden">
            <div className="flex items-center justify-between h-full px-4">
              <div className="flex items-center">
                <button
                  className="p-2 mr-2"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <Link href="/Show" className="flex text-xl font-bold">
                  Logo
                </Link>
              </div>

              {/* Mobile Cart Icon with Drop Zone */}
              <div className="flex items-center">
                <div
                  ref={dropRef as any}
                  className={`p-2 relative transition-colors duration-200 ${
                    isOverCart ? "bg-blue-100 rounded-full" : ""
                  }`}
                >
                  <ShoppingCart
                    className={`h-6 w-6 transition-colors duration-200 ${
                      isOverCart ? "text-blue-600" : "text-current"
                    }`}
                  />
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {orderCount}
                  </span>
                </div>
                <div className="ml-2">
                  <ThemeSwitcher />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          <MobileMenu
            userData={userData}
            handleLogout={handleLogout}
            showMaleDropdown={showMaleDropdown}
            setShowMaleDropdown={setShowMaleDropdown}
            showFemaleDropdown={showFemaleDropdown}
            setShowFemaleDropdown={setShowFemaleDropdown}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            dropRef={dropRef as any}
            isOverCart={isOverCart}
          />

          {/* Tablet Menu Component */}
          <TabletMenu
            userData={userData}
            orderCount={orderCount}
            handleLogout={handleLogout}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            isMobileProfileOpen={isMobileProfileOpen}
            setIsMobileProfileOpen={setIsMobileProfileOpen}
            dropRef={dropRef}
            isOverCart={isOverCart}
          />

          {/* Desktop Menu Component with Theme Switcher */}
          <DesktopMenu
            userData={userData}
            orderCount={orderCount}
            handleLogout={handleLogout}
            showMaleDropdown={showMaleDropdown}
            setShowMaleDropdown={setShowMaleDropdown}
            showFemaleDropdown={showFemaleDropdown}
            setShowFemaleDropdown={setShowFemaleDropdown}
            dropRef={dropRef as any}
            isOverCart={isOverCart}
          />

          {/* Add Theme Switcher for Desktop */}
          <div className="hidden lg:block absolute right-4 top-24 transform -translate-y-1/2">
            <ThemeSwitcher />
          </div>
        </div>

        {/* Desktop Dropdowns Component */}
        <DesktopDropdowns
          showMaleDropdown={showMaleDropdown}
          setShowMaleDropdown={setShowMaleDropdown}
          showFemaleDropdown={showFemaleDropdown}
          setShowFemaleDropdown={setShowFemaleDropdown}
        />

        {/* Long Press Tip for Mobile */}
        <AnimatePresence>
          {isMobile && showLongPressTip && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white px-4 py-3 rounded-lg shadow-lg z-[100] flex items-center gap-2 max-w-xs"
            >
              <Info className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Nhấn giữ sản phẩm để thêm nhanh vào giỏ hàng!
                </p>
              </div>
              <button
                onClick={() => setShowLongPressTip(false)}
                className="flex-shrink-0 p-1 hover:bg-amber-600 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drag Tip for Desktop */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg z-[100] flex items-center gap-2 max-w-xs"
          >
            <Info className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                💡 Mẹo: Bạn có thể dùng chuột kéo sản phẩm vào giỏ hàng! Hãy thử
                ngay để trải nghiệm nhé! 🛒
              </p>
            </div>
          </motion.div>
        )}

        {/* Size Selection Modal */}
        <AnimatePresence>
          {showSizeModal && selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-base-100 rounded-lg p-6 max-w-md w-full"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {selectedProduct.tensanpham}
                  </h3>
                  <button
                    onClick={() => {
                      setShowSizeModal(false);
                      setSelectedProduct(null);
                      setSelectedSize(null);
                      setQuantity(1);
                    }}
                    className="p-1 hover:bg-base-200 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Product Image */}
                <div className="mb-4">
                  <img
                    src={selectedProduct.hinhanh}
                    alt={selectedProduct.tensanpham}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-semibold text-base-content">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(
                        selectedProduct.giamgia > 0
                          ? selectedProduct.gia *
                              (1 - selectedProduct.giamgia / 100)
                          : selectedProduct.gia
                      )}
                    </span>
                    {selectedProduct.giamgia > 0 && (
                      <span className="text-sm text-base-content/60 line-through">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(selectedProduct.gia)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Chọn size:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size.idSize}
                        onClick={() => setSelectedSize(size.idSize)}
                        disabled={size.soluong === 0}
                        className={`px-4 py-2 rounded-md transition-all ${
                          selectedSize === size.idSize
                            ? "bg-primary text-primary-content"
                            : size.soluong === 0
                            ? "bg-base-200 text-base-content/40 cursor-not-allowed"
                            : "bg-base-200 hover:bg-base-300"
                        }`}
                      >
                        {size.tenSize} ({size.soluong})
                      </button>
                    ))}
                  </div>
                </div>
                {/* Quantity Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Số lượng:
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 bg-base-200 hover:bg-base-300 rounded-l-md"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-16 text-center p-2 bg-base-200 border-x border-base-300 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const selectedSizeData = availableSizes.find(
                          (s) => s.idSize === selectedSize
                        );
                        if (
                          selectedSizeData &&
                          quantity < selectedSizeData.soluong
                        ) {
                          setQuantity(quantity + 1);
                        }
                      }}
                      className="p-2 bg-base-200 hover:bg-base-300 rounded-r-md"
                      disabled={
                        !selectedSize ||
                        quantity >=
                          (availableSizes.find((s) => s.idSize === selectedSize)
                            ?.soluong || 0)
                      }
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading || !selectedSize || quantity <= 0}
                  className={`w-full py-3 rounded-lg transition-all ${
                    isLoading || !selectedSize || quantity <= 0
                      ? "bg-base-300 text-base-content/60 cursor-not-allowed"
                      : "bg-primary text-primary-content hover:bg-primary/90"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    "Thêm vào giỏ hàng"
                  )}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Added to Cart Toast */}
        <AnimatePresence>
          {showAddedToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-[100] flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Đã thêm vào giỏ hàng!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tawk Messenger Chat */}
        {/* <TawkMessenger /> */}
      </div>
    </ThemeProvider>
  );
};

export default Menu;
