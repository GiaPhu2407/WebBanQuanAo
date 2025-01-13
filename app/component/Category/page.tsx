// "use client";
// import React, { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import toast, { Toaster } from "react-hot-toast";
// import Header from "../Header";
// import Footer from "../Footer";
// import { motion, AnimatePresence } from "framer-motion";

// interface ProductWithImages {
//   idsanpham: number;
//   tensanpham: string;
//   hinhanh: string;
//   gia: number;
//   mota: string;
//   idloaisanpham: number;
//   giamgia: number;
//   gioitinh: boolean;
//   size: string;
//   images: { idImage: number; url: string; altText: string | null }[];
// }

// interface Size {
//   idSize: number;
//   tenSize: string;
// }

// interface CartItem {
//   productId: number;
//   quantity: number;
//   sizeId: number;
// }

// const ProductDetail = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");

//   const [product, setProduct] = useState<ProductWithImages | null>(null);
//   const [selectedImage, setSelectedImage] = useState<string>("");
//   const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
//   const [selectedSize, setSelectedSize] = useState<number | null>(null);
//   const [quantity, setQuantity] = useState<number>(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [orderLoading, setOrderLoading] = useState(false);

//   // New states for cart animation
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);

//   useEffect(() => {
//     const fetchProductAndSizes = async () => {
//       if (!id) return;

//       try {
//         const [productResponse, sizeResponse] = await Promise.all([
//           fetch(`/api/category/${id}`),
//           fetch(`/api/size`),
//         ]);

//         if (!productResponse.ok)
//           throw new Error("Không thể lấy thông tin sản phẩm");
//         if (!sizeResponse.ok)
//           throw new Error("Không thể lấy thông tin kích thước");

//         const productData = await productResponse.json();
//         const sizeData = await sizeResponse.json();

//         setProduct(productData);
//         setSelectedImage(productData.hinhanh);
//         setAvailableSizes(sizeData.size);

//         // Set default size to first available size
//         if (sizeData.size.length > 0) {
//           setSelectedSize(sizeData.size[0].idSize);
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Load cart items from local storage on component mount
//     const savedCartItems = localStorage.getItem("cartItems");
//     if (savedCartItems) {
//       setCartItems(JSON.parse(savedCartItems));
//     }

//     fetchProductAndSizes();
//   }, [id]);

//   const fetchCartItems = async () => {
//     try {
//       const response = await fetch(`/api/countdonhang`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch cart items");
//       }
//       const data = await response.json();

//       // Assuming the API returns an array of cart items
//       setCartItems(data);

//       // Calculate total item count
//     } catch (error) {
//       console.error("Error fetching cart items:", error);
//       toast.error("Không thể tải giỏ hàng");
//     }
//   };

//   // Modify useEffect to use the new function
//   useEffect(() => {
//     fetchCartItems();
//   }, []); // Empty dependency array to run only on component mount
//   useEffect(() => {
//     // Save cart items to local storage whenever they change
//     if (cartItems.length > 0) {
//       localStorage.setItem("cartItems", JSON.stringify(cartItems));
//     }
//   }, [cartItems]);

//   const handleQuantityChange = (newQuantity: number) => {
//     if (newQuantity >= 1) {
//       setQuantity(newQuantity);
//     }
//   };

//   const handleSizeChange = (newSize: string) => {
//     setSelectedSize(parseInt(newSize));
//     setQuantity(1);
//   };

//   const handleOrderCreation = async (isInstantBuy: boolean) => {
//     if (!product || !selectedSize || quantity <= 0) {
//       toast.error("Vui lòng chọn size và số lượng");
//       return;
//     }

//     setOrderLoading(true);
//     setIsAddingToCart(true);

//     try {
//       const orderResponse = await fetch("/api/giohang", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           idsanpham: product.idsanpham,
//           soluong: quantity,
//           sizeId: selectedSize,
//         }),
//       });

//       const result = await orderResponse.json();

//       if (orderResponse.ok) {
//         const selectedSizeObj = availableSizes.find(
//           (s) => s.idSize === selectedSize
//         );
//         const sizeName = selectedSizeObj
//           ? selectedSizeObj.tenSize
//           : selectedSize;

//         // Update cart items
//         const newCartItem: CartItem = {
//           productId: product.idsanpham,
//           quantity,
//           sizeId: selectedSize,
//         };

//         setCartItems((prevItems: CartItem[]) => {
//           // Ensure prevItems is an array
//           const currentItems = Array.isArray(prevItems) ? prevItems : [];

//           // Find existing item
//           const existingItemIndex = currentItems.findIndex(
//             (item) =>
//               item.productId === newCartItem.productId &&
//               item.sizeId === newCartItem.sizeId
//           );

//           if (existingItemIndex > -1) {
//             // Update quantity if item exists
//             const updatedItems = [...currentItems];
//             updatedItems[existingItemIndex] = {
//               ...updatedItems[existingItemIndex],
//               quantity: updatedItems[existingItemIndex].quantity + quantity,
//             };
//             return updatedItems;
//           }

//           // Add new item if not exists
//           return [...currentItems, newCartItem];
//         });

//         toast.success(
//           `Đã thêm ${quantity} sản phẩm ${product.tensanpham} size ${sizeName} vào giỏ hàng`
//         );

//         setTimeout(() => {
//           setIsAddingToCart(false);
//           if (isInstantBuy) {
//             router.push("/component/shopping");
//           }
//         }, 1000);

//         // Refresh cart items after adding
//         await fetchCartItems();
//       } else {
//         toast.error(result.error || "Có lỗi xảy ra khi đặt hàng");
//         setIsAddingToCart(false);
//       }
//     } catch (err) {
//       toast.error("Có lỗi xảy ra khi đặt hàng");
//       setIsAddingToCart(false);
//     } finally {
//       setOrderLoading(false);
//     }
//   };

//   if (loading) return <div className="p-4">Đang tải...</div>;
//   if (error) return <div className="p-4 text-red-500">Lỗi: {error}</div>;
//   if (!product) return <div className="p-4">Không tìm thấy sản phẩm</div>;

//   const discountedPrice =
//     product.giamgia > 0
//       ? product.gia * (1 - product.giamgia / 100)
//       : product.gia;

//   return (
//     <div>
//       <Header />
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           success: {
//             style: {
//               background: "#4CAF50",
//               color: "white",
//             },
//           },
//           error: {
//             style: {
//               background: "#F44336",
//               color: "white",
//             },
//           },
//         }}
//       />

//       {/* Cart Icon with Item Count */}
//       <div className="fixed top-4 right-4 z-50">
//         <div
//           tabIndex={0}
//           role="button"
//           className="btn btn-ghost btn-circle"
//           onClick={() => router.push("/component/shopping")}
//         >
//           <div className="indicator">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//               />
//             </svg>
//             {cartItems.length > 0 && (
//               <span className="badge badge-sm indicator-item">
//                 {cartItems.reduce((total, item) => total + item.quantity, 0)}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Animated product when adding to cart */}
//       <AnimatePresence>
//         {isAddingToCart && product && (
//           <motion.div
//             initial={{ scale: 1, opacity: 1 }}
//             animate={{
//               scale: [1, 1.2, 0.5],
//               opacity: [1, 0.8, 0],
//               x: [0, 100, window.innerWidth],
//             }}
//             transition={{
//               duration: 1,
//               ease: "easeInOut",
//             }}
//             className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
//           >
//             <img
//               src={selectedImage}
//               alt={product.tensanpham}
//               className="w-24 h-24 object-cover rounded-lg"
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="container mx-auto p-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Image Gallery */}
//           <div className="flex gap-4">
//             <div className="flex flex-col gap-2">
//               <div
//                 className={`w-20 aspect-square cursor-pointer rounded-lg overflow-hidden border-2 ${
//                   selectedImage === product.hinhanh
//                     ? "border-blue-500"
//                     : "border-transparent"
//                 }`}
//                 onClick={() => setSelectedImage(product.hinhanh)}
//               >
//                 <img
//                   src={product.hinhanh}
//                   alt="Main"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               {product.images.map((image) => (
//                 <div
//                   key={image.idImage}
//                   className={`w-20 aspect-square cursor-pointer rounded-lg overflow-hidden border-2 ${
//                     selectedImage === image.url
//                       ? "border-blue-500"
//                       : "border-transparent"
//                   }`}
//                   onClick={() => setSelectedImage(image.url)}
//                 >
//                   <img
//                     src={image.url}
//                     alt={image.altText || "Product image"}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* Main Image */}
//             <div className="flex-1">
//               <div className="aspect-square relative overflow-hidden rounded-xl">
//                 <img
//                   src={selectedImage}
//                   alt={product.tensanpham}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Product Info */}
//           <div className="space-y-4">
//             <h1 className="text-2xl font-bold">{product.tensanpham}</h1>

//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <span className="text-2xl font-bold text-blue-600">
//                   {new Intl.NumberFormat("vi-VN", {
//                     style: "currency",
//                     currency: "VND",
//                   }).format(discountedPrice)}
//                 </span>
//                 {product.giamgia > 0 && (
//                   <span className="text-lg text-gray-500 line-through">
//                     {new Intl.NumberFormat("vi-VN", {
//                       style: "currency",
//                       currency: "VND",
//                     }).format(product.gia)}
//                   </span>
//                 )}
//               </div>
//               {product.giamgia > 0 && (
//                 <span className="inline-block px-2 py-1 text-sm font-semibold text-white bg-red-500 rounded-full">
//                   Giảm {product.giamgia}%
//                 </span>
//               )}
//             </div>

//             <div className="prose prose-sm">
//               <p>{product.mota}</p>
//             </div>

//             <div className="flex items-center gap-2">
//               <span className="px-3 py-1 text-sm border border-gray-300 rounded-full">
//                 {product.gioitinh ? "Nam" : "Nữ"}
//               </span>
//             </div>

//             {/* Size Selector */}
//             <div className="space-y-4">
//               <div className="flex items-center space-x-4">
//                 <span className="text-sm font-medium">Kích thước:</span>
//                 <select
//                   value={selectedSize || ""}
//                   onChange={(e) => handleSizeChange(e.target.value)}
//                   className="border border-gray-300 rounded-lg py-2 px-3"
//                 >
//                   {availableSizes.map((sizeOption) => (
//                     <option key={sizeOption.idSize} value={sizeOption.idSize}>
//                       {sizeOption.tenSize}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Quantity Selector */}
//               <div className="flex items-center space-x-4">
//                 <span className="text-sm font-medium">Số lượng:</span>
//                 <div className="flex items-center border border-gray-300 rounded-lg">
//                   <button
//                     onClick={() => handleQuantityChange(quantity - 1)}
//                     className="px-3 py-2 hover:bg-gray-100"
//                     disabled={quantity <= 1}
//                   >
//                     -
//                   </button>
//                   <input
//                     type="number"
//                     min="1"
//                     value={quantity}
//                     onChange={(e) =>
//                       handleQuantityChange(parseInt(e.target.value) || 1)
//                     }
//                     className="w-16 text-center border-x border-gray-300"
//                   />
//                   <button
//                     onClick={() => handleQuantityChange(quantity + 1)}
//                     className="px-3 py-2 hover:bg-gray-100"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-4">
//               <button
//                 onClick={() => handleOrderCreation(false)}
//                 disabled={orderLoading}
//                 className="flex-1 px-6 py-3 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50"
//               >
//                 {orderLoading ? "Đang xử lý..." : "Thêm vào giỏ hàng"}
//               </button>
//               <button
//                 onClick={() => handleOrderCreation(true)}
//                 disabled={orderLoading}
//                 className="flex-1 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
//               >
//                 {orderLoading ? "Đang xử lý..." : "Mua ngay"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default ProductDetail;

"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Header from "../Header";
import Footer from "../Footer";
import ProductReviews from "../Review/Productreviews";

interface ProductWithImages {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: number;
  mota: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: boolean;
  size: string;
  images: { idImage: number; url: string; altText: string | null }[];
}

interface Size {
  idSize: number;
  tenSize: string;
  soluong: number;
}

interface CartItem {
  productId: number;
  quantity: number;
  sizeId: number;
}

interface Review {
  iddanhgia: number;
  idsanpham: number;
  idUsers: number;
  sao: number;
  noidung: string;
  ngaydanhgia: string;
  Users?: {
    tentaikhoan: string;
  };
}

const ProductDetail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [product, setProduct] = useState<ProductWithImages | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ idUsers: number } | null>(
    null
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/check");
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAuthStatus();
  }, []);

  // Fetch product details, sizes and reviews
  useEffect(() => {
    const fetchProductAndSizes = async () => {
      if (!id) return;

      try {
        // Fetch product details
        const productResponse = await fetch(`/api/category/${id}`);
        if (!productResponse.ok) {
          throw new Error("Không thể tải thông tin sản phẩm");
        }
        const productData = await productResponse.json();
        setProduct(productData);
        setSelectedImage(productData.hinhanh);

        // Fetch sizes
        const sizesResponse = await fetch("/api/size");
        if (!sizesResponse.ok) {
          throw new Error("Không thể tải thông tin size");
        }
        const sizeData = await sizesResponse.json();
        const sizes = sizeData.size;

        // Fetch product sizes
        const productSizesResponse = await fetch("/api/productsize");
        if (!productSizesResponse.ok) {
          throw new Error("Không thể tải thông tin số lượng");
        }
        const productSizeData = await productSizesResponse.json();
        const productSizes = productSizeData.getProductSize;

        // Combine size data
        const sizesWithQuantities = sizes.map(
          (size: { idSize: any; tenSize: any }) => {
            const productSize = productSizes.find(
              (ps: { idSize: any; idsanpham: number }) =>
                ps.idSize === size.idSize && ps.idsanpham === parseInt(id)
            );
            return {
              idSize: size.idSize,
              tenSize: size.tenSize,
              soluong: productSize ? productSize.soluong : 0,
            };
          }
        );

        setAvailableSizes(sizesWithQuantities);

        // Select first available size
        const firstAvailableSize = sizesWithQuantities.find(
          (size: { soluong: number }) => size.soluong > 0
        );
        if (firstAvailableSize) {
          setSelectedSize(firstAvailableSize.idSize);
          setQuantity(1);
        }

        // Fetch reviews
        const reviewsResponse = await fetch(`/api/evaluate?idsanpham=${id}`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.data || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    const loadCartItems = () => {
      const savedCartItems = localStorage.getItem("cartItems");
      if (savedCartItems) {
        try {
          const parsedItems = JSON.parse(savedCartItems);
          setCartItems(Array.isArray(parsedItems) ? parsedItems : []);
        } catch (err) {
          console.error("Error parsing cart items:", err);
          setCartItems([]);
        }
      }
    };

    loadCartItems();
    fetchProductAndSizes();
  }, [id]);

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (!selectedSize) return;

    const selectedSizeData = availableSizes.find(
      (s) => s.idSize === selectedSize
    );
    if (!selectedSizeData) return;

    const maxQuantity = selectedSizeData.soluong;
    const validQuantity = Math.min(Math.max(1, newQuantity), maxQuantity);
    setQuantity(validQuantity);
  };

  // Handle size change
  const handleSizeChange = (sizeId: number) => {
    setSelectedSize(sizeId);
    setQuantity(1);
  };

  // Handle add to cart
  const handleAddToCart = async (isInstantBuy: boolean) => {
    if (!product || !selectedSize || quantity <= 0) {
      toast.error("Vui lòng chọn size và số lượng");
      return;
    }

    const selectedSizeData = availableSizes.find(
      (s) => s.idSize === selectedSize
    );
    if (!selectedSizeData || selectedSizeData.soluong < quantity) {
      toast.error("Số lượng trong kho không đủ");
      return;
    }

    setOrderLoading(true);
    setIsAddingToCart(true);

    try {
      // Update product size quantity
      const response = await fetch("/api/productsize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idsanpham: product.idsanpham,
          idSize: selectedSize,
          soluong: selectedSizeData.soluong - quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi cập nhật số lượng");
      }

      // Add to cart
      const cartResponse = await fetch("/api/giohang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idsanpham: product.idsanpham,
          soluong: quantity,
          sizeId: selectedSize,
        }),
      });

      const cartData = await cartResponse.json();

      if (cartResponse.ok) {
        setAvailableSizes((prevSizes) =>
          prevSizes.map((size) =>
            size.idSize === selectedSize
              ? { ...size, soluong: size.soluong - quantity }
              : size
          )
        );

        const newCartItem: CartItem = {
          productId: product.idsanpham,
          quantity,
          sizeId: selectedSize,
        };

        setCartItems((prevItems) => {
          const existingItemIndex = prevItems.findIndex(
            (item) =>
              item.productId === newCartItem.productId &&
              item.sizeId === newCartItem.sizeId
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...prevItems];
            updatedItems[existingItemIndex].quantity += quantity;
            return updatedItems;
          }

          return [...prevItems, newCartItem];
        });

        toast.success(
          `Đã thêm ${quantity} sản phẩm ${product.tensanpham} size ${selectedSizeData.tenSize} vào giỏ hàng`
        );

        if (isInstantBuy) {
          router.push("/component/shopping");
        }
      } else {
        throw new Error(
          cartData.error || "Có lỗi xảy ra khi thêm vào giỏ hàng"
        );
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setOrderLoading(false);
      setIsAddingToCart(false);
    }
  };

  // Handle submit review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để đánh giá");
      return;
    }

    if (!comment.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    setIsSubmittingReview(true);

    try {
      const response = await fetch("/api/danhgia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idsanpham: parseInt(id!),
          idUsers: currentUser.idUsers,
          sao: rating,
          noidung: comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi gửi đánh giá");
      }

      toast.success("Đánh giá thành công");
      setComment("");
      setRating(5);

      // Refresh reviews
      const reviewsResponse = await fetch(`/api/evaluate?idsanpham=${id}`);
      const reviewsData = await reviewsResponse.json();
      setReviews(reviewsData.data || []);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error instanceof Error ? error.message : "Lỗi khi gửi đánh giá"
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Lỗi: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Không tìm thấy sản phẩm
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, review) => acc + review.sao, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Toaster position="top-center" />

      <div className="container mx-auto px-4 py-8">
        {/* Product Details Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="flex flex-row-reverse gap-6">
              <div className="flex-1 max-w-2xl">
                <div className="relative h-[500px]">
                  <img
                    src={selectedImage}
                    alt={product.tensanpham}
                    className="w-full h-full object-contain rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 w-20">
                {product.images.map((image) => (
                  <button
                    key={image.idImage}
                    onClick={() => setSelectedImage(image.url)}
                    className={`relative w-full h-20 border-2 rounded-md overflow-hidden transition-all ${
                      selectedImage === image.url
                        ? "border-blue-500 shadow-md"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.altText || ""}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{product.tensanpham}</h1>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-semibold text-red-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.gia)}
                  </p>
                  {product.giamgia > 0 && (
                    <p className="text-sm text-gray-500 line-through">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.gia * (1 + product.giamgia / 100))}
                    </p>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Tổng số lượng:{" "}
                  {availableSizes.reduce((acc, size) => acc + size.soluong, 0)}
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-3">
                <p className="font-medium">Kích thước:</p>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size.idSize}
                      onClick={() => handleSizeChange(size.idSize)}
                      disabled={size.soluong === 0}
                      className={`px-4 py-2 border rounded-md transition-all ${
                        selectedSize === size.idSize
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : size.soluong === 0
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {size.tenSize} ({size.soluong})
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <p className="font-medium">Số lượng:</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={
                      !selectedSize ||
                      quantity >=
                        (availableSizes.find((s) => s.idSize === selectedSize)
                          ?.soluong || 0)
                    }
                    className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleAddToCart(false)}
                  disabled={orderLoading || !selectedSize}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {orderLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                      Đang xử lý...
                    </span>
                  ) : (
                    "Thêm vào giỏ hàng"
                  )}
                </button>
                <button
                  onClick={() => handleAddToCart(true)}
                  disabled={orderLoading || !selectedSize}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mua ngay
                </button>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Mô tả sản phẩm</h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {product.mota}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Reviews Section */}
        <ProductReviews
          productId={product?.idsanpham || 0}
          // userId={currentUser?.idUsers || 0}
        />
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
