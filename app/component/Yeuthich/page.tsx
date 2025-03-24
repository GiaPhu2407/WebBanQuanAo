"use client";

import { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

interface FavoriteItem {
  idYeuthich: number;
  sanpham: Product;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // In a real application, you would get the user ID from your authentication system
  const userId = "1"; // Replace with actual user ID from your auth system

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`/api/wishlist?userId=${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch favorites");
      }

      setFavorites(data.favorites);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (productId: number) => {
    try {
      const response = await fetch(
        `/api/wishlist?userId=${userId}&productId=${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove from favorites");
      }

      // Update the UI by removing the item
      setFavorites(
        favorites.filter((fav) => fav.sanpham.idsanpham !== productId)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-6 h-6 text-red-500" />
        <h1 className="text-2xl font-bold">Sản phẩm yêu thích</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Bạn chưa có sản phẩm yêu thích nào</p>
          <Link
            href="/products"
            className="inline-block mt-4 text-blue-600 hover:text-blue-700"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((favorite) => {
            const product = favorite.sanpham;
            const discountedPrice =
              product.giamgia > 0
                ? product.gia * (1 - product.giamgia / 100)
                : product.gia;

            return (
              <div
                key={favorite.idYeuthich}
                className="bg-white rounded-lg shadow-md overflow-hidden group"
              >
                <div className="relative aspect-square">
                  <Link href={`/component/Category?id=${product.idsanpham}`}>
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
                  </Link>
                  <button
                    onClick={() => removeFromFavorites(product.idsanpham)}
                    className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>

                <div className="p-4">
                  <Link
                    href={`/component/Category?id=${product.idsanpham}`}
                    className="block"
                  >
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      {product.tensanpham}
                    </h3>
                  </Link>

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

                  <div className="mt-4">
                    <Link
                      href={`/component/Category?id=${product.idsanpham}`}
                      className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
