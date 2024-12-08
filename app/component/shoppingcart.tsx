"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Header";

interface CartItem {
  idgiohang: number;
  idsanpham: number;
  soluong: number;
  size: string;
  sanpham: {
    tensanpham: string;
    mota: string;
    gia: number;
    hinhanh: string | string[];
    giamgia: number;
    gioitinh: boolean;
    size: string;
  };
}

export const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [processing, setProcessing] = useState(false);
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
      setCartItems(data.data || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Có lỗi xảy ra khi tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (idgiohang: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`/api/giohang/${idgiohang}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ soluong: newQuantity }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.idgiohang === idgiohang
            ? { ...item, soluong: newQuantity }
            : item
        )
      );
      toast.success("Cập nhật số lượng thành công");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Không thể cập nhật số lượng");
    }
  };

  const removeItem = async (idgiohang: number) => {
    try {
      const response = await fetch(`/api/giohang/${idgiohang}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove item");

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.idgiohang !== idgiohang)
      );
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Không thể xóa sản phẩm");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.sanpham.gia;
      const discountedPrice = price - price * (item.sanpham.giamgia / 100);
      return total + discountedPrice * item.soluong;
    }, 0);
  };

  const handleCheckout = async () => {
    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch("/api/donhang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod,
          items: cartItems,
          totalAmount: calculateTotal(),
        }),
      });

      if (!response.ok) throw new Error("Checkout failed");

      toast.success("Đặt hàng thành công");
      router.push("/donhang");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Có lỗi xảy ra khi đặt hàng");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-8">Giỏ hàng</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Giỏ hàng trống</p>
            <button
              onClick={() => router.push("/sanpham")}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cartItems.map((item) => (
                <div
                  key={item.idgiohang}
                  className="bg-white p-6 rounded-lg shadow-md mb-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        Array.isArray(item.sanpham.hinhanh)
                          ? item.sanpham.hinhanh[0]
                          : item.sanpham.hinhanh
                      }
                      alt={item.sanpham.tensanpham}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {item.sanpham.tensanpham}
                      </h3>
                      <p className="text-gray-500">Size: {item.size}</p>
                      <p className="text-gray-700">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(
                          item.sanpham.gia * (1 - item.sanpham.giamgia / 100)
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.idgiohang, item.soluong - 1)
                        }
                        className="p-1 rounded-md hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span>{item.soluong}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.idgiohang, item.soluong + 1)
                        }
                        className="p-1 rounded-md hover:bg-gray-100"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.idgiohang)}
                        className="ml-4 text-red-600 hover:text-red-700"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md h-fit">
              <h2 className="text-xl font-semibold mb-4">Tổng đơn hàng</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Tổng tiền:</span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(calculateTotal())}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Phương thức thanh toán:</p>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Chọn phương thức thanh toán</option>
                    <option value="cod">Thanh toán khi nhận hàng</option>
                    <option value="banking">Chuyển khoản ngân hàng</option>
                  </select>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={processing || cartItems.length === 0}
                  className={`w-full py-3 px-4 rounded-md text-white ${
                    processing || cartItems.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {processing ? "Đang xử lý..." : "Thanh toán"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default ShoppingCart;
