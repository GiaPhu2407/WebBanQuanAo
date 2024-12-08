// AppContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';

interface FavoriteContextType {
  favorites: number[];
  toggleFavorite: (productId: number) => Promise<void>;
  favoritesCount: number;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Fetch user session
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(data => {
        setUserData(data);
        if (data?.id) {
          // Fetch user's favorites
          fetch(`/api/favorites?userId=${data.id}`)
            .then(res => res.json())
            .then(favoritesData => {
              setFavorites(favoritesData.map((f: any) => f.idSanpham));
            });
        }
      });
  }, []);

  const toggleFavorite = async (productId: number) => {
    if (!userData?.id) return;

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUsers: userData.id,
          idSanpham: productId,
        }),
      });

      if (response.ok) {
        setFavorites(prev => 
          prev.includes(productId) 
            ? prev.filter(id => id !== productId)
            : [...prev, productId]
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <FavoriteContext.Provider value={{ 
      favorites, 
      toggleFavorite,
      favoritesCount: favorites.length 
    }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
};