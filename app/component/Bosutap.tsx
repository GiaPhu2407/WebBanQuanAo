import React from "react";

const FeaturedCollection = () => {
  const products = [
    {
      image:
        "https://m.yodycdn.com/fit-in/filters:format(webp)/products/xtra.jpg",
      alt: "A woman wearing a beige thermal shirt with a temperature increase symbol",
      title: "Áo giữ nhiệt XTRA-HEAT™",
      description:
        "Công nghệ khóa ấm, hạn chế thoát nhiệt tự động, hạn chế tĩnh điện mùa đông.",
      buttonText: "Tìm hiểu thêm",
      link: "/xtra-heat",
    },
    {
      image:
        "https://m.yodycdn.com/fit-in/filters:format(webp)/products/jean-bst-section.jpg",
      alt: "A man and a woman wearing YODY jeans standing next to a bicycle",
      title: "YODY Jeans",
      description:
        "Công nghệ mới đột phá, tôn dáng với chất liệu mềm mại, thoáng khí, siêu co giãn.",
      buttonText: "Tìm hiểu thêm",
      link: "/yody-jeans",
    },
    {
      image:
        "https://m.yodycdn.com/fit-in/filters:format(webp)/products/phao-bst-section.jpg",
      alt: "A woman wearing a white puffer jacket holding a cup",
      title: "Áo phao",
      description: "Ấm êm cùng gia đình với những mẫu áo phao mới nhất!",
      buttonText: "Xem bộ sưu tập",
      link: "/ao-phao",
    },
    {
      image:
        "https://m.yodycdn.com/fit-in/filters:format(webp)/products/office-bst-section.jpg",
      alt: "Two men in office attire, one sitting and one standing next to a desk",
      title: "Đồ Công sở - Smart.Cool",
      description:
        "Thiết kế tinh tế, tôn dáng, co giãn linh hoạt, mang lại sự thoải mái cho mọi hoạt động.",
      buttonText: "Tìm hiểu thêm",
      link: "/smart-cool",
    },
  ];

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">
          Bộ sưu tập nổi bật
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div key={index} className="text-center">
              <a href={product.link}>
                <img
                  src={product.image}
                  alt={product.alt}
                  className="mx-auto"
                />
              </a>
              <h2 className="text-lg font-semibold mt-4">{product.title}</h2>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <a href={product.link}>
                <button className="mt-4 px-4 py-2 bg-gray-200 text-black rounded-full">
                  {product.buttonText}
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCollection;
