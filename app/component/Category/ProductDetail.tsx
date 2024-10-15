"use client";
import React, { useState, useEffect } from "react";
import Header from "../Header";
import { useRouter } from "next/router";
import Link from "next/link";
import { MdOutlineLocalShipping, MdSecurity } from "react-icons/md";
import { CgArrowsExchange } from "react-icons/cg";
import { FiClock } from "react-icons/fi";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  colors: string[];
  sizes: string[];
  images: string[];
}

const ProductDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (id) {
      // Tại đây, bạn sẽ tải dữ liệu sản phẩm dựa trên ID
      // Trong ví dụ này, chúng ta sẽ sử dụng dữ liệu mẫu
      const mockProduct: Product = {
        id: id as string,
        name: `Áo Khoác Nữ Gia Đình 3c Pro ${id}`,
        image: "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-dod-qjn60341-xnh-5.jpg",
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
      setProduct(mockProduct);
      setSelectedImage(mockProduct.images[0]);
    }
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const breadcrumbItems = [
    "Trang Chủ",
    "Nữ",
    "Áo nữ",
    "Áo khoác nữ",
    "Áo gió nữ",
    product.name,
  ];

  return (
    <div>
      <Header />

      <div className="ml-5 mt-1 text-gray-500">
        {breadcrumbItems.map((item, index) => (
          <span key={index}>
            <Link href={""} className="hover:text-blue-400">
              {item}
            </Link>
            {index < breadcrumbItems.length - 1 && (
              <span className="mx-1">{">"}</span>
            )}
          </span>
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
          {/* ... Rest of the product details ... */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;