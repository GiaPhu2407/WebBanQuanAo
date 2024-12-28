import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  if (!searchParams.session_id) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Thanh toán thành công!
        </h2>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
        </p>
        <a
          href="/orders"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Xem đơn hàng của bạn
        </a>
      </div>
    </div>
  );
}