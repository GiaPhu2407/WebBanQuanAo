"use client";

import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
import { useDrag } from "react-dnd";
import { GripVertical, Flame, ShoppingCart as CartIcon } from "lucide-react";
import { useColors } from "../Admin/DashBoard/ProductManager/hooks/useColor";
import { useProductBehavior } from "@/app/api/userBehavior";
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import { cn } from "@/lib/utils";

// MouseEnter Context from the first code
const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

// Hook to use the MouseEnter context
const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};

interface Product {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: number;
  mota: string;
  idloaisanpham: number;
  mausac: string;
  giamgia: number;
  gioitinh: boolean;
  size: string;
  trangthai: "ACTIVE" | "SCHEDULED";
  releaseDate: string | null;
  popularity: number;
  totalViews: number;
  ProductColors?: {
    idmausac: number;
    hinhanh: string;
  }[];
}

interface ProductCardProps {
  product: Product;
  userId: number;
  onAddToCart: (product: Product) => void;
}

// 3D Card Container component from the first code
const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsMouseEntered(true);
    if (!containerRef.current) return;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn("flex items-center justify-center", containerClassName)}
        style={{
          perspective: "1000px",
        }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "flex items-center justify-center relative transition-all duration-200 ease-linear w-full",
            className
          )}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

// CardItem component from the first code
const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  [key: string]: any;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMouseEntered] = useMouseEnter();

  useEffect(() => {
    handleAnimations();
  }, [isMouseEntered]);

  const handleAnimations = () => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    }
  };

  return (
    <Tag
      ref={ref}
      className={cn("w-fit transition duration-200 ease-linear", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
};

// Enhanced ProductCard with 3D effects
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  userId,
  onAddToCart,
}) => {
  const { colors } = useColors();
  const [isHovered, setIsHovered] = useState(false);
  const { trackBehavior, loading } = useProductBehavior({ userId });

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

  const handleProductView = async (e: React.MouseEvent) => {
    try {
      e.preventDefault(); // Prevent navigation until tracking is complete
      console.log("Tracking view for product:", product.idsanpham);
      await trackBehavior(product.idsanpham, "view");
      console.log("View tracked successfully");
      window.location.href = `/component/Category?id=${product.idsanpham}`;
    } catch (error) {
      console.error("Error tracking view:", error);
      // Still navigate even if tracking fails
      window.location.href = `/component/Category?id=${product.idsanpham}`;
    }
  };

  const handleAddToCart = async () => {
    if (loading) return;

    try {
      console.log("Tracking add to cart for product:", product.idsanpham);
      await trackBehavior(product.idsanpham, "add_to_cart");
      console.log("Add to cart tracked successfully");
      onAddToCart(product);
    } catch (error) {
      console.error("Error tracking add to cart:", error);
    }
  };

  const discountedPrice =
    product.giamgia > 0
      ? product.gia * (1 - product.giamgia / 100)
      : product.gia;

  const isPopular = product.popularity >= 50;

  return (
    <CardContainer containerClassName="py-4">
      <div
        ref={itemRef}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className="group relative bg-gray-50 rounded-lg overflow-hidden cursor-move shadow-sm hover:shadow-md transition-shadow duration-200 w-full h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Popular Product Indicator */}
        <CardItem translateZ={20} className="absolute top-2 left-12 z-20">
          {isPopular && (
            <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-medium">Hot</span>
            </div>
          )}
        </CardItem>

        {/* Drag handle */}
        <CardItem translateZ={20} className="absolute top-2 left-2 z-10">
          <div className="cursor-grab active:cursor-grabbing p-2 rounded-full bg-white/80 hover:bg-white">
            <GripVertical className="w-5 h-5 text-gray-500" />
          </div>
        </CardItem>

        {/* Favorite Button */}
        <CardItem translateZ={20} className="absolute top-2 right-2 z-20">
          <FavoriteButton productId={product.idsanpham} />
        </CardItem>

        <Link
          href={`/component/Category?id=${product.idsanpham}`}
          className="block"
          onClick={handleProductView}
        >
          <CardItem
            translateZ={10}
            className="aspect-square overflow-hidden w-full"
          >
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

            <CardItem translateZ={30} className="absolute top-2 right-12">
              {product.giamgia > 0 && (
                <div className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                  -{product.giamgia}%
                </div>
              )}
            </CardItem>
          </CardItem>

          <div className="p-4">
            <CardItem translateZ={15}>
              <h3 className="text-2xl font-medium text-gray-900 mb-2 line-clamp-2">
                {product.tensanpham}
              </h3>
            </CardItem>

            <CardItem translateZ={15} className="flex items-center gap-2 mb-3">
              <span className="text-xl font-semibold text-red-600">
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
            </CardItem>
            <CardItem translateZ={15}>
              <h3 className="text-sm  mb-2 line-clamp-2">
                {product.mota}
              </h3>
            </CardItem>

            {product.ProductColors && product.ProductColors.length > 0 && (
              <CardItem translateZ={20} className="flex gap-2 mb-4">
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
              </CardItem>
            )}

            {/* <CardItem
              translateZ={25}
              className="flex flex-row gap-1 w-full mt-4"
            >
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 flex-1 text-white text-xs px-2 py-1.5 rounded-md transition-colors duration-200"
              >
                <CartIcon className="w-3 h-3" />
                Thêm
              </button>
              <Link
                href={`/component/Category?id=${product.idsanpham}`}
                className="flex items-center justify-center border border-gray-300 hover:border-gray-400 flex-1 text-xs px-2 py-1.5 rounded-md transition-colors duration-200"
                onClick={handleProductView}
              >
                Chi Tiết
              </Link>
            </CardItem> */}

            {/* Views counter */}
            <CardItem translateZ={15} className="mt-3 text-xs text-gray-500">
              {product.totalViews} lượt xem
            </CardItem>
          </div>
        </Link>
      </div>
    </CardContainer>
  );
};

const ProductGrid: React.FC<{
  products: Product[];
  userId: number;
  onAddToCart: (product: Product) => void;
}> = ({ products, userId, onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {products.map((product) => (
        <ProductCard
          key={product.idsanpham}
          product={product}
          userId={userId}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

interface CartItem extends Product {
  quantity: number;
}

interface ShoppingCartProps {
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onCheckout: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items,
  onRemove,
  onUpdateQuantity,
  onCheckout,
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
        <div className="text-center py-8">
          <CartIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Giỏ hàng trống</p>
        </div>
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
                      <h3 className="line-clamp-2">{item.tensanpham}</h3>
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
                        className="px-2 py-1 border rounded-l-md hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-t border-b min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.idsanpham, item.quantity + 1)
                        }
                        className="px-2 py-1 border rounded-r-md hover:bg-gray-50"
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
                onClick={onCheckout}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
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

interface ShopPageProps {
  products: Product[];
  userId: number;
}

const ShopPage: React.FC<ShopPageProps> = ({ products, userId }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { trackBehavior } = useProductBehavior({ userId });

  const handleDrop = async (item: Product) => {
    await trackBehavior(item.idsanpham, "add_to_cart");

    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.idsanpham === item.idsanpham);

      if (existingItem) {
        return prev.map((i) =>
          i.idsanpham === item.idsanpham
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const handleAddToCart = async (product: Product) => {
    await trackBehavior(product.idsanpham, "add_to_cart");
    handleDrop(product);
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.idsanpham !== id));
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.idsanpham === id ? { ...item, quantity } : item))
    );
  };

  const handleCheckout = async () => {
    await Promise.all(
      cartItems.map((item) => trackBehavior(item.idsanpham, "purchase"))
    );

    setCartItems([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sản phẩm</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-4/5">
          <ProductGrid
            products={products}
            userId={userId}
            onAddToCart={handleAddToCart}
          />
        </div>

        <div className="md:w-1/5 sticky top-6 self-start">
          <ShoppingCart
            items={cartItems}
            onRemove={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
};

export { ProductCard, ProductGrid, ShopPage, CardContainer, CardItem };
