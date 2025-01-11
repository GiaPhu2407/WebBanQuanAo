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
        const sizes = sizeData.size; // API returns { size: [...] }

        // Fetch product sizes
        const productSizesResponse = await fetch("/api/productsize");
        if (!productSizesResponse.ok) {
          throw new Error("Không thể tải thông tin số lượng");
        }
        const productSizeData = await productSizesResponse.json();
        const productSizes = productSizeData.getProductSize; // API returns { getProductSize: [...] }

        // Combine size data with product size quantities
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

        // Sort sizes: available sizes first, then by size name
        const sortedSizes = sizesWithQuantities.sort(
          (
            a: { soluong: number; tenSize: string },
            b: { soluong: number; tenSize: any }
          ) => {
            if (a.soluong === 0 && b.soluong > 0) return 1;
            if (a.soluong > 0 && b.soluong === 0) return -1;
            return a.tenSize.localeCompare(b.tenSize);
          }
        );

        setAvailableSizes(sortedSizes);

        // Select first available size
        const firstAvailableSize = sortedSizes.find(
          (size: { soluong: number }) => size.soluong > 0
        );
        if (firstAvailableSize) {
          setSelectedSize(firstAvailableSize.idSize);
          setQuantity(1);
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

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

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

  const handleSizeChange = (sizeId: number) => {
    setSelectedSize(sizeId);
    setQuantity(1);
  };

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
      // Update product size quantity - Sửa lại tên các field cho đúng với API
      const response = await fetch("/api/productsize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idsanpham: product.idsanpham, // Sửa từ product_id thành idsanpham
          idSize: selectedSize, // Sửa từ size_id thành idSize
          soluong: selectedSizeData.soluong - quantity, // Sửa từ stock_quantity thành soluong
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
        // Update local state
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Toaster position="top-center" />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={selectedImage}
                  alt={product.tensanpham}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image) => (
                  <button
                    key={image.idImage}
                    onClick={() => setSelectedImage(image.url)}
                    className={`border-2 rounded-md overflow-hidden ${
                      selectedImage === image.url
                        ? "border-blue-500"
                        : "border-gray-200"
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
              <div className="space-y-2">
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

              {/* Size Selection */}
              <div className="space-y-4">
                <p className="font-medium">Chọn Size:</p>
                <div className="grid grid-cols-4 gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size.idSize}
                      onClick={() => handleSizeChange(size.idSize)}
                      disabled={size.soluong === 0}
                      className={`py-2 px-4 rounded-md border ${
                        selectedSize === size.idSize
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : size.soluong === 0
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-gray-200 hover:border-blue-500"
                      }`}
                    >
                      {size.tenSize}
                      <span className="block text-xs">
                        {size.soluong === 0 ? (
                          <span className="text-red-500">Hết hàng</span>
                        ) : (
                          `Còn ${size.soluong}`
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="space-y-4">
                <p className="font-medium">Số lượng:</p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={
                      !selectedSize ||
                      quantity >=
                        (availableSizes.find((s) => s.idSize === selectedSize)
                          ?.soluong || 0)
                    }
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart and Buy Now Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAddToCart(false)}
                  disabled={orderLoading || !selectedSize || quantity <= 0}
                  className="w-full py-3 px-6 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang thêm...
                    </span>
                  ) : (
                    "Thêm vào giỏ"
                  )}
                </button>
                <button
                  onClick={() => handleAddToCart(true)}
                  disabled={orderLoading || !selectedSize || quantity <= 0}
                  className="w-full py-3 px-6 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mua ngay
                </button>
              </div>

              {/* Product Description */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Mô tả sản phẩm</h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {product.mota}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
