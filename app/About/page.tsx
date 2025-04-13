"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Book from "../component/BookGiPuDiHi/Book";
export default function AboutPage() {
  const [isBookOpen, setIsBookOpen] = useState(false);

  const openBook = () => {
    setIsBookOpen(true);
  };

  const closeBook = () => {
    setIsBookOpen(false);
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Về GPS</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Câu Chuyện Thương Hiệu
            </h2>
            <p className="mb-4">
              GPS là thương hiệu quần thời trang được thành lập với sứ mệnh mang
              đến những sản phẩm chất lượng cao, thiết kế hiện đại và phù hợp
              với văn hóa người Việt Nam.
            </p>
            <p className="mb-6">
              Từ năm 2020 đến nay, chúng tôi đã không ngừng phát triển và mở
              rộng, trở thành một trong những thương hiệu được yêu thích nhất
              trong ngành thời trang.
            </p>

            <button
              onClick={openBook}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg 
              flex items-center transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 
                  7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 
                  1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
              Khám Phá Câu Chuyện GPS
            </button>
          </div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-md h-80 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/api/placeholder/600/480"
                alt="GPS Store"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Giá Trị Cốt Lõi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">
                Chất Lượng
              </h3>
              <p className="text-center text-gray-600">
                Cam kết mang đến sản phẩm chất lượng cao, bền đẹp và thoải mái
                khi sử dụng.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">
                Sáng Tạo
              </h3>
              <p className="text-center text-gray-600">
                Không ngừng sáng tạo và đổi mới trong thiết kế để mang đến những
                xu hướng mới nhất.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 
                      4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">
                Trách Nhiệm
              </h3>
              <p className="text-center text-gray-600">
                Cam kết về trách nhiệm xã hội và bảo vệ môi trường trong mọi
                hoạt động của chúng tôi.
              </p>
            </div>
          </div>
        </div>

        <Book isOpen={isBookOpen} onClose={closeBook} />
      </div>
    </div>
  );
}
