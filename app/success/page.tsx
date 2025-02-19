"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SuccessPage() {
  const [processing, setProcessing] = useState(true);
  const [orderProcessed, setOrderProcessed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const processPayment = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const paymentIntentId = searchParams.get("payment_intent");

      console.log("Payment Intent ID:", paymentIntentId);

      if (!paymentIntentId) {
        toast.error("Không tìm thấy mã thanh toán");
        setTimeout(() => router.push("/Cart"), 2000);
        return;
      }

      try {
        const response = await fetch("/api/thanhtoan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stripeSessionId: paymentIntentId,
            paymentMethod: "STRIPE",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Payment processing failed");
        }

        if (data.message === "Payment already processed") {
          toast.success("Đơn hàng đã được xử lý trước đó!");
        } else {
          toast.success("Thanh toán thành công!");
        }

        setOrderProcessed(true);
        setTimeout(() => router.push("/component/Order"), 2000);
      } catch (error: any) {
        console.error("Error processing payment:", error);
        toast.error(error.message || "Có lỗi xảy ra khi xử lý thanh toán");
        setTimeout(() => router.push("/component/Order"), 2000);
      } finally {
        setProcessing(false);
      }
    };

    // Implement a one-time processing flag using sessionStorage
    const hasProcessed = sessionStorage.getItem(
      `processed_${window.location.search}`
    );

    if (!hasProcessed) {
      processPayment();
      sessionStorage.setItem(`processed_${window.location.search}`, "true");
    } else {
      setProcessing(false);
      setOrderProcessed(true);
      setTimeout(() => router.push("/component/Order"), 1000);
    }

    // Cleanup function to remove the processing flag when navigating away
    return () => {
      if (orderProcessed) {
        sessionStorage.removeItem(`processed_${window.location.search}`);
      }
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          {processing ? "Đang xử lý thanh toán..." : "Thanh toán thành công!"}
        </h1>
        <p className="text-gray-600">
          {processing
            ? "Vui lòng đợi trong giây lát..."
            : "Bạn sẽ được chuyển hướng tới trang đơn hàng..."}
        </p>
      </div>
    </div>
  );
}
