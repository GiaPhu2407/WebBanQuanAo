import React, { useState, useRef, useEffect } from "react";
import { useDrag } from "react-dnd";
import { GripVertical } from "lucide-react";
import { useColors } from "../Admin/DashBoard/ProductManager/hooks/useColor";
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

interface Product {
  idsanpham: number;
  tensanpham: string;
  gia: number;
  giamgia: number;
  hinhanh: string;
  ProductColors?: {
    idmausac: number;
    hinhanh: string;
  }[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { colors } = useColors();
  const [isHovered, setIsHovered] = useState(false);

  // Simplified useDrag implementation
  const [{ isDragging }, drag] = useDrag({
    type: "PRODUCT_ITEM",
    item: product,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itemRef.current) {
      drag(itemRef.current);
    }
  }, [drag]);

  const discountedPrice =
    product.giamgia > 0
      ? product.gia * (1 - product.giamgia / 100)
      : product.gia;

  return (
    <div
      ref={itemRef}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="group relative bg-gray-50 rounded-lg overflow-hidden cursor-move"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag handle */}
      <div className="absolute top-2 left-2 cursor-grab active:cursor-grabbing p-2 rounded-full bg-white/80 hover:bg-white z-10">
        <GripVertical className="w-5 h-5 text-gray-500" />
      </div>

      {/* Favorite Button */}
      <div className="absolute top-2 right-2 z-20">
        <FavoriteButton productId={product.idsanpham} />
      </div>

      <Link
        href={`/component/Category?id=${product.idsanpham}`}
        className="block"
      >
        <div className="aspect-square overflow-hidden">
          {product.hinhanh.startsWith("http") ? (
            <img
              src={product.hinhanh}
              alt={product.tensanpham}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Image
              src={product.hinhanh}
              alt={product.tensanpham}
              width={300}
              height={300}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          )}

          {product.giamgia > 0 && (
            <div className="absolute top-2 right-12 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
              -{product.giamgia}%
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            {product.tensanpham}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-gray-900">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(discountedPrice)}
            </span>
            {product.giamgia > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.gia)}
              </span>
            )}
          </div>

          {product.ProductColors && product.ProductColors.length > 0 && (
            <div className="flex gap-2">
              {product.ProductColors.map((productColor) => {
                const color = colors.find(
                  (c) => c.idmausac === productColor.idmausac
                );
                if (!color) return null;

                return (
                  <div
                    key={productColor.idmausac}
                    className="group/color relative w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-transform border border-gray-200"
                    style={{ backgroundColor: color.mamau }}
                  >
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap">
                      {color.tenmau}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex card-actions flex flex-col sm:flex-row gap-2 sm:gap-4 w-full mt-4">
            <button className="btn bg-blue-500 hover:bg-blue-600 w-full sm:w-auto text-white text-sm">
              Thêm vào giỏ
            </button>
            <Link
              href={`/component/Category?id=${product.idsanpham}`}
              className="btn btn-outline w-full sm:w-auto text-sm"
            >
              Xem Chi Tiết
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
};

const ProductGrid: React.FC<{ products: Product[] }> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {products.map((product) => (
        <ProductCard key={product.idsanpham} product={product} />
      ))}
    </div>
  );
};

// Shopping Cart Component
interface CartItem extends Product {
  quantity: number;
}

interface ShoppingCartProps {
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items,
  onRemove,
  onUpdateQuantity,
}) => {
  const total = items.reduce((sum, item) => {
    const price =
      item.giamgia > 0 ? item.gia * (1 - item.giamgia / 100) : item.gia;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Giỏ hàng</h2>

      {items.length === 0 ? (
        <p className="text-gray-500">Giỏ hàng trống</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <li key={item.idsanpham} className="py-4 flex">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  {item.hinhanh.startsWith("http") ? (
                    <img
                      src={item.hinhanh}
                      alt={item.tensanpham}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <Image
                      src={item.hinhanh}
                      alt={item.tensanpham}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover object-center"
                    />
                  )}
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>{item.tensanpham}</h3>
                      <p className="ml-4">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(
                          item.giamgia > 0
                            ? item.gia * (1 - item.giamgia / 100)
                            : item.gia
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.idsanpham,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="px-2 py-1 border rounded-l-md"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-t border-b">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.idsanpham, item.quantity + 1)
                        }
                        className="px-2 py-1 border rounded-r-md"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(item.idsanpham)}
                      className="font-medium text-red-600 hover:text-red-500"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Tổng cộng</p>
              <p>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(total)}
              </p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Phí vận chuyển sẽ được tính ở bước thanh toán
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Thanh toán
              </button>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                hoặc{" "}
                <Link
                  href="/products"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Tiếp tục mua sắm
                </Link>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Main component that brings it all together
interface ShopPageProps {
  products: Product[];
}

const ShopPage: React.FC<ShopPageProps> = ({ products }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Setup DnD drop functionality for cart
  const handleDrop = (item: Product) => {
    setCartItems((prev) => {
      // Check if product already exists in cart
      const existingItem = prev.find((i) => i.idsanpham === item.idsanpham);

      if (existingItem) {
        // Update quantity if already in cart
        return prev.map((i) =>
          i.idsanpham === item.idsanpham
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        // Add new item to cart
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.idsanpham !== id));
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.idsanpham === id ? { ...item, quantity } : item))
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sản phẩm</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-3/4">
          <ProductGrid products={products} />
        </div>

        <div className="md:w-1/4 sticky top-6 self-start">
          <ShoppingCart
            items={cartItems}
            onRemove={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
          />
        </div>
      </div>
    </div>
  );
};

export { ProductCard, ProductGrid, ShopPage };

// import React, { useState, useEffect } from "react";
// import { useDrag } from "react-dnd";
// import {
//   GripVertical,
//   Flame,
//   ShoppingCartIcon,
//   Eye,
//   ArrowUpRight,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// // Enums and Interfaces
// enum UserAction {
//   VIEW = "view",
//   ADD_TO_CART = "add_to_cart",
//   PURCHASE = "purchase",
// }

// interface Product {
//   idsanpham: number;
//   tensanpham: string;
//   gia: number;
//   giamgia: number;
//   hinhanh: string;
//   totalViews?: number;
//   viewPercentage?: number;
//   popularity?: number;
//   ProductColors?: Array<{
//     idmausac: number;
//     mamau: string;
//     tenmau: string;
//   }>;
// }

// interface CartItem extends Product {
//   quantity: number;
// }

// // User Behavior Tracking Function
// const trackUserBehavior = async (
//   productId: number,
//   userId: number,
//   action: UserAction
// ): Promise<boolean> => {
//   try {
//     const response = await fetch("/api/userbehavior", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         productId,
//         userId,
//         action,
//       }),
//     });

//     return response.ok;
//   } catch (error) {
//     console.error("Error tracking user behavior:", error);
//     return false;
//   }
// };

// // Product Card Component
// const ProductCard: React.FC<{
//   product: Product;
//   userId?: number;
//   onAddToCart?: (product: Product) => void;
//   totalProductViews?: number;
// }> = ({ product, userId, onAddToCart, totalProductViews = 100 }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [viewCount, setViewCount] = useState(0);
//   const [viewPercentage, setViewPercentage] = useState(0);

//   // Track product view when component mounts
//   useEffect(() => {
//     const trackProductView = async () => {
//       if (userId) {
//         try {
//           const success = await trackUserBehavior(
//             product.idsanpham,
//             userId,
//             UserAction.VIEW
//           );

//           if (success) {
//             setViewCount((prev) => prev + 1);

//             // Calculate view percentage
//             const percentage =
//               totalProductViews > 0
//                 ? Math.min((viewCount + 1 / totalProductViews) * 100, 100)
//                 : 0;

//             setViewPercentage(percentage);
//           }
//         } catch (error) {
//           console.error("Error tracking product view:", error);
//         }
//       }
//     };

//     trackProductView();
//   }, [product.idsanpham, userId, totalProductViews]);

//   // Add to cart handler
//   const handleAddToCart = async () => {
//     if (isLoading || !onAddToCart) return;
//     setIsLoading(true);
//     try {
//       if (userId) {
//         await trackUserBehavior(
//           product.idsanpham,
//           userId,
//           UserAction.ADD_TO_CART
//         );
//       }
//       onAddToCart(product);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Drag and drop setup
//   const [{ isDragging }, drag] = useDrag({
//     type: "PRODUCT_ITEM",
//     item: product,
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   });

//   // Calculate discounted price
//   const discountedPrice =
//     product.giamgia > 0
//       ? product.gia * (1 - product.giamgia / 100)
//       : product.gia;

//   return (
//     <div
//       ref={drag as any}
//       style={{ opacity: isDragging ? 0.5 : 1 }}
//       className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-move"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* View Percentage Badge */}
//       <div
//         className={`absolute top-2 right-2 z-20
//           ${viewPercentage > 50 ? "bg-green-500" : "bg-blue-500"}
//           text-white text-xs font-semibold px-2 py-1 rounded-full`}
//       >
//         {Math.round(viewPercentage)}% Views
//       </div>

//       {/* Popularity Badge */}
//       {product.popularity && product.popularity > 50 && (
//         <div className="absolute top-2 left-14 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
//           <Flame className="w-3 h-3" />
//           <span>{Math.round(product.popularity)}% Hot</span>
//         </div>
//       )}

//       {/* Product Image */}
//       <Link href={`/product/${product.idsanpham}`} className="block relative">
//         <div className="aspect-square overflow-hidden">
//           <Image
//             src={product.hinhanh}
//             alt={product.tensanpham}
//             width={300}
//             height={300}
//             className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
//           />
//         </div>

//         {/* Hover Overlay */}
//         <div
//           className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-4 transition-opacity duration-300 ${
//             isHovered ? "opacity-100" : "opacity-0"
//           }`}
//         >
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               handleAddToCart();
//             }}
//             className="p-3 bg-white rounded-full hover:bg-blue-500 hover:text-white transition-colors"
//           >
//             <ShoppingCartIcon className="w-5 h-5" />
//           </button>
//           <Link
//             href={`/product/${product.idsanpham}`}
//             className="p-3 bg-white rounded-full hover:bg-blue-500 hover:text-white transition-colors"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <Eye className="w-5 h-5" />
//           </Link>
//         </div>
//       </Link>

//       {/* Product Details */}
//       <div className="p-4">
//         <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
//           {product.tensanpham}
//         </h3>

//         {/* Pricing */}
//         <div className="flex items-center gap-2 mb-3">
//           <span className="text-sm font-semibold text-gray-900">
//             {new Intl.NumberFormat("vi-VN", {
//               style: "currency",
//               currency: "VND",
//             }).format(discountedPrice)}
//           </span>
//           {product.giamgia > 0 && (
//             <span className="text-sm text-gray-500 line-through">
//               {new Intl.NumberFormat("vi-VN", {
//                 style: "currency",
//                 currency: "VND",
//               }).format(product.gia)}
//             </span>
//           )}
//         </div>

//         {/* Color Options */}
//         {product.ProductColors && product.ProductColors.length > 0 && (
//           <div className="flex gap-2 mb-4">
//             {product.ProductColors.slice(0, 4).map((color) => (
//               <div
//                 key={color.idmausac}
//                 className="group/color relative w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-transform border border-gray-200"
//                 style={{ backgroundColor: color.mamau }}
//                 title={color.tenmau}
//               />
//             ))}
//             {product.ProductColors.length > 4 && (
//               <div className="text-xs text-gray-500 flex items-center">
//                 +{product.ProductColors.length - 4}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full mt-4">
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               handleAddToCart();
//             }}
//             disabled={isLoading}
//             className={`btn flex-1 flex items-center justify-center gap-2 ${
//               isLoading
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-500 hover:bg-blue-600"
//             } text-white text-sm font-medium py-2 px-4 rounded transition-colors`}
//           >
//             {isLoading ? "Đang thêm..." : "Thêm vào giỏ"}
//             <ShoppingCartIcon className="w-4 h-4" />
//           </button>
//           <Link
//             href={`/product/${product.idsanpham}`}
//             className="btn flex-1 border border-gray-300 hover:border-blue-500 hover:text-blue-500 text-sm font-medium py-2 px-4 rounded transition-colors text-center flex items-center justify-center gap-2"
//           >
//             Chi Tiết
//             <ArrowUpRight className="w-4 h-4" />
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Product Grid Component
// const ProductGrid: React.FC<{
//   products: Product[];
//   userId?: number;
// }> = ({ products, userId }) => {
//   // Calculate total product views
//   const totalProductViews = products.reduce(
//     (total, product) => total + (product.totalViews || 0),
//     0
//   );

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
//       {products.map((product) => (
//         <ProductCard
//           key={product.idsanpham}
//           product={product}
//           userId={userId}
//           totalProductViews={totalProductViews}
//         />
//       ))}
//     </div>
//   );
// };

// // Shopping Cart Component
// const ShoppingCart: React.FC<{
//   items: CartItem[];
//   onRemove: (id: number) => void;
//   onUpdateQuantity: (id: number, quantity: number) => void;
//   userId?: number;
// }> = ({ items, onRemove, onUpdateQuantity, userId }) => {
//   const total = items.reduce((sum, item) => {
//     const price =
//       item.giamgia > 0 ? item.gia * (1 - item.giamgia / 100) : item.gia;
//     return sum + price * item.quantity;
//   }, 0);

//   const handlePurchase = async () => {
//     if (userId) {
//       // Track purchase for each item
//       for (const item of items) {
//         await trackUserBehavior(item.idsanpham, userId, UserAction.PURCHASE);
//       }
//       // Additional purchase logic (redirect to checkout, etc.)
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-4 sticky top-6">
//       <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//         <ShoppingCartIcon className="w-6 h-6" />
//         Giỏ Hàng
//       </h2>

//       {items.length === 0 ? (
//         <p className="text-gray-500 text-center py-4">Giỏ hàng trống</p>
//       ) : (
//         <>
//           <div className="max-h-[400px] overflow-y-auto">
//             {items.map((item) => (
//               <div
//                 key={item.idsanpham}
//                 className="flex items-center py-3 border-b last:border-b-0"
//               >
//                 <Image
//                   src={item.hinhanh}
//                   alt={item.tensanpham}
//                   width={80}
//                   height={80}
//                   className="w-20 h-20 object-cover rounded mr-4"
//                 />
//                 <div className="flex-1">
//                   <h3 className="text-sm font-medium line-clamp-2">
//                     {item.tensanpham}
//                   </h3>
//                   <div className="flex items-center justify-between mt-2">
//                     <div className="flex items-center">
//                       <button
//                         onClick={() =>
//                           onUpdateQuantity(
//                             item.idsanpham,
//                             Math.max(1, item.quantity - 1)
//                           )
//                         }
//                         className="bg-gray-200 px-2 py-1 rounded-l"
//                       >
//                         -
//                       </button>
//                       <span className="px-3 py-1 bg-gray-100">
//                         {item.quantity}
//                       </span>
//                       <button
//                         onClick={() =>
//                           onUpdateQuantity(item.idsanpham, item.quantity + 1)
//                         }
//                         className="bg-gray-200 px-2 py-1 rounded-r"
//                       >
//                         +
//                       </button>
//                     </div>
//                     <span className="font-semibold">
//                       {new Intl.NumberFormat("vi-VN", {
//                         style: "currency",
//                         currency: "VND",
//                       }).format(
//                         (item.giamgia > 0
//                           ? item.gia * (1 - item.giamgia / 100)
//                           : item.gia) * item.quantity
//                       )}
//                     </span>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => onRemove(item.idsanpham)}
//                   className="ml-4 text-red-500 hover:text-red-700"
//                 >
//                   Xóa
//                 </button>
//               </div>
//             ))}
//           </div>

//           <div className="mt-6">
//             <div className="flex justify-between mb-4">
//               <span className="font-medium">Tổng Cộng</span>
//               <span className="font-semibold text-lg">
//                 {new Intl.NumberFormat("vi-VN", {
//                   style: "currency",
//                   currency: "VND",
//                 }).format(total)}
//               </span>
//             </div>
//             <button
//               onClick={handlePurchase}
//               className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors"
//             >
//               Thanh Toán
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // Main Shop Page Component
// const ShopPage: React.FC<{
//   products: Product[];
//   userId?: number;
// }> = ({ products, userId }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   const handleAddToCart = (product: Product) => {
//     setCartItems((prev) => {
//       const existingItem = prev.find((i) => i.idsanpham === product.idsanpham);
//       if (existingItem) {
//         return prev.map((i) =>
//           i.idsanpham === product.idsanpham
//             ? { ...i, quantity: i.quantity + 1 }
//             : i
//         );
//       }
//       return [...prev, { ...product, quantity: 1 }];
//     });
//   };

//   const handleRemoveFromCart = (id: number) => {
//     setCartItems((prev) => prev.filter((item) => item.idsanpham !== id));
//   };

//   const handleUpdateQuantity = (id: number, quantity: number) => {
//     setCartItems((prev) =>
//       prev.map((item) => (item.idsanpham === id ? { ...item, quantity } : item))
//     );
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
//         <ShoppingCartIcon className="w-7 h-7" />
//         Sản Phẩm
//       </h1>

//       <div className="flex flex-col md:flex-row gap-8">
//         <div className="md:w-3/4">
//           <ProductGrid products={products} userId={userId} />
//         </div>

//         <div className="md:w-1/4">
//           <ShoppingCart
//             items={cartItems}
//             onRemove={handleRemoveFromCart}
//             onUpdateQuantity={handleUpdateQuantity}
//             userId={userId}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export { ProductCard, ProductGrid, ShopPage };
