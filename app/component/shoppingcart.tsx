"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Header";

interface CartItem {
  idgiohang: number;
  idsanpham: number;
  soluong: number;
  sanpham: {
    tensanpham: string;
    mota: string;
    gia: number;
    hinhanh: string | string[];
    giamgia: number;
    gioitinh: boolean; // true for "Nam", false for "Nữ"
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
      setCartItems(data.data || []); // Đảm bảo data luôn là mảng
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Có lỗi xảy ra khi tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (idgiohang: number) => {
    try {
      const response = await fetch(`/api/giohang/${idgiohang}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to remove item");
      }
      setCartItems((prev) => prev.filter((item) => item.idgiohang !== idgiohang));
      toast.success("Xóa sản phẩm thành công");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Có lỗi xảy ra khi xóa sản phẩm");
    }
  };

  const updateItemQuantity = async (idgiohang: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      toast((t) => (
        <div className="flex flex-col gap-2">
          <p className="font-medium">Bạn có chắc muốn xóa sản phẩm này không?</p>
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
          item.idgiohang === idgiohang ? { ...item, soluong: newQuantity } : item
        )
      );
      toast.success("Cập nhật số lượng thành công");
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast.error("Có lỗi xảy ra khi cập nhật số lượng");
    }
  };

  const handleCheckout = async () => {
    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch("/api/thanhtoan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      await toast.promise(
        new Promise((resolve) => setTimeout(resolve, 2500)),
        {
          loading: "Đang thanh toán...",
          success: "Đặt hàng thành công!",
          error: "Có lỗi xảy ra",
        }
      );

      router.push("/Orders");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Có lỗi xảy ra trong quá trình thanh toán");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner text-blue-600 loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Giỏ hàng của bạn</h1>
          <button
            onClick={() => router.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Quay lại
          </button>
          <Toaster />
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl mb-4">Giỏ hàng trống</p>
            <button
              onClick={() => router.push("/")}
              className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700"
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
                  className="flex items-center gap-4 border-b py-4"
                >
                  <img
                    src={
                      Array.isArray(item.sanpham.hinhanh)
                        ? item.sanpham.hinhanh[0]
                        : item.sanpham.hinhanh.split("|")[0]
                    }
                    alt={item.sanpham.tensanpham}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {item.sanpham.tensanpham}
                    </h3>
                    <p className="text-gray-600">{item.sanpham.mota}</p>
                    <p className="font-bold text-indigo-600 text-lg">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.sanpham.gia)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateItemQuantity(item.idgiohang, item.soluong - 1)
                      }
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="text-lg">{item.soluong}</span>
                    <button
                      onClick={() =>
                        updateItemQuantity(item.idgiohang, item.soluong + 1)
                      }
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.idgiohang)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Tổng cộng</h2>
                <div className="mt-4">
                  <label className="block mb-2 text-gray-600">
                    Phương thức thanh toán:
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded p-2"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="">Chọn phương thức</option>
                    <option value="cash">Thanh toán tiền mặt</option>
                    <option value="online">Thanh toán online</option>
                  </select>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded mt-4"
                  disabled={processing}
                >
                  {processing ? "Đang xử lý..." : "Thanh toán"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
