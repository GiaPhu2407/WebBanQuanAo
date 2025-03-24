"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface FavoriteButtonProps {
  productId: number;
  initialIsFavorited?: boolean;
  onToggle?: (isFavorited: boolean) => void;
  productName?: string; // Optional product name for better notifications
}

export default function FavoriteButton({
  productId,
  initialIsFavorited = false,
  onToggle,
  productName = "Sản phẩm", // Default to "Sản phẩm" if no name provided
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);

  // In a real application, you would get the user ID from your authentication system
  const userId = "1"; // Replace with actual user ID from your auth system

  const toggleFavorite = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(
          `/api/wishlist?userId=${userId}&productId=${productId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to remove from favorites");
        }

        toast.success(`Đã xóa ${productName} khỏi danh sách yêu thích`, {
          duration: 2000,
          position: "top-right",
          icon: "💔",
        });
      } else {
        // Add to favorites
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            productId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add to favorites");
        }

        toast.success(`Đã thêm ${productName} vào danh sách yêu thích`, {
          duration: 2000,
          position: "top-right",
          icon: "❤️",
        });
      }

      setIsFavorited(!isFavorited);
      onToggle?.(!isFavorited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.", {
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-full transition-colors ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      } ${
        isFavorited
          ? "bg-red-50 hover:bg-red-100"
          : "bg-gray-50 hover:bg-gray-100"
      }`}
    >
      <Heart
        className={`w-5 h-5 ${
          isFavorited ? "fill-red-500 text-red-500" : "text-gray-500"
        }`}
      />
    </button>
  );
}
