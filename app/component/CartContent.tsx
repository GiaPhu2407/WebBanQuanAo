// import React, { createContext, useContext, useState, ReactNode } from 'react';

// interface CartItem {
//   idsanpham: number;
//   tensanpham: string;
//   hinhanh: string;
//   gia: number;
//   giamgia: number;
//   quantity: number;
//   size?: string;
// }

// interface CartContextType {
//   cartItems: CartItem[];
//   addToCart: (product: CartItem) => void;
//   removeFromCart: (productId: number) => void;
//   updateQuantity: (productId: number, quantity: number) => void;
//   cartCount: number;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   const addToCart = (product: CartItem) => {
//     setCartItems(prevItems => {
//       const existingItem = prevItems.find(item => item.idsanpham === product.idsanpham);
//       if (existingItem) {
//         return prevItems.map(item =>
//           item.idsanpham === product.idsanpham
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       }
//       return [...prevItems, { ...product, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (productId: number) => {
//     setCartItems(prevItems => prevItems.filter(item => item.idsanpham !== productId));
//   };

//   const updateQuantity = (productId: number, quantity: number) => {
//     setCartItems(prevItems =>
//       prevItems.map(item =>
//         item.idsanpham === productId
//           ? { ...item, quantity: Math.max(0, quantity) }
//           : item
//       )
//     );
//   };

//   const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

//   return (
//     <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartCount }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// }