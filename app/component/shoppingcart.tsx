"use client";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Header";
import { useEffect, useState } from "react";
import Footer from "./Footer";

interface CartItem {
  idgiohang: number;
  idsanpham: number;
  soluong: number;
  isSelected: boolean; // New property for selection
  size: {
    idSize: number;
    tenSize: string;
  };
  sanpham: {
    tensanpham: string;
    mota: string;
    gia: number;
    hinhanh: string;
    giamgia: number;
    gioitinh: boolean;
  };
}

export const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [itemProcessingId, setItemProcessingId] = useState<number | null>(null);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await fetch("/api/giohang");
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      const data = await response.json();
      // Initialize with all items selected
      const itemsWithSelection = (data.data || []).map((item: CartItem) => ({
        ...item,
        isSelected: true,
      }));
      setCartItems(itemsWithSelection);
      setIsAllSelected(true);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Có lỗi xảy ra khi tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  // Toggle selection for a single item
  const toggleItemSelection = (idgiohang: number) => {
    const updatedCartItems = cartItems.map((item) =>
      item.idgiohang === idgiohang
        ? { ...item, isSelected: !item.isSelected }
        : item
    );

    setCartItems(updatedCartItems);

    // Check if all items are selected
    const allSelected = updatedCartItems.every((item) => item.isSelected);
    setIsAllSelected(allSelected);
  };

  // Toggle selection for all items
  const toggleSelectAll = () => {
    const newSelectedState = !isAllSelected;
    const updatedCartItems = cartItems.map((item) => ({
      ...item,
      isSelected: newSelectedState,
    }));

    setCartItems(updatedCartItems);
    setIsAllSelected(newSelectedState);
  };

  // Rest of the previous methods remain the same...
  const removeItem = async (idgiohang: number) => {
    setItemProcessingId(idgiohang);
    try {
      const response = await fetch(`/api/giohang/${idgiohang}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể xóa sản phẩm");
      }

      setCartItems((prev) =>
        prev.filter((item) => item.idgiohang !== idgiohang)
      );
      toast.success("Xóa sản phẩm thành công");
    } catch (error: any) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error(error.message || "Có lỗi xảy ra khi xóa sản phẩm");
    } finally {
      setItemProcessingId(null);
    }
  };

  const updateItemQuantity = async (idgiohang: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      toast((t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium">
            Bạn có chắc muốn xóa sản phẩm này không?
          </p>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={() => {
                toast.dismiss(t.id);
                removeItem(idgiohang);
              }}
            >
              Xóa
            </button>
            <button
              className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              onClick={() => toast.dismiss(t.id)}
            >
              Hủy
            </button>
          </div>
        </div>
      ));
      return;
    }

    try {
      const response = await fetch(`/api/giohang/${idgiohang}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ soluong: newQuantity }),
      });
      if (!response.ok) {
        throw new Error("Failed to update item quantity");
      }
      setCartItems((prev) =>
        prev.map((item) =>
          item.idgiohang === idgiohang
            ? { ...item, soluong: newQuantity }
            : item
        )
      );
      toast.success("Cập nhật số lượng thành công");
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast.error("Có lỗi xảy ra khi cập nhật số lượng");
    }
  };

  const handleCheckout = async () => {
    // Filter only selected items for checkout
    const selectedItems = cartItems.filter((item) => item.isSelected);

    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    try {
      setProcessing(true);

      const totalAmount = calculateTotal(); // Only calculates selected items

      const response = await fetch("/api/thanhtoan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: selectedItems,
          paymentMethod,
          totalAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Thanh toán thất bại");
      }

      // Hiển thị toast và chuyển hướng
      await toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
        loading: "Đang xử lý đơn hàng...",
        success: () => {
          setTimeout(() => {
            router.push("/component/Order");
          }, 500);
          return "Đặt hàng thành công! Đang chuyển đến trang đơn hàng...";
        },
        error: "Có lỗi xảy ra khi xử lý đơn hàng",
      });
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Có lỗi xảy ra trong quá trình thanh toán");
    } finally {
      setProcessing(false);
    }
  };

  const calculateTotal = () => {
    return cartItems
      .filter((item) => item.isSelected)
      .reduce((total, item) => {
        const discountedPrice =
          item.sanpham.giamgia > 0
            ? item.sanpham.gia * (1 - item.sanpham.giamgia / 100)
            : item.sanpham.gia;
        return total + discountedPrice * item.soluong;
      }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
          <button
            onClick={() => router.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-200"
          >
            Quay lại
          </button>
          <Toaster position="top-right" />
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-xl mb-4">
              Giỏ hàng của bạn đang trống
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
              {/* Select All Checkbox */}
              <div className="flex items-center mb-4 border-b pb-4">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="select-all"
                  className="font-medium text-gray-700"
                >
                  Chọn tất cả (
                  {cartItems.filter((item) => item.isSelected).length}/
                  {cartItems.length})
                </label>
              </div>

              {cartItems.map((item) => {
                const discountedPrice =
                  item.sanpham.giamgia > 0
                    ? item.sanpham.gia * (1 - item.sanpham.giamgia / 100)
                    : item.sanpham.gia;
                const itemTotal = discountedPrice * item.soluong;

                return (
                  <div
                    key={item.idgiohang}
                    className="flex flex-col md:flex-row items-start md:items-center gap-4 border-b border-gray-200 py-6 last:border-0"
                  >
                    {/* Checkbox for individual item */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={item.isSelected}
                        onChange={() => toggleItemSelection(item.idgiohang)}
                        className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </div>

                    <img
                      src={item.sanpham.hinhanh}
                      alt={item.sanpham.tensanpham}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    {/* Rest of the item details remain the same */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {item.sanpham.tensanpham}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {item.sanpham.mota}
                      </p>

                      <div className="space-y-1">
                        <p className="text-gray-500 text-sm">
                          Size:{" "}
                          <span className="font-medium">
                            {item.size?.tenSize}
                          </span>
                        </p>
                        <p className="text-gray-500 text-sm">
                          Phân loại:{" "}
                          <span className="font-medium">
                            {item.sanpham.gioitinh ? "Nam" : "Nữ"}
                          </span>
                        </p>

                        <div className="flex items-center gap-2">
                          <p className="font-bold text-blue-600">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(discountedPrice)}
                          </p>
                          {item.sanpham.giamgia > 0 && (
                            <>
                              <p className="text-gray-400 line-through text-sm">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(item.sanpham.gia)}
                              </p>
                              <span className="text-red-500 text-sm">
                                -{item.sanpham.giamgia}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateItemQuantity(item.idgiohang, item.soluong - 1)
                          }
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 w-8 h-8 rounded flex items-center justify-center transition duration-200"
                        >
                          -
                        </button>
                        <span className="text-lg min-w-[40px] text-center">
                          {item.soluong}
                        </span>
                        <button
                          onClick={() =>
                            updateItemQuantity(item.idgiohang, item.soluong + 1)
                          }
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 w-8 h-8 rounded flex items-center justify-center transition duration-200"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-semibold text-blue-600">
                        Tổng:{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(itemTotal)}
                      </p>
                      <button
                        onClick={() => removeItem(item.idgiohang)}
                        className="text-red-500 hover:text-red-700 text-sm transition duration-200"
                        disabled={itemProcessingId === item.idgiohang}
                      >
                        {itemProcessingId === item.idgiohang
                          ? "Đang xóa..."
                          : "Xóa"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Thông tin đơn hàng
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Số sản phẩm đã chọn:</span>
                    <span>
                      {cartItems.filter((item) => item.isSelected).length}/
                      {cartItems.length}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(calculateTotal())}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span>Miễn phí</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>Tổng thanh toán:</span>
                      <span className="text-blue-600">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(calculateTotal())}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">
                      Phương thức thanh toán:
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="">Chọn phương thức thanh toán</option>
                      <option value="cash">Thanh toán khi nhận hàng</option>
                      <option value="online">Thanh toán online</option>
                    </select>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${
                      processing ||
                      cartItems.filter((item) => item.isSelected).length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    disabled={
                      processing ||
                      cartItems.filter((item) => item.isSelected).length === 0
                    }
                  >
                    {processing ? "Đang xử lý..." : "Tiến hành thanh toán"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ShoppingCart;
