import React, { useState } from "react";
import Image from "next/image";
import styles from "@/app/Book.module.css";

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

  // Nội dung của cuốn sách về cửa hàng quần GipuDihi
  const bookContent: PageContent[] = [
    {
      title: "GipuDihi - Khẳng Định Phong Cách",
      content:
        "Chào mừng bạn đến với câu chuyện về GipuDihi - thương hiệu quần thời trang đang làm mưa làm gió trên thị trường. Lật sang trang tiếp theo để khám phá về chúng tôi.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Lịch Sử Thương Hiệu",
      content:
        "GipuDihi được thành lập vào năm 2020, từ một cửa hàng nhỏ tại Quận 1 đến hệ thống cửa hàng phủ khắp các thành phố lớn. Với sứ mệnh mang đến những sản phẩm chất lượng, thời trang và phù hợp với văn hóa Việt Nam.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Sản Phẩm Nổi Bật",
      content:
        "GipuDihi nổi tiếng với các dòng quần jean cao cấp, quần kaki thanh lịch và quần short năng động. Mỗi sản phẩm đều được kiểm tra chất lượng nghiêm ngặt và thiết kế theo xu hướng mới nhất.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Chất Liệu Đặc Biệt",
      content:
        "Điểm khác biệt của GipuDihi nằm ở chất liệu cao cấp, mềm mại và bền bỉ. Chúng tôi sử dụng vải nhập khẩu, công nghệ dệt tiên tiến và quy trình sản xuất thân thiện với môi trường.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Sức Ảnh Hưởng Trên Thị Trường",
      content:
        "GipuDihi đã tạo ra một làn sóng mới trong ngành thời trang Việt Nam. Với hơn 100,000 khách hàng trung thành và tỷ lệ hài lòng đạt 95%, chúng tôi tự hào là thương hiệu được yêu thích nhất trong phân khúc.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Câu Chuyện Khách Hàng",
      content:
        '"GipuDihi không chỉ là một chiếc quần, mà là sự tự tin khi tôi mặc nó" - đây là lời nhận xét từ một khách hàng trung thành. Chúng tôi luôn lắng nghe và cải thiện sản phẩm dựa trên phản hồi của khách hàng.',
      image: "/api/placeholder/300/200",
    },
    {
      title: "Đối Tác Chiến Lược",
      content:
        "GipuDihi hợp tác với các nhà thiết kế hàng đầu và các nhãn hiệu thời trang quốc tế. Điều này giúp chúng tôi luôn cập nhật xu hướng mới nhất và áp dụng công nghệ tiên tiến vào sản phẩm.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Trách Nhiệm Xã Hội",
      content:
        "GipuDihi cam kết đóng góp 5% lợi nhuận cho các hoạt động xã hội và bảo vệ môi trường. Chúng tôi sử dụng vật liệu tái chế và quy trình sản xuất tiết kiệm năng lượng để giảm thiểu tác động đến môi trường.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Kế Hoạch Phát Triển",
      content:
        "Trong 5 năm tới, GipuDihi dự kiến mở rộng thị trường ra các nước Đông Nam Á, phát triển thêm các dòng sản phẩm mới và xây dựng nền tảng thương mại điện tử tiên tiến.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Liên Hệ Với Chúng Tôi",
      content:
        "Ghé thăm cửa hàng GipuDihi gần nhất hoặc truy cập website www.gipudihi.com để khám phá các bộ sưu tập mới nhất. Hotline: 0123 456 789. Email: info@gipudihi.com. Theo dõi chúng tôi trên các nền tảng mạng xã hội để cập nhật tin tức và ưu đãi.",
      image: "/api/placeholder/300/200",
    },
  ];

  const totalPages = bookContent.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.bookOverlay}>
      <div className={styles.book}>
        <div className={styles.closeButton} onClick={onClose}>
          ×
        </div>
        <div className={styles.pages}>
          <div className={styles.page}>
            <h2>{bookContent[currentPage].title}</h2>
            {bookContent[currentPage].image && (
              <div className={styles.imageContainer}>
                <Image
                  src={bookContent[currentPage].image}
                  alt={bookContent[currentPage].title}
                  width={300}
                  height={200}
                  className={styles.pageImage}
                />
              </div>
            )}
            <div className={styles.content}>
              {bookContent[currentPage].content}
            </div>
            <div className={styles.pageNumber}>
              Trang {currentPage + 1} / {totalPages}
            </div>
          </div>
        </div>
        <div className={styles.navigation}>
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={styles.navButton}
          >
            ← Trang trước
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className={styles.navButton}
          >
            Trang sau →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Book;
