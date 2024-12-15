// // contexts/CartContext.tsx
// import React, { createContext, useState, useContext, useEffect } from 'react';

// interface CartItem {
//   productId: number;
//   quantity: number;
//   sizeId: number;
// }

// interface CartContextType {
//   cartItems: CartItem[];
//   addToCart: (item: CartItem) => void;
//   updateCartItem: (productId: number, sizeId: number, quantity: number) => void;
//   removeFromCart: (productId: number, sizeId: number) => void;
//   clearCart: () => void;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   // Load cart from localStorage on initial load
//   useEffect(() => {
//     const savedCartItems = localStorage.getItem('cartItems');
//     if (savedCartItems) {
//       setCartItems(JSON.parse(savedCartItems));
//     }
//   }, []);

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('cartItems', JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (newItem: CartItem) => {
//     setCartItems((prevItems) => {
//       // Check if product with same size already exists
//       const existingItemIndex = prevItems.findIndex(
//         (item) =>
//           item.productId === newItem.productId &&
//           item.sizeId === newItem.sizeId
//       );

//       if (existingItemIndex > -1) {
//         // Update quantity if item exists
//         const updatedItems = [...prevItems];
//         updatedItems[existingItemIndex] = {
//           ...updatedItems[existingItemIndex],
//           quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
//         };
//         return updatedItems;
//       }

//       // Add new item if not exists
//       return [...prevItems, newItem];
//     });
//   };

//   const updateCartItem = (productId: number, sizeId: number, quantity: number) => {
//     setCartItems((prevItems) => 
//       prevItems.map((item) => 
//         item.productId === productId && item.sizeId === sizeId 
//           ? { ...item, quantity }
//           : item
//       )
//     );
//   };

//   const removeFromCart = (productId: number, sizeId: number) => {
//     setCartItems((prevItems) => 
//       prevItems.filter((item) => 
//         !(item.productId === productId && item.sizeId === sizeId)
//       )
//     );
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   return (
//     <CartContext.Provider 
//       value={{ 
//         cartItems, 
//         addToCart, 
//         updateCartItem, 
//         removeFromCart, 
//         clearCart 
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// // Custom hook to use cart context
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };