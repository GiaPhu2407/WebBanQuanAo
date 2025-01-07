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
//         throw new Error('Failed to fetch cart items');
//       }
//       const data = await response.json();
      
//       // Assuming the API returns an array of cart items
//       setCartItems(data);
      
//       // Calculate total item count
      
//     } catch (error) {
//       console.error('Error fetching cart items:', error);
//       toast.error('Không thể tải giỏ hàng');
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
//         // Find the selected size name
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

//         setCartItems((prevItems) => {
//           // Check if product with same size already exists
//           const existingItemIndex = prevItems.findIndex(
//             (item) =>
//               item.productId === newCartItem.productId &&
//               item.sizeId === newCartItem.sizeId
//           );

//           if (existingItemIndex > -1) {
//             // Update quantity if item exists
//             const updatedItems = [...prevItems];
//             updatedItems[existingItemIndex] = {
//               ...updatedItems[existingItemIndex],
//               quantity: updatedItems[existingItemIndex].quantity + quantity,
//             };
//             return updatedItems;
//           }

//           // Add new item if not exists
//           return [...prevItems, newCartItem];
//         });

//         toast.success(
//           `Đã thêm ${quantity} sản phẩm ${product.tensanpham} size ${sizeName} vào giỏ hàng`
//         );

//         // Reset adding to cart state after animation
//         setTimeout(() => {
//           setIsAddingToCart(false);
//           if (isInstantBuy) {
//             router.push("/component/shopping");
//           }
//         }, 1000);
      
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
import { motion, AnimatePresence } from "framer-motion";

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

  // New states for cart animation
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProductAndSizes = async () => {
      if (!id) return;

      try {
        const [productResponse, sizeResponse] = await Promise.all([
          fetch(`/api/category/${id}`),
          fetch(`/api/size`),
        ]);

        if (!productResponse.ok)
          throw new Error("Không thể lấy thông tin sản phẩm");
        if (!sizeResponse.ok)
          throw new Error("Không thể lấy thông tin kích thước");

        const productData = await productResponse.json();
        const sizeData = await sizeResponse.json();

        setProduct(productData);
        setSelectedImage(productData.hinhanh);
        setAvailableSizes(sizeData.size);

        // Set default size to first available size
        if (sizeData.size.length > 0) {
          setSelectedSize(sizeData.size[0].idSize);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    // Load cart items from local storage on component mount
    const savedCartItems = localStorage.getItem("cartItems");
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }

    fetchProductAndSizes();
  }, [id]);

  useEffect(() => {
    // Save cart items to local storage whenever they change
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleSizeChange = (newSize: string) => {
    setSelectedSize(parseInt(newSize));
    setQuantity(1);
  };

  const handleOrderCreation = async (isInstantBuy: boolean) => {
    if (!product || !selectedSize || quantity <= 0) {
      toast.error("Vui lòng chọn size và số lượng");
      return;
    }

    setOrderLoading(true);
    setIsAddingToCart(true);

    try {
      const orderResponse = await fetch("/api/giohang", {
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

      const result = await orderResponse.json();

      if (orderResponse.ok) {
        // Find the selected size name
        const selectedSizeObj = availableSizes.find(
          (s) => s.idSize === selectedSize
        );
        const sizeName = selectedSizeObj
          ? selectedSizeObj.tenSize
          : selectedSize;

        // Update cart items
        const newCartItem: CartItem = {
          productId: product.idsanpham,
          quantity,
          sizeId: selectedSize,
        };

        setCartItems((prevItems) => {
          // Check if product with same size already exists
          const existingItemIndex = prevItems.findIndex(
            (item) =>
              item.productId === newCartItem.productId &&
              item.sizeId === newCartItem.sizeId
          );

          if (existingItemIndex > -1) {
            // Update quantity if item exists
            const updatedItems = [...prevItems];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity,
            };
            return updatedItems;
          }

          // Add new item if not exists
          return [...prevItems, newCartItem];
        });

        toast.success(
          `Đã thêm ${quantity} sản phẩm ${product.tensanpham} size ${sizeName} vào giỏ hàng`
        );

        // Reset adding to cart state after animation
        setTimeout(() => {
          setIsAddingToCart(false);
          if (isInstantBuy) {
            router.push("/component/shopping");
          }
        }, 1000);
      } else {
        toast.error(result.error || "Có lỗi xảy ra khi đặt hàng");
        setIsAddingToCart(false);
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra khi đặt hàng");
      setIsAddingToCart(false);
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return <div className="p-4">Đang tải...</div>;
  if (error) return <div className="p-4 text-red-500">Lỗi: {error}</div>;
  if (!product) return <div className="p-4">Không tìm thấy sản phẩm</div>;

  const discountedPrice =
    product.giamgia > 0
      ? product.gia * (1 - product.giamgia / 100)
      : product.gia;

  return (
    <div>
      <Header />
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#4CAF50",
              color: "white",
            },
          },
          error: {
            style: {
              background: "#F44336",
              color: "white",
            },
          },
        }}
      />

      {/* Cart Icon with Item Count */}
      <div className="fixed top-4 right-4 z-50">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle"
          onClick={() => router.push("/component/shopping")}
        >
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cartItems.length > 0 && (
              <span className="badge badge-sm indicator-item">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Animated product when adding to cart */}
      <AnimatePresence>
        {isAddingToCart && product && (
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{
              scale: [1, 1.2, 0.5],
              opacity: [1, 0.8, 0],
              x: [0, 100, window.innerWidth],
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <img
              src={selectedImage}
              alt={product.tensanpham}
              className="w-24 h-24 object-cover rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <div
                className={`w-20 aspect-square cursor-pointer rounded-lg overflow-hidden border-2 ${
                  selectedImage === product.hinhanh
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImage(product.hinhanh)}
              >
                <img
                  src={product.hinhanh}
                  alt="Main"
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.map((image) => (
                <div
                  key={image.idImage}
                  className={`w-20 aspect-square cursor-pointer rounded-lg overflow-hidden border-2 ${
                    selectedImage === image.url
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(image.url)}
                >
                  <img
                    src={image.url}
                    alt={image.altText || "Product image"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1">
              <div className="aspect-square relative overflow-hidden rounded-xl">
                <img
                  src={selectedImage}
                  alt={product.tensanpham}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{product.tensanpham}</h1>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(discountedPrice)}
                </span>
                {product.giamgia > 0 && (
                  <span className="text-lg text-gray-500 line-through">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.gia)}
                  </span>
                )}
              </div>
              {product.giamgia > 0 && (
                <span className="inline-block px-2 py-1 text-sm font-semibold text-white bg-red-500 rounded-full">
                  Giảm {product.giamgia}%
                </span>
              )}
            </div>

            <div className="prose prose-sm">
              <p>{product.mota}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-sm border border-gray-300 rounded-full">
                {product.gioitinh ? "Nam" : "Nữ"}
              </span>
            </div>

            {/* Size Selector */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Kích thước:</span>
                <select
                  value={selectedSize || ""}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  className="border border-gray-300 rounded-lg py-2 px-3"
                >
                  {availableSizes.map((sizeOption) => (
                    <option key={sizeOption.idSize} value={sizeOption.idSize}>
                      {sizeOption.tenSize}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-2 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value) || 1)
                    }
                    className="w-16 text-center border-x border-gray-300"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => handleOrderCreation(false)}
                disabled={orderLoading}
                className="flex-1 px-6 py-3 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50"
              >
                {orderLoading ? "Đang xử lý..." : "Thêm vào giỏ hàng"}
              </button>
              <button
                onClick={() => handleOrderCreation(true)}
                disabled={orderLoading}
                className="flex-1 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {orderLoading ? "Đang xử lý..." : "Mua ngay"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;


// "use client";
// import React, { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import toast, { Toaster } from "react-hot-toast";
// import Header from "../Header";
// import Footer from "../Footer";
  
  
 
 
  
  
// import { ProductWithImages } from "@/app/component/Category/type/product";
// import { Size, SizeQuantities } from "@/app/component/Category/type/size";
// import { CartItem } from "@/app/component/Category/type/card";
// import { ImageGallery } from "../product/Image";
// import { SizeSelector } from "../product/Size";
// import { QuantitySelector } from "../product/Quantity";
// import { ProductPrice } from "../product/ProductPrice";
// import { ActionButtons } from "../product/ActionButton";
// import { CartAnimation } from "../product/CardAnimation";

// const ProductDetail = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");

//   const [product, setProduct] = useState<ProductWithImages | null>(null);
//   const [selectedImage, setSelectedImage] = useState<string>("");
//   const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
//   const [sizeQuantities, setSizeQuantities] = useState<SizeQuantities>({});
//   const [selectedSize, setSelectedSize] = useState<number | null>(null);
//   const [quantity, setQuantity] = useState<number>(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [orderLoading, setOrderLoading] = useState(false);
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);

//   useEffect(() => {
//     const fetchProductAndSizes = async () => {
//       if (!id) return;

//       try {
//         const [productResponse, sizeResponse, sizeQuantitiesResponse] = await Promise.all([
//           fetch(`/api/category/${id}`),
//           fetch(`/api/size`),
//           fetch(`/api/productsize/${id}`)
//         ]);

//         if (!productResponse.ok || !sizeResponse.ok || !sizeQuantitiesResponse.ok) {
//           throw new Error("Không thể lấy thông tin sản phẩm");
//         }

//         const [productData, sizeData, quantitiesData] = await Promise.all([
//           productResponse.json(),
//           sizeResponse.json(),
//           sizeQuantitiesResponse.json()
//         ]);

//         setProduct(productData);
//         setSelectedImage(productData.hinhanh);
//         setAvailableSizes(sizeData.size);
//         setSizeQuantities(quantitiesData);

//         if (sizeData.size.length > 0) {
//           setSelectedSize(sizeData.size[0].idSize);
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const savedCartItems = localStorage.getItem("cartItems");
//     if (savedCartItems) {
//       setCartItems(JSON.parse(savedCartItems));
//     }

//     fetchProductAndSizes();
//   }, [id]);

//   const handleOrderCreation = async (isInstantBuy: boolean) => {
//     if (!product || !selectedSize || quantity <= 0) {
//       toast.error("Vui lòng chọn size và số lượng");
//       return;
//     }

//     setOrderLoading(true);
//     setIsAddingToCart(true);

//     try {
//       const response = await fetch("/api/giohang", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           idsanpham: product.idsanpham,
//           soluong: quantity,
//           sizeId: selectedSize,
//         }),
//       });

//       if (response.ok) {
//         const selectedSizeObj = availableSizes.find(s => s.idSize === selectedSize);
//         const sizeName = selectedSizeObj ? selectedSizeObj.tenSize : selectedSize;

//         const newCartItem: CartItem = {
//           productId: product.idsanpham,
//           quantity,
//           sizeId: selectedSize,
//         };

//         setCartItems(prevItems => {
//           const existingItemIndex = prevItems.findIndex(
//             item => item.productId === newCartItem.productId && item.sizeId === newCartItem.sizeId
//           );

//           if (existingItemIndex > -1) {
//             const updatedItems = [...prevItems];
//             updatedItems[existingItemIndex].quantity += quantity;
//             return updatedItems;
//           }

//           return [...prevItems, newCartItem];
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
//       } else {
//         throw new Error("Có lỗi xảy ra khi đặt hàng");
//       }
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra khi đặt hàng");
//       setIsAddingToCart(false);
//     } finally {
//       setOrderLoading(false);
//     }
//   };

//   if (loading) return <div className="p-4">Đang tải...</div>;
//   if (error) return <div className="p-4 text-red-500">Lỗi: {error}</div>;
//   if (!product) return <div className="p-4">Không tìm thấy sản phẩm</div>;

//   return (
//     <div>
//       <Header />
//       <Toaster position="top-right" />

//       <CartAnimation
//         isVisible={isAddingToCart}
//         imageUrl={selectedImage}
//         productName={product.tensanpham}
//       />

//       <div className="container mx-auto p-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <ImageGallery
//             mainImage={product.hinhanh}
//             images={product.images}
//             selectedImage={selectedImage}
//             onImageSelect={setSelectedImage}
//           />

//           <div className="space-y-4">
//             <h1 className="text-2xl font-bold">{product.tensanpham}</h1>
            
//             <ProductPrice price={product.gia} discount={product.giamgia} />

//             <div className="prose prose-sm">
//               <p>{product.mota}</p>
//             </div>

//             <div className="flex items-center gap-2">
//               <span className="px-3 py-1 text-sm border border-gray-300 rounded-full">
//                 {product.gioitinh ? "Nam" : "Nữ"}
//               </span>
//             </div>

//             <SizeSelector
//               sizes={availableSizes}
//               quantities={sizeQuantities}
//               selectedSize={selectedSize}
//               onSizeSelect={(sizeId) => {
//                 setSelectedSize(parseInt(sizeId));
//                 setQuantity(1);
//               }}
//             />

//             {selectedSize && sizeQuantities[selectedSize] > 0 && (
//               <QuantitySelector
//                 quantity={quantity}
//                 maxQuantity={sizeQuantities[selectedSize]}
//                 onChange={setQuantity}
//               />
//             )}

//             <ActionButtons
//               onAddToCart={() => handleOrderCreation(false)}
//               onBuyNow={() => handleOrderCreation(true)}
//               loading={orderLoading}
//             />
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default ProductDetail;