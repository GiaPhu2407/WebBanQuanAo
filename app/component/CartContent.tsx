import React, { createContext, useContext, useState, useEffect } from "react";

interface CartContextType {
  cartCount: number;
  updateCartCount: (count: number) => void;
  incrementCartCount: (amount: number) => void;
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  updateCartCount: () => {},
  incrementCartCount: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  // Fetch initial cart count when component mounts
  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await fetch("/api/countdonhang");
      if (response.ok) {
        const data = await response.json();
        setCartCount(data);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const updateCartCount = (count: number) => {
    setCartCount(count);
  };

  const incrementCartCount = (amount: number) => {
    setCartCount((prevCount) => prevCount + amount);
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        updateCartCount,
        incrementCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
