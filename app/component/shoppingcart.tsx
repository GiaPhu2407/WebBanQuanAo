"use client";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

import { useEffect, useState } from "react";

import { CartItem as CartItemType } from "@/app/component/type/cart";
import Footer from "./Footer";
import { CartItem } from "./cart/CartItem";
import { CartSummary } from "./cart/Cartsummary";
import Header from "./Header";
import { calculateDiscountedPrice } from "./utils/price";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/ui/Stripecomponents";

const stripePromise = loadStripe(
  "pk_test_51QtqEE06jxx8upvnnLHhOPk8V0VmtKPrSKIuXOxSUP9rakNIWceNgtcT0zchmN9atOAP0EHCat3vuPVrH8FjBMPj00e3aLrrY3"
);

export const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [itemProcessingId, setItemProcessingId] = useState<number | null>(null);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
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
      const itemsWithSelection = (data.data || []).map(
        (item: CartItemType) => ({
          ...item,
          isSelected: true,
        })
      );
      setCartItems(itemsWithSelection);
      setIsAllSelected(true);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Có lỗi xảy ra khi tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (idgiohang: number) => {
    const updatedCartItems = cartItems.map((item) =>
      item.idgiohang === idgiohang
        ? { ...item, isSelected: !item.isSelected }
        : item
    );

    setCartItems(updatedCartItems);
    setIsAllSelected(updatedCartItems.every((item) => item.isSelected));
  };

  const toggleSelectAll = () => {
    const newSelectedState = !isAllSelected;
    const updatedCartItems = cartItems.map((item) => ({
      ...item,
      isSelected: newSelectedState,
    }));

    setCartItems(updatedCartItems);
    setIsAllSelected(newSelectedState);
  };

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

  const calculateTotal = () => {
    return cartItems
      .filter((item) => item.isSelected && item.sanpham)
      .reduce((total, item) => {
        const originalPrice = item.sanpham?.gia ?? 0;
        const discountPercent = item.sanpham?.giamgia ?? 0;
        const discountedPrice = calculateDiscountedPrice(
          originalPrice,
          discountPercent
        );
        return total + discountedPrice * item.soluong;
      }, 0);
  };

  const validateAmount = (total: number) => {
    return total <= 200000000; // 200 million VND
  };

  const handleStripePayment = async () => {
    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          metadata: {
            cartItems: JSON.stringify(cartItems), // Add this
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      setShowStripeForm(true);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Có lỗi xảy ra trong quá trình thanh toán");
    }
  };

  const handleCheckout = async () => {
    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    const calculateTotal = () => {
      return cartItems
        .filter((item) => item.isSelected && item.sanpham)
        .reduce((total, item) => {
          const originalPrice = item.sanpham?.gia ?? 0;
          const discountPercent = item.sanpham?.giamgia ?? 0;
          const discountedPrice = calculateDiscountedPrice(
            originalPrice,
            discountPercent
          );
          return total + discountedPrice * item.soluong;
        }, 0);
    };

    if (paymentMethod === "STRIPE" && !validateAmount(calculateTotal())) {
      toast.error(
        "Giá trị đơn hàng vượt quá 200 triệu VND. Vui lòng chọn phương thức thanh toán khác hoặc chia nhỏ đơn hàng."
      );
      return;
    }

    setProcessing(true);

    try {
      if (paymentMethod === "STRIPE") {
        await handleStripePayment();
        return;
      }

      // Handle traditional payment methods
      const response = await fetch("/api/thanhtoan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems, paymentMethod }),
      });

      if (!response.ok) throw new Error("Checkout failed");

      const result = await response.json();

      const toastPromise = toast.promise(
        new Promise((resolve) => setTimeout(resolve, 2500)),
        {
          loading: "Đang thanh toán...",
          success: "Đặt hàng thành công!",
          error: "Có lỗi xảy ra",
        },
        { duration: 4000 }
      );

      await toastPromise;
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/component/Order");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Có lỗi xảy ra trong quá trình thanh toán");
    } finally {
      setProcessing(false);
    }
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

              {cartItems.map((item) => (
                <CartItem
                  key={item.idgiohang}
                  item={item}
                  onUpdateQuantity={updateItemQuantity}
                  onRemove={removeItem}
                  onToggleSelect={toggleItemSelection}
                  isProcessing={itemProcessingId === item.idgiohang}
                />
              ))}
            </div>

            <div className="lg:col-span-1">
              <CartSummary
                selectedItemsCount={
                  cartItems.filter((item) => item.isSelected).length
                }
                totalItemsCount={cartItems.length}
                total={calculateTotal()}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                onCheckout={handleCheckout}
                processing={processing}
              />
            </div>

            {showStripeForm && clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#4F46E5",
                    },
                  },
                }}
              >
                <CheckoutForm
                  amount={calculateTotal()}
                  onSuccess={() => {
                    setShowStripeForm(false);
                    router.push("/success");
                  }}
                  onCancel={() => {
                    setShowStripeForm(false);
                    setProcessing(false);
                  }}
                />
              </Elements>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
