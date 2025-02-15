import React, { useCallback, useMemo } from "react";
import { X } from "lucide-react";

interface DailyNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Array of possible news items
const newsItems = [
  {
    title: "Bộ sưu tập mới ra mắt",
    description:
      "Khám phá bộ sưu tập mới nhất của chúng tôi với nhiều mẫu thiết kế độc đáo và phong cách.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
  },
  {
    title: "Khuyến mãi đặc biệt mùa hè",
    description:
      "Giảm giá lên đến 50% cho các sản phẩm mùa mới. Nhanh tay shopping ngay!",
    image:
      "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
  },
  {
    title: "Xu hướng thời trang 2025",
    description:
      "Cập nhật những xu hướng thời trang mới nhất cho năm 2025. Hãy là người dẫn đầu phong cách!",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
  },
  {
    title: "Bộ sưu tập Thu Đông",
    description:
      "Sẵn sàng cho mùa thu với những thiết kế ấm áp và thời trang nhất.",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
  },
  {
    title: "Phong cách công sở",
    description:
      "Khám phá bộ sưu tập văn phòng mới với thiết kế thanh lịch và chuyên nghiệp.",
    image:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
  },
];

const DailyNewsModal: React.FC<DailyNewsModalProps> = ({ isOpen, onClose }) => {
  // Get a random news item based on the current date
  const todayNews = useMemo(() => {
    const today = new Date();
    const seed = today.getDate() + today.getMonth() * 31;
    const randomIndex = seed % newsItems.length;
    return newsItems[randomIndex];
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/90 backdrop-blur-md rounded-2xl w-full max-w-6xl relative transform transition-all shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-600 hover:text-gray-800 z-10"
        >
          <X size={32} />
        </button>

        {/* Header */}
        <div className="p-12 border-b bg-gradient-to-r from-gray-900/90 to-gray-800/90 rounded-t-2xl backdrop-blur-sm">
          <h2 className="text-5xl font-bold text-gray-50">Tin tức hôm nay</h2>
          <p className="text-gray-300 mt-4 text-xl">
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Content */}
        <div className="p-12 bg-gray-50/80">
          <div className="flex gap-10 items-start">
            <img
              src={todayNews.image}
              alt={todayNews.title}
              className="w-80 h-80 object-cover rounded-2xl shadow-lg"
            />
            <div className="flex-1">
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                {todayNews.title}
              </h3>
              <p className="text-gray-700 text-2xl leading-relaxed">
                {todayNews.description}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-12 border-t bg-gray-50/50 rounded-b-2xl backdrop-blur-sm">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-4 px-8 rounded-xl text-2xl font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyNewsModal;
