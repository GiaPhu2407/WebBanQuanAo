import React, { useCallback, useMemo } from "react";
import { X } from "lucide-react";

interface DailyNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const newsItems = [
  {
    title: "Bộ sưu tập mới ra mắt",
    description:
      "Khám phá bộ sưu tập mới nhất của chúng tôi với nhiều mẫu thiết kế độc đáo và phong cách.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Khuyến mãi đặc biệt mùa hè",
    description:
      "Giảm giá lên đến 50% cho các sản phẩm mùa mới. Nhanh tay shopping ngay!",
    image:
      "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Xu hướng thời trang 2025",
    description:
      "Cập nhật những xu hướng thời trang mới nhất cho năm 2025. Hãy là người dẫn đầu phong cách!",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80",
  },
];

const DailyNewsModal: React.FC<DailyNewsModalProps> = ({ isOpen, onClose }) => {
  const todayNews = useMemo(() => {
    const today = new Date();
    const seed = today.getDate() + today.getMonth() * 31;
    return newsItems[seed % newsItems.length];
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
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl transform scale-100 transition-all">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-500 hover:text-gray-800"
        >
          <X size={28} />
        </button>

        <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 p-8 text-white">
          <h2 className="text-4xl font-bold">Tin tức hôm nay</h2>
          <p className="text-gray-300 mt-2 text-lg">
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="p-8 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <img
            src={todayNews.image}
            alt={todayNews.title}
            className="w-full h-80 object-cover rounded-xl shadow-lg"
          />
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {todayNews.title}
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              {todayNews.description}
            </p>
          </div>
        </div>

        <div className="p-6 bg-gray-100 text-center">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyNewsModal;
