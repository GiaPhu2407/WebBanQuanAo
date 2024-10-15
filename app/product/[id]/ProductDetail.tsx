"use client"; // Bắt buộc khi sử dụng hooks của React trong App Router
import React, { useEffect, useState } from "react";
import Link from "next/link"; // Import Link từ Next.js
import Header from "@/app/component/Header"; // Thay đổi đường dẫn nếu cần thiết

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  colors: string[];
  sizes: string[];
  images: string[];
}

interface ProductDetailProps {
  id: string; // Chỉ định id là kiểu string
}

const ProductDetail: React.FC<ProductDetailProps> = ({ id }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (id) {
      // Tải dữ liệu sản phẩm dựa trên ID
      const mockProducts: Product[] = [
        {
          id: "1",
          name: "Áo Khoác Nữ Gia Đình 3c Pro 1",
          image:
            "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-dod-qjn60341-xnh-5.jpg",
          price: 499000,
          colors: ["Cam", "Đỏ", "Xanh", "Đen", "Trắng"],
          sizes: ["S", "M", "L", "XL"],
          images: [
            "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-dod-qjn60341-xnh-5.jpg",
            "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-dod-qjn60341-xnh-7.jpg",
            "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-dod-qjn60341-xnh-8.jpg",
            "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-dod-qjn60341-xnh-11.jpg",
          ],
        },
        {
          id: "2",
          name: "Áo Khoác Nữ Gia Đình 3c Pro 2",
          image:
            "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-dod-qjn60341-xnh-7.jpg",
          price: 599000,
          colors: ["Trắng", "Xanh", "Đen"],
          sizes: ["M", "L"],
          images: [
            "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-dod-qjn60341-xnh-7.jpg",
            "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-dod-qjn60341-xnh-8.jpg",
            "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-dod-qjn60341-xnh-11.jpg",
          ],
        },
        {
          id: "3",
          name: "Áo Khoác Nữ Gia Đình 3c Pro 3",
          image:
            "https://m.yodycdn.com/fit-in/filters:format(webp)/products/ao-khoac-nam-akm6017-xth-6.jpg",
          price: 399000,
          colors: ["Đen", "Cam", "Đỏ"],
          sizes: ["S", "XL"],
          images: [
            "https://m.yodycdn.com/fit-in/filters:format(webp)/products/ao-khoac-nam-akm6017-xth-10.jpg",
            "https://m.yodycdn.com/fit-in/filters:format(webp)/products/ao-khoac-nam-akm6017-xth-5.jpg",
          ],
        },
      ];

      // Tìm sản phẩm dựa trên ID
      const foundProduct = mockProducts.find((product) => product.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.images[0]);
      }
    }
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  // Cập nhật breadcrumb để thêm ID sản phẩm
  const breadcrumbItems = ["Trang chủ", "Sản phẩm", `Sản phẩm ${product.id}`];

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
          {/* ... Thêm thông tin khác về sản phẩm nếu cần ... */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
