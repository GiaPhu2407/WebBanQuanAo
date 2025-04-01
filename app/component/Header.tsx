"use client";
import React, { useState, useEffect } from "react";
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
    <div>
      <div className="bg-white w-full h-20 shadow fixed z-[99]">
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
              <Link href="/Show" className="text-xl font-bold">
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

        {/* Desktop Menu Component */}
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
      {/* <AnimatePresence>
        {!isMobile && showDragTip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg z-[100] flex items-center gap-2 max-w-xs"
          >
            <Info className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                Mẹo: Bạn có thể kéo sản phẩm vào giỏ hàng để thêm nhanh!
              </p>
            </div>
            <button
              onClick={() => setShowDragTip(false)}
              className="flex-shrink-0 p-1 hover:bg-blue-600 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence> */}

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
              className="bg-white rounded-lg p-6 max-w-md w-full"
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
                  className="p-1 hover:bg-gray-100 rounded-full"
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
                  <span className="text-xl font-semibold text-gray-900">
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
                    <span className="text-sm text-gray-500 line-through">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          ? "bg-blue-500 text-white"
                          : size.soluong === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {size.tenSize} ({size.soluong})
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border rounded-full hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => {
                      const maxQuantity =
                        availableSizes.find((s) => s.idSize === selectedSize)
                          ?.soluong || 0;
                      setQuantity(Math.min(quantity + 1, maxQuantity));
                    }}
                    className="p-2 border rounded-full hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSizeModal(false);
                    setSelectedProduct(null);
                    setSelectedSize(null);
                    setQuantity(1);
                  }}
                  className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading || !selectedSize}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                    "Thêm vào giỏ"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showAddedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[100]"
          >
            Sản phẩm đã được thêm vào giỏ hàng!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-20"></div>
    </div>
  );
};

export default Menu;
