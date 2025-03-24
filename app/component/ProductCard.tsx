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
