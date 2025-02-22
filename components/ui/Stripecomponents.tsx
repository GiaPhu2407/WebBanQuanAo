"use client";
import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { StripeError } from "@stripe/stripe-js";

type CheckoutFormProps = {
  amount: number; // hoặc string, nếu amount là dạng khác
  onSuccess: () => void;
  onCancel: () => void;
};
const CheckoutForm = ({ amount, onSuccess, onCancel }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe chưa được khởi tạo. Vui lòng thử lại.");
      return;
    }

    setProcessing(true);

    try {
      const {
        error,
        paymentIntent,
      }: { error: StripeError | null; paymentIntent?: { status: string } } =
        await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/success`,
          },
        });

      if (error) {
        console.error(error);
        toast.error(error.message || "Thanh toán thất bại.");
      } else if (paymentIntent?.status === "succeeded") {
        toast.success("Thanh toán thành công!");
        onSuccess();
      } else {
        toast.error("Thanh toán chưa hoàn tất. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra trong quá trình thanh toán.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Thanh toán bằng thẻ</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={!stripe || processing}
              className={`flex-1 py-2 px-4 rounded-md text-white ${
                processing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {processing
                ? "Đang xử lý..."
                : `Thanh toán ${new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(amount)}`}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
