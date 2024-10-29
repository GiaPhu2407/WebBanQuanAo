// context/AppContext.tsx
import React from "react";
import { createContext, useState, ReactNode } from "react";

interface AppContextType {
  favoriteProducts: number[];
  toggleFavorite: (productId: number) => void;
}

export const AppContext = createContext<AppContextType>({
  favoriteProducts: [],
  toggleFavorite: () => {},
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [favoriteProducts, setFavoriteProducts] = useState<number[]>([]);

  const toggleFavorite = (productId: number) => {
    if (favoriteProducts.includes(productId)) {
      setFavoriteProducts(favoriteProducts.filter((id) => id !== productId));
    } else {
      setFavoriteProducts([...favoriteProducts, productId]);
    }
  };

  return (
    <AppContext.Provider value={{ favoriteProducts, toggleFavorite }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => React.useContext(AppContext);
