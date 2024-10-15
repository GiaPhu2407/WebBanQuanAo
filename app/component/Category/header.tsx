"use client";
import React, { useState } from "react";
import Header from "../Header";
import { useRouter } from "next/router";
import Link from "next/link";

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
    image:
      "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-dod-qjn60341-xnh-5.jpg", // Thay bằng đường dẫn hình ảnh thực tế
    price: 499000,
    colors: ["Cam", "Đỏ", "Xanh", "Đen", "Trắng"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-dod-qjn60341-xnh-5.jpg",
      "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-dod-qjn60341-xnh-7.jpg",
      "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-dod-qjn60341-xnh-8.jpg",
      "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-dod-qjn60341-xnh-11.jpg",
    ],
  };

  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <div>
      <Header />

      <div className="ml-5 mt-1">
        {breadcrumbItems.map((item, index) => (
          <Link key={index} href={""}>
            {item}
            {index < breadcrumbItems.length - 1 && " > "}
          </Link>
        ))}
      </div>

      <div className="flex flex-col md:flex-row p-4">
        {/* Phần hình ảnh sản phẩm */}
        <div className="flex flex-row w-full md:w-1/2">
          {/* Hình ảnh thu nhỏ */}
          <div className="flex flex-col space-y-2">
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

          {/* Hình ảnh chính */}
          <div className="ml-4 w-full">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
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
          <div className="mb-4">
            <p>Số Lượng:</p>
          </div>
          <div className="flex space-x-8">
            <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
              Thêm vào giỏ
            </button>
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Mua ngay
            </button>
          </div>
          <div className="flex space-x-2 mt-10">
            <button className="bg-[#FCAF17] shadow w-[600px] text-white py-2 px-4 rounded hover:bg-blue-600">
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default header;
