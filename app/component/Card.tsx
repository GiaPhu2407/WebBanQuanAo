// // contexts/CartContext.tsx
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { SanPham, CartItem, CartState } from '@/app/types/auth';
// import { toast } from 'react-hot-toast';

// interface CartContextType {
//   cart: CartState;
//   addToCart: (product: SanPham, quantity?: number) => Promise<void>;
//   removeFromCart: (idgiohang: number) => Promise<void>;
//   updateQuantity: (idgiohang: number, quantity: number) => Promise<void>;
//   clearCart: () => Promise<void>;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [cart, setCart] = useState<CartState>({
//     items: [],
//     totalItems: 0,
//     totalPrice: 0
//   });

//   useEffect(() => {
//     fetchCartItems();
//   }, []);

//   const fetchCartItems = async () => {
//     try {
//       const response = await fetch('/api/giohang');
//       if (!response.ok) throw new Error('Failed to fetch cart');
      
//       const data = await response.json();
//       if (data.data && Array.isArray(data.data)) {
//         const cartItems = data.data;
//         setCart({
//           items: cartItems,
//           totalItems: cartItems.reduce((sum: any, item: { soluong: any; }) => sum + item.soluong, 0),
//           totalPrice: cartItems.reduce((sum: number, item: { sanpham: { gia: number; }; soluong: number; }) => sum + (item.sanpham.gia * item.soluong), 0)
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//       toast.error('Không thể tải giỏ hàng');
//     }
//   };

//   const addToCart = async (product: SanPham, quantity: number = 1) => {
//     try {
//       const response = await fetch('/api/giohang', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ idsanpham: product.idsanpham, soluong: quantity })
//       });

//       if (!response.ok) throw new Error('Failed to add to cart');

//       const data = await response.json();
      
//       // Update local cart state
//       setCart(prevCart => {
//         const existingItemIndex = prevCart.items.findIndex(
//           item => item.idsanpham === product.idsanpham
//         );

//         let updatedItems;
//         if (existingItemIndex > -1) {
//           updatedItems = [...prevCart.items];
//           updatedItems[existingItemIndex].soluong += quantity;
//         } else {
//           updatedItems = [...prevCart.items, { ...data.data, sanpham: product }];
//         }

//         return {
//           items: updatedItems,
//           totalItems: updatedItems.reduce((sum, item) => sum + item.soluong, 0),
//           totalPrice: updatedItems.reduce((sum, item) => sum + (item.sanpham.gia * item.soluong), 0)
//         };
//       });

//       toast.success(`Đã thêm ${product.tensanpham} vào giỏ hàng`);
//     } catch (error) {
//       console.error('Add to cart error:', error);
//       toast.error('Không thể thêm sản phẩm vào giỏ hàng');
//     }
//   };

//   const removeFromCart = async (idgiohang: number) => {
//     try {
//       const response = await fetch(`/api/giohang/${idgiohang}`, {
//         method: 'DELETE'
//       });

//       if (!response.ok) throw new Error('Failed to remove item');

//       setCart(prevCart => ({
//         items: prevCart.items.filter(item => item.idgiohang !== idgiohang),
//         totalItems: prevCart.totalItems - (prevCart.items.find(item => item.idgiohang === idgiohang)?.soluong || 0),
//         totalPrice: prevCart.totalPrice - (prevCart.items.find(item => item.idgiohang === idgiohang)?.sanpham.gia || 0)
//       }));

//       toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
//     } catch (error) {
//       console.error('Remove from cart error:', error);
//       toast.error('Không thể xóa sản phẩm khỏi giỏ hàng');
//     }
//   };

//   const updateQuantity = async (idgiohang: number, quantity: number) => {
//     try {
//       if (quantity <= 0) {
//         await removeFromCart(idgiohang);
//         return;
//       }

//       const response = await fetch(`/api/giohang/${idgiohang}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ soluong: quantity })
//       });

//       if (!response.ok) throw new Error('Failed to update quantity');

//       setCart(prevCart => {
//         const updatedItems = prevCart.items.map(item => 
//           item.idgiohang === idgiohang 
//             ? { ...item, soluong: quantity }
//             : item
//         );

//         return {
//           items: updatedItems,
//           totalItems: updatedItems.reduce((sum, item) => sum + item.soluong, 0),
//           totalPrice: updatedItems.reduce((sum, item) => sum + (item.sanpham.gia * item.soluong), 0)
//         };
//       });

//       toast.success('Cập nhật số lượng thành công');
//     } catch (error) {
//       console.error('Update quantity error:', error);
//       toast.error('Không thể cập nhật số lượng');
//     }
//   };

//   const clearCart = async () => {
//     try {
//       const response = await fetch('/api/giohang/clear', { method: 'DELETE' });
//       if (!response.ok) throw new Error('Failed to clear cart');

//       setCart({
//         items: [],
//         totalItems: 0,
//         totalPrice: 0
//       });

//       toast.success('Đã xóa toàn bộ giỏ hàng');
//     } catch (error) {
//       console.error('Clear cart error:', error);
//       toast.error('Không thể xóa giỏ hàng');
//     }
//   };

//   return (
//     <CartContext.Provider value={{ 
//       cart, 
//       addToCart, 
//       removeFromCart, 
//       updateQuantity, 
//       clearCart 
//     }}>
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