"use client";
import React, { useState } from "react";
import Header from "../Header";
import { useRouter } from "next/router";

const header = () => {
  const breadcrumbItems = [
    "Trang Chủ",
    "Nữ",
    "Áo nữ",
    "Áo khoác nữ",
    "Áo gió nữ",
    "Áo Khoác Nữ Gia Đình 3c Pro",
  ];
  const product = {
    id: 3,
    name: "Áo Khoác Nữ Gia Đình 3c Pro",
    image: "/images/product3.jpg", // Thay bằng đường dẫn hình ảnh thực tế
    price: 499000,
    colors: ["Cam", "Đỏ", "Xanh", "Đen", "Trắng"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/images/product1.jpg",
      "/images/product2.jpg",
      "/images/product3.jpg",
      "/images/product4.jpg",
    ],
  };

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
//   const router = useRouter();
//   const { id } = router.query; //
  return (
    <div>
      <Header />

      <div>
        {breadcrumbItems.map((item, index) => (
          <span key={index}>
            {item}
            {index < breadcrumbItems.length - 1 && " > "}
          </span>
        ))}
      </div>

      <div className="flex flex-col md:flex-row p-4">
        {/* Phần hình ảnh sản phẩm */}
        <div className="w-full md:w-1/2">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-auto object-cover"
          />
          <div className="flex space-x-2 mt-2">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                className="w-16 h-16 object-cover cursor-pointer border-2 border-gray-300 hover:border-blue-500"
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="w-full md:w-1/2 md:pl-4">
          <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
          <p className="text-xl text-red-500 mb-4">
            {product.price.toLocaleString()} đ
          </p>
          <div className="mb-4">
            <h3 className="font-semibold">Màu sắc:</h3>
            <div className="flex space-x-2">
              {product.colors.map((color) => (
                <span
                  key={color}
                  className={`inline-block w-8 h-8 rounded-full border-2 border-gray-300 ${
                    color === "Cam" ? "bg-orange-500" : "bg-gray-300"
                  }`}
                ></span>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Kích thước:</h3>
            <div className="flex space-x-4">
              {product.sizes.map((size) => (
                <span
                  key={size}
                  className="border border-gray-300 rounded px-2 py-1 cursor-pointer hover:bg-gray-200"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
              Thêm vào giỏ
            </button>
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Mua ngay
            </button>
          </div>
        </div>
        <div />
      </div>
    </div>
  );
};

export default header;
