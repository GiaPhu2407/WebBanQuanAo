// "use client";
// import React, { useState, useEffect } from "react";
// import Header from "../Header";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import { Decimal } from "decimal.js";

// interface SanPham {
//   tensanpham: string;
//   mota: string;
//   gia: number; // Hoặc string, tùy thuộc vào kiểu dữ liệu của giá
//   hinhanh: string;
//   idloaisanpham: number; // Sử dụng int thay vì string
//   giamgia: Decimal; // Sử dụng Decimal cho giảm giá

// }

// const ProductDetail: React.FC = () => {
//   const router = useRouter();
//   const { id } = router.query;
//   const [product, setProduct] = useState<SanPham | null>(null);
//   const [selectedImage, setSelectedImage] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (id) {
//       console.log(`Fetching product with ID: ${id}`); // Log ID
//       fetch(`/api/sanpham/${id}`)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }
//           return response.json();
//         })
//         .then((data: SanPham) => {
//           console.log(data); // Log dữ liệu nhận được
//           setProduct(data);
//           setLoading(false);
//         })
//         .catch((e) => {
//           console.error("Có lỗi khi tải dữ liệu sản phẩm:", e);
//           setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
//           setLoading(false);
//         });
//     }
//   }, [id]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-red-600">{error}</div>;
//   }

//   if (!product) {
//     return <div>Không tìm thấy sản phẩm.</div>;
//   }

//   const breadcrumbItems = [
//     "Trang Chủ",
//     "Nữ",
//     "Áo nữ",
//     "Áo khoác nữ",
//     "Áo gió nữ",
//     product.tensanpham, // Sử dụng trường tensanpham từ interface
//   ];

//   return (
//     <div>
//       <Header />

//       <div className="ml-5 mt-1 text-gray-500">
//         {breadcrumbItems.map((item, index) => (
//           <span key={index}>
//             <Link href={""} className="hover:text-blue-400">
//               {item}
//             </Link>
//             {index < breadcrumbItems.length - 1 && (
//               <span className="mx-1">{">"}</span>
//             )}
//           </span>
//         ))}
//       </div>

//       <div className="flex flex-col md:flex-row p-4">
//         {/* Phần hình ảnh sản phẩm */}
//         <div className="flex flex-row w-full md:w-1/2">
//           {/* Hình ảnh thu nhỏ */}
//           <div className="flex flex-col space-y-2">
//             {product.((img, index) => (
//               <img
//                 key={index}
//                 src={img}
//                 alt={`Thumbnail ${index}`}
//                 className="w-16 h-16 object-cover cursor-pointer border-2 border-gray-300 hover:border-blue-500"
//                 onClick={() => setSelectedImage(img)}
//               />
//             ))}
//           </div>

//           {/* Hình ảnh chính */}
//           <div className="ml-4 w-full">
//             <img
//               src={selectedImage}
//               alt={product.tensanpham}
//               className="w-full h-auto object-cover"
//             />
//           </div>
//         </div>

//         {/* Thông tin sản phẩm */}
//         <div className="w-full md:w-1/2 md:pl-4">
//           <h1 className="text-[100px] font-semibold mb-2">{product.tensanpham}</h1>
//           <p className="text-xl text-red-500 mb-4">
//             {product.gia.toLocaleString()} đ
//           </p>
//           <div className="mb-4">
//             <h3 className="font-semibold">Màu sắc:</h3>
//             <div className="flex space-x-2">
//               {product.colors.map((color) => (
//                 <span
//                   key={color}
//                   className={`inline-block w-8 h-8 rounded-full border-2 border-gray-300 ${
//                     color === "Cam" ? "bg-orange-500" : "bg-gray-300"
//                   }`}
//                 ></span>
//               ))}
//             </div>
//           </div>
//           <div className="mb-4">
//             <h3 className="font-semibold">Kích thước:</h3>
//             <div className="flex space-x-4">
//               {product.sizes.map((size) => (
//                 <span
//                   key={size}
//                   className="border border-gray-300 rounded px-2 py-1 cursor-pointer hover:bg-gray-200"
//                 >
//                   {size}
//                 </span>
//               ))}
//             </div>
//           </div>
//           {/* ... Thông tin chi tiết khác về sản phẩm ... */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../Header";

interface Product {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: number;
  mota: string;
  idloaisanpham: number;
  giamgia: number;
  loaisanpham: {
    tenloai: string;
    mota: string;
  };
}

const Category = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [sanpham, setSanpham] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-2.jpg"
  );

  const Images = [
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-2.jpg",
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-7.jpg",
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-1.jpg",
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-8.jpg",
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-11.jpg",
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-10.jpg",
    "https://m.yodycdn.com/videos/website/AKN/AKN5042.mp4",
  ];

  const handleImageClick = (image: string) => {
    setCurrentImage(image);
  };

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (id) {
      fetch(`/api/sanpham/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setSanpham(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy thông tin sản phẩm:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading)
    return (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="light"
      >
        <span className="loading loading-spinner text-blue-600 loading-lg"></span>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-red-600">{error}</div>
      </div>
    );

  if (!sanpham)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-gray-800">
          Không tìm thấy sản phẩm
        </div>
      </div>
    );

  return (
    <div>
      <Header />
      <div className="w-full h-full px-4 py-24" data-theme="light">
        <div className="w-full h-full flex flex-col">
          <div className="pb-4">
            <button
              onClick={() => router.push("/")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
            >
              <svg
                className="fill-current w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" />
              </svg>
              <span>Quay lại trang chủ</span>
            </button>
          </div>

          <h1 className="text-3xl font-bold mb-8 text-center">
            Chi tiết sản phẩm
          </h1>

          <div className="shadow-xl rounded-lg overflow-hidden w-full">
            <div className="md:flex gap-8">
              <div className="flex flex-col gap-2 items-start">
                {Images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Hình ảnh sản phẩm ${index + 1}`}
                    className="w-24 h-24 object-cover cursor-pointer border-2 hover:border-indigo-500"
                    onClick={() => handleImageClick(image)}
                  />
                ))}
              </div>

              <div className="xl:w-[700px] xl:h-[500px] md:mx-auto">
                <img
                  className="xl:h-[500px] xl:w-full h-96 object-contain"
                  src={currentImage}
                  alt={sanpham.tensanpham}
                />
              </div>

              <div className="px-8 py-4 bg-gray-50">
                <h2 className="text-xl font-bold mb-4">{sanpham.tensanpham}</h2>
                <p className="text-gray-700 mb-4">{sanpham.mota}</p>

                <h3 className="text-xl font-semibold text-gray-800 mt-8">
                  Giá bán
                </h3>
                <p className="mt-2 text-3xl font-bold text-black">
                  {Number(sanpham.gia).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>

                <div className="mt-6">
                  <h4 className="text-lg font-medium">
                    Chọn kích thước: {selectedSize || "Chưa chọn"}
                  </h4>
                  <div className="flex gap-4 mt-2">
                    {["S", "M", "L", "XL"].map((size) => (
                      <button
                        key={size}
                        className={`border-2 px-4 py-2 rounded-lg ${
                          selectedSize === size
                            ? "border-indigo-600 bg-indigo-100"
                            : "border-gray-300"
                        }`}
                        onClick={() => handleSizeSelect(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-medium">Số lượng:</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                      onClick={decrementQuantity}
                    >
                      -
                    </button>
                    <span className="text-xl font-bold">{quantity}</span>
                    <button
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                      onClick={incrementQuantity}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button className="w-48 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300">
                    Đặt cọc ngay
                  </button>
                  <button className="w-48 bg-slate-600 text-white py-2 rounded-md hover:bg-black transition duration-300">
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
