import React, { useState, useEffect } from "react";
import Image from "next/image";

interface BookProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PageContent {
  title: string;
  content: string;
  image?: string;
}

const Book: React.FC<BookProps> = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentPage(0);
    }
  }, [isOpen]);

  // Nội dung của cuốn sách về GPS
  const bookContent: PageContent[] = [
    {
      title: "GPS - Khẳng Định Phong Cách",
      content:
        "Chào mừng bạn đến với câu chuyện về GPS - thương hiệu quần thời trang đang làm mưa làm gió trên thị trường. Lật sang trang tiếp theo để khám phá về chúng tôi.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Lịch Sử Thương Hiệu",
      content:
        "GPS được thành lập vào năm 2020, từ một cửa hàng nhỏ tại Quận 1 đến hệ thống cửa hàng phủ khắp các thành phố lớn. Với sứ mệnh mang đến những sản phẩm chất lượng, thời trang và phù hợp với văn hóa Việt Nam.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Sản Phẩm Nổi Bật",
      content:
        "GPS nổi tiếng với các dòng quần jean cao cấp, quần kaki thanh lịch và quần short năng động. Mỗi sản phẩm đều được kiểm tra chất lượng nghiêm ngặt và thiết kế theo xu hướng mới nhất.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Chất Liệu Đặc Biệt",
      content:
        "Điểm khác biệt của GPS nằm ở chất liệu cao cấp, mềm mại và bền bỉ. Chúng tôi sử dụng vải nhập khẩu, công nghệ dệt tiên tiến và quy trình sản xuất thân thiện với môi trường.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Sức Ảnh Hưởng Trên Thị Trường",
      content:
        "GPS đã tạo ra một làn sóng mới trong ngành thời trang Việt Nam. Với hơn 100,000 khách hàng trung thành và tỷ lệ hài lòng đạt 95%, chúng tôi tự hào là thương hiệu được yêu thích nhất trong phân khúc.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Câu Chuyện Khách Hàng",
      content:
        '"GPS không chỉ là một chiếc quần, mà là sự tự tin khi tôi mặc nó" - đây là lời nhận xét từ một khách hàng trung thành. Chúng tôi luôn lắng nghe và cải thiện sản phẩm dựa trên phản hồi của khách hàng.',
      image: "/api/placeholder/300/200",
    },
    {
      title: "Đối Tác Chiến Lược",
      content:
        "GPS hợp tác với các nhà thiết kế hàng đầu và các nhãn hiệu thời trang quốc tế. Điều này giúp chúng tôi luôn cập nhật xu hướng mới nhất và áp dụng công nghệ tiên tiến vào sản phẩm.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Trách Nhiệm Xã Hội",
      content:
        "GPS cam kết đóng góp 5% lợi nhuận cho các hoạt động xã hội và bảo vệ môi trường. Chúng tôi sử dụng vật liệu tái chế và quy trình sản xuất tiết kiệm năng lượng để giảm thiểu tác động đến môi trường.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Kế Hoạch Phát Triển",
      content:
        "Trong 5 năm tới, GPS dự kiến mở rộng thị trường ra các nước Đông Nam Á, phát triển thêm các dòng sản phẩm mới và xây dựng nền tảng thương mại điện tử tiên tiến.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Liên Hệ Với Chúng Tôi",
      content:
        "Ghé thăm cửa hàng GPS gần nhất hoặc truy cập website www.gps.com để khám phá các bộ sưu tập mới nhất. Hotline: 0123 456 789. Email: info@gps.com. Theo dõi chúng tôi trên các nền tảng mạng xã hội để cập nhật tin tức và ưu đãi.",
      image: "/api/placeholder/300/200",
    },
  ];

  const totalPages = bookContent.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="w-4/5 max-w-3xl h-4/5 bg-gradient-to-br from-gray-100 to-blue-100 rounded-lg shadow-2xl flex flex-col overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl text-gray-700 hover:text-gray-900 focus:outline-none z-10"
          aria-label="Close book"
        >
          ×
        </button>

        <div className="flex-1 overflow-hidden relative">
          <div
            className={`absolute inset-0 p-8 transition-transform duration-300 ${
              isFlipping ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <div className="bg-white bg-opacity-90 rounded shadow-md h-full overflow-y-auto p-6 border-l-4 border-red-500 flex flex-col">
              <h2 className="text-2xl font-serif text-center text-gray-800 pb-3 mb-4 border-b-2 border-red-500">
                {bookContent[currentPage].title}
              </h2>

              {bookContent[currentPage].image && (
                <div className="flex justify-center my-4">
                  <div className="relative w-64 h-40 rounded overflow-hidden shadow-md">
                    <Image
                      src={bookContent[currentPage].image}
                      alt={bookContent[currentPage].title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 font-serif text-gray-700 leading-relaxed">
                {bookContent[currentPage].content}
              </div>

              <div className="text-center text-gray-500 italic mt-4">
                Trang {currentPage + 1} / {totalPages}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`px-5 py-2 rounded font-medium ${
              currentPage === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            ← Trang trước
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className={`px-5 py-2 rounded font-medium ${
              currentPage === totalPages - 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            Trang sau →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Book;
