import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function CheckoutCancelPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Thanh toán đã bị hủy
        </h2>
        <p className="text-gray-600 mb-6">
          Đơn hàng của bạn chưa được thanh toán. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
        </p>
        <a
          href="/cart"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Quay lại giỏ hàng
        </a>
      </div>
    </div>
  );
}