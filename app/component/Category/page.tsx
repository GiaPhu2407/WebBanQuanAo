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

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`/api/countdonhang`);
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      const data = await response.json();

      // Assuming the API returns an array of cart items
      setCartItems(data);

      // Calculate total item count
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Không thể tải giỏ hàng");
    }
  };

  // Modify useEffect to use the new function
  useEffect(() => {
    fetchCartItems();
  }, []); // Empty dependency array to run only on component mount
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
//   soluong: number;
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
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);

//   useEffect(() => {
//     const fetchProductAndSizes = async () => {
//       if (!id) return;

//       try {
//         // Fetch product details and sizes in parallel
//         const [productResponse, sizeResponse] = await Promise.all([
//           fetch(`/api/category/${id}`),
//           fetch(`/api/size?productId=${id}`),
//         ]);

//         if (!productResponse.ok) {
//           throw new Error("Không thể lấy thông tin sản phẩm");
//         }
//         if (!sizeResponse.ok) {
//           throw new Error("Không thể lấy thông tin kích thước");
//         }

//         const productData = await productResponse.json();
//         const sizeData = await sizeResponse.json();

//         console.log("Size data:", sizeData); // For debugging

//         setProduct(productData);
//         setSelectedImage(productData.hinhanh);

//         if (Array.isArray(sizeData.sizes)) {
//           setAvailableSizes(sizeData.sizes);
//           // Set default size to first available size with stock
//           const firstAvailableSize = sizeData.sizes.find(
//             (size: { soluong: number }) => size.soluong > 0
//           );
//           if (firstAvailableSize) {
//             setSelectedSize(firstAvailableSize.idSize);
//           }
//         } else {
//           console.error("Invalid size data received:", sizeData);
//           setAvailableSizes([]);
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Load cart items from local storage
//     const loadCartItems = () => {
//       const savedCartItems = localStorage.getItem("cartItems");
//       if (savedCartItems) {
//         try {
//           const parsedItems = JSON.parse(savedCartItems);
//           setCartItems(Array.isArray(parsedItems) ? parsedItems : []);
//         } catch (err) {
//           console.error("Error parsing cart items:", err);
//           setCartItems([]);
//         }
//       }
//     };

//     loadCartItems();
//     fetchProductAndSizes();
//   }, [id]);

//   // Save cart items to localStorage whenever they change
//   useEffect(() => {
//     if (cartItems.length > 0) {
//       localStorage.setItem("cartItems", JSON.stringify(cartItems));
//     }
//   }, [cartItems]);

//   const handleQuantityChange = (newQuantity: number) => {
//     if (!selectedSize) return;

//     const selectedSizeData = availableSizes.find(
//       (s) => s.idSize === selectedSize
//     );
//     if (!selectedSizeData) return;

//     // Ensure quantity doesn't exceed available stock
//     const maxQuantity = selectedSizeData.soluong;
//     const validQuantity = Math.min(Math.max(1, newQuantity), maxQuantity);
//     setQuantity(validQuantity);
//   };

//   const handleSizeChange = (sizeId: number) => {
//     setSelectedSize(sizeId);
//     // Reset quantity when size changes
//     setQuantity(1);
//   };

//   const handleAddToCart = async (isInstantBuy: boolean) => {
//     if (!product || !selectedSize || quantity <= 0) {
//       toast.error("Vui lòng chọn size và số lượng");
//       return;
//     }

//     const selectedSizeData = availableSizes.find(
//       (s) => s.idSize === selectedSize
//     );
//     if (!selectedSizeData || selectedSizeData.soluong < quantity) {
//       toast.error("Số lượng trong kho không đủ");
//       return;
//     }

//     setOrderLoading(true);
//     setIsAddingToCart(true);

//     try {
//       const response = await fetch("/api/giohang", {
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

//       const data = await response.json();

//       if (response.ok) {
//         // Update local size quantities
//         setAvailableSizes((prevSizes) =>
//           prevSizes.map((size) =>
//             size.idSize === selectedSize
//               ? { ...size, soluong: size.soluong - quantity }
//               : size
//           )
//         );

//         // Update cart items
//         const newCartItem: CartItem = {
//           productId: product.idsanpham,
//           quantity,
//           sizeId: selectedSize,
//         };

//         setCartItems((prevItems) => {
//           const existingItemIndex = prevItems.findIndex(
//             (item) =>
//               item.productId === newCartItem.productId &&
//               item.sizeId === newCartItem.sizeId
//           );

//           if (existingItemIndex > -1) {
//             const updatedItems = [...prevItems];
//             updatedItems[existingItemIndex].quantity += quantity;
//             return updatedItems;
//           }

//           return [...prevItems, newCartItem];
//         });

//         toast.success(
//           `Đã thêm ${quantity} sản phẩm ${product.tensanpham} size ${selectedSizeData.tenSize} vào giỏ hàng`
//         );

//         if (isInstantBuy) {
//           setTimeout(() => {
//             router.push("/component/shopping");
//           }, 1000);
//         }
//       } else {
//         throw new Error(data.error || "Có lỗi xảy ra khi thêm vào giỏ hàng");
//       }
//     } catch (err) {
//       console.error("Error adding to cart:", err);
//       toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
//     } finally {
//       setOrderLoading(false);
//       setIsAddingToCart(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Đang tải...
//       </div>
//     );
//   if (error)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         Lỗi: {error}
//       </div>
//     );
//   if (!product)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Không tìm thấy sản phẩm
//       </div>
//     );

//   const discountedPrice =
//     product.giamgia > 0
//       ? product.gia * (1 - product.giamgia / 100)
//       : product.gia;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <Toaster />

//       {/* Cart Icon with Badge */}
//       <div className="fixed top-4 right-4 z-50">
//         <button
//           onClick={() => router.push("/component/shopping")}
//           className="btn btn-ghost btn-circle relative"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//             />
//           </svg>
//           {cartItems.length > 0 && (
//             <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
//               {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
//             </span>
//           )}
//         </button>
//       </div>

//       {/* Product Detail Content */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Image Gallery */}
//           <div className="space-y-4">
//             <div className="aspect-square rounded-lg overflow-hidden bg-white">
//               <img
//                 src={selectedImage}
//                 alt={product.tensanpham}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div className="grid grid-cols-4 gap-2">
//               <button
//                 onClick={() => setSelectedImage(product.hinhanh)}
//                 className={`aspect-square rounded-lg overflow-hidden border-2 ${
//                   selectedImage === product.hinhanh
//                     ? "border-blue-500"
//                     : "border-transparent"
//                 }`}
//               >
//                 <img
//                   src={product.hinhanh}
//                   alt="Main"
//                   className="w-full h-full object-cover"
//                 />
//               </button>
//               {product.images.map((image) => (
//                 <button
//                   key={image.idImage}
//                   onClick={() => setSelectedImage(image.url)}
//                   className={`aspect-square rounded-lg overflow-hidden border-2 ${
//                     selectedImage === image.url
//                       ? "border-blue-500"
//                       : "border-transparent"
//                   }`}
//                 >
//                   <img
//                     src={image.url}
//                     alt={image.altText || "Product image"}
//                     className="w-full h-full object-cover"
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Product Info */}
//           <div className="space-y-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 {product.tensanpham}
//               </h1>
//               <div className="mt-4">
//                 <div className="flex items-center gap-2">
//                   <span className="text-3xl font-bold text-blue-600">
//                     {new Intl.NumberFormat("vi-VN", {
//                       style: "currency",
//                       currency: "VND",
//                     }).format(discountedPrice)}
//                   </span>
//                   {product.giamgia > 0 && (
//                     <>
//                       <span className="text-lg text-gray-500 line-through">
//                         {new Intl.NumberFormat("vi-VN", {
//                           style: "currency",
//                           currency: "VND",
//                         }).format(product.gia)}
//                       </span>
//                       <span className="px-2 py-1 text-sm text-white bg-red-500 rounded-full">
//                         -{product.giamgia}%
//                       </span>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="prose prose-sm">
//               <p>{product.mota}</p>
//             </div>

//             <div>
//               <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
//                 {product.gioitinh ? "Nam" : "Nữ"}
//               </span>
//             </div>

//             {/* Size Selection */}
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Chọn Size
//               </label>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                 {availableSizes.map((size) => (
//                   <button
//                     key={size.idSize}
//                     onClick={() => handleSizeChange(size.idSize)}
//                     disabled={size.soluong === 0}
//                     className={`
//                       p-3 border rounded-lg text-center
//                       ${
//                         selectedSize === size.idSize
//                           ? "border-blue-500 bg-blue-50 text-blue-700"
//                           : size.soluong === 0
//                           ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
//                           : "border-gray-300 hover:border-blue-500"
//                       }
//                     `}
//                   >
//                     <div className="font-medium">{size.tenSize}</div>
//                     <div className="text-sm text-gray-500">
//                       Còn {size.soluong} sản phẩm
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Quantity Selection */}
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Số lượng
//               </label>
//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={() => handleQuantityChange(quantity - 1)}
//                   disabled={quantity <= 1}
//                   className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
//                 >
//                   -
//                 </button>
//                 <input
//                   type="number"
//                   min="1"
//                   value={quantity}
//                   onChange={(e) =>
//                     handleQuantityChange(parseInt(e.target.value) || 1)
//                   }
//                   className="w-20 h-10 text-center border-gray-300 rounded-lg"
//                 />
//                 <button
//                   onClick={() => handleQuantityChange(quantity + 1)}
//                   disabled={
//                     !selectedSize ||
//                     quantity >=
//                       (availableSizes.find((s) => s.idSize === selectedSize)
//                         ?.soluong || 0)
//                   }
//                   className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="grid grid-cols-2 gap-4">
//               <button
//                 onClick={() => handleAddToCart(false)}
//                 disabled={orderLoading || !selectedSize}
//                 className={`
//                   px-6 py-3 rounded-lg text-sm font-medium
//                   ${
//                     orderLoading || !selectedSize
//                       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                       : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
//                   }
//                 `}
//               >
//                 {orderLoading ? "Đang xử lý..." : "Thêm vào giỏ hàng"}
//               </button>
//               <button
//                 onClick={() => handleAddToCart(true)}
//                 disabled={orderLoading || !selectedSize}
//                 className={`
//                   px-6 py-3 rounded-lg text-sm font-medium
//                   ${
//                     orderLoading || !selectedSize
//                       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                       : "bg-blue-600 text-white hover:bg-blue-700"
//                   }
//                 `}
//               >
//                 {orderLoading ? "Đang xử lý..." : "Mua ngay"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Add to Cart Animation */}
//         <AnimatePresence>
//           {isAddingToCart && selectedImage && (
//             <motion.div
//               initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
//               animate={{
//                 opacity: 0,
//                 scale: 0.5,
//                 x: window.innerWidth - 100,
//                 y: -window.innerHeight + 100,
//               }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 1 }}
//               className="fixed z-50"
//               style={{
//                 top: "50%",
//                 left: "50%",
//                 transform: "translate(-50%, -50%)",
//               }}
//             >
//               <img
//                 src={selectedImage}
//                 alt="Adding to cart"
//                 className="w-24 h-24 object-cover rounded-lg shadow-lg"
//               />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default ProductDetail;
