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
import Footer from "../Footer";

// Interface for product review
interface Review {
  id: number;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

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
  reviews?: Review[]; // Optional reviews for the product
}

const Category = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // State management for product details and reviews
  const [sanpham, setSanpham] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-2.jpg"
  );

  // New state for reviews
  const [newReview, setNewReview] = useState({
    username: "",
    rating: 5,
    comment: "",
  });

  // Image gallery for product
  const Images = [
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-2.jpg",
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-7.jpg",
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-1.jpg",
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-8.jpg",
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-11.jpg",
    "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-10.jpg",
    "https://m.yodycdn.com/videos/website/AKN/AKN5042.mp4",
  ];

  // Handler for image selection in gallery
  const handleImageClick = (image: string) => {
    setCurrentImage(image);
  };

  // State for product configuration
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Handlers for size and quantity selection
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

  // Handler for submitting a new review
  const submitReview = () => {
    if (!sanpham) return;

    // Create a new review object
    const review: Review = {
      id: (sanpham.reviews?.length || 0) + 1,
      username: newReview.username,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString(),
    };

    // Update product reviews (in a real app, this would be an API call)
    setSanpham({
      ...sanpham,
      reviews: [...(sanpham.reviews || []), review],
    });

    // Reset review form
    setNewReview({
      username: "",
      rating: 5,
      comment: "",
    });
  };

  // Calculate average rating
  const calculateAverageRating = (reviews?: Review[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // Fetch product details on component mount
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

  // Loading and error states remain the same
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
        {/* Existing product detail layout */}
        <div className="w-full h-full flex flex-col">
          {/* Back button */}
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

          {/* Product details section */}
          <h1 className="text-3xl font-bold mb-8 text-center">
            Chi tiết sản phẩm
          </h1>

          <div className="shadow-xl rounded-lg overflow-hidden w-full">
            <div className="md:flex gap-8">
              {/* Image gallery section */}
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

              {/* Main product image */}
              <div className="xl:w-[700px] xl:h-[500px] md:mx-auto">
                <img
                  className="xl:h-[500px] xl:w-full h-96 object-contain"
                  src={currentImage}
                  alt={sanpham.tensanpham}
                />
              </div>

              {/* Product information section */}
              <div className="px-8 py-4 bg-gray-50">
                <h2 className="text-xl font-bold mb-4">{sanpham.tensanpham}</h2>
                <p className="text-gray-700 mb-4">{sanpham.mota}</p>

                {/* Average Rating Display */}
                <div className="flex items-center mb-4">
                  <span className="text-yellow-500 mr-2">★</span>
                  <span className="font-bold">
                    {calculateAverageRating(sanpham.reviews)} / 5 (
                    {sanpham.reviews?.length || 0} đánh giá)
                  </span>
                </div>

                {/* Pricing section */}
                <h3 className="text-xl font-semibold text-gray-800 mt-8">
                  Giá bán
                </h3>
                <p className="mt-2 text-3xl font-bold text-black">
                  {Number(sanpham.gia).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>

                {/* Size selection */}
                <div className="mt-6">
                  <h4 className="text-lg font-medium">
                    Chọn kích thước: {selectedSize ? selectedSize : "Chưa chọn"}
                  </h4>
                  <div className="flex space-x-4 mt-2">
                    {["S", "M", "L", "XL"].map((size) => (
                      <span
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`border border-gray-300 rounded px-2 py-1 cursor-pointer hover:bg-gray-200 ${
                          selectedSize === size ? "bg-gray-200" : ""
                        }`}
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quantity selection */}
                <div className="mt-6">
                  <h4 className="text-lg font-medium">Số lượng:</h4>
                  <div className="flex items-center mt-2 space-x-4">
                    <button
                      onClick={decrementQuantity}
                      className="px-3 py-1 border rounded hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="px-3 py-1 border rounded hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="mt-8">
                  <button className="w-full py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Review Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold">Đánh giá sản phẩm</h3>
            <div className="mt-4 space-y-4">
              {sanpham.reviews && sanpham.reviews.length > 0 ? (
                sanpham.reviews.map((review) => (
                  <div key={review.id} className="p-4 border rounded-lg">
                    <h4 className="text-lg font-semibold">{review.username}</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className={`mr-1 ${
                            index < review.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p>Chưa có đánh giá nào.</p>
              )}
            </div>

            {/* Add a New Review Form */}
            <div className="mt-8 p-4 border rounded-lg">
              <h4 className="text-lg font-semibold">Thêm đánh giá của bạn</h4>
              <input
                type="text"
                placeholder="Tên của bạn"
                value={newReview.username}
                onChange={(e) =>
                  setNewReview({ ...newReview, username: e.target.value })
                }
                className="w-full p-2 mt-2 border rounded"
              />
              <textarea
                placeholder="Nhận xét của bạn"
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                className="w-full p-2 mt-2 border rounded"
              ></textarea>
              <div className="flex items-center mt-2">
                <span className="mr-2">Đánh giá:</span>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      rating: parseInt(e.target.value) || 5,
                    })
                  }
                  className="w-16 p-2 border rounded"
                />
              </div>
              <button
                onClick={submitReview}
                className="w-full mt-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Category;
