// app/favorites/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ProductCard from "@/app/component/ProductCard";
import { Product } from "./Type";

interface FavoriteProduct extends Product {
  yeuthichId: number;
}

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch(
          `/api/LikePost?userId=${session.user.name}`
        );
        if (response.ok) {
          const data = await response.json();
          setFavorites(data.favorites);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="text-center p-8">
        Please log in to view your favorites
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
      {favorites.length === 0 ? (
        <div className="text-center p-8">
          <p>You haven't added any products to your favorites yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((product) => (
            <ProductCard key={product.idsanpham} products={[]} />
          ))}
        </div>
      )}
    </div>
  );
}
