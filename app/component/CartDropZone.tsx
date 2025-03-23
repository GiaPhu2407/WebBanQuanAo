// File: components/CartDropZone.tsx
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { ShoppingCart } from "lucide-react";

interface CartDropZoneProps {
  orderCount: number;
  isOver: boolean;
}

const CartDropZone: React.FC<CartDropZoneProps> = ({ orderCount, isOver }) => {
  const { setNodeRef } = useDroppable({
    id: "cart-drop-zone",
  });

  return (
    <div
      ref={setNodeRef}
      className={`fixed right-4 top-4 z-50 flex items-center justify-center p-3 rounded-full shadow-lg transition-all duration-300 ${
        isOver
          ? "bg-green-500 scale-125 border-2 border-dashed border-white"
          : "bg-white"
      }`}
    >
      <div className="relative">
        <ShoppingCart
          className={`w-6 h-6 ${isOver ? "text-white" : "text-gray-800"}`}
        />
        <span
          className={`absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center ${
            isOver ? "scale-125" : ""
          }`}
        >
          {orderCount}
        </span>
      </div>
      {isOver && (
        <span className="absolute -bottom-8 whitespace-nowrap text-xs font-medium bg-green-600 text-white py-1 px-2 rounded">
          Thả để thêm vào giỏ
        </span>
      )}
    </div>
  );
};

export default CartDropZone;
