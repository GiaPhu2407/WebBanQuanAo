import React from 'react';
import { Input } from "@/components/ui/input";
import { Size } from '@/app/Admin/type/product';

interface ProductSizeQuantityProps {
  size: Size;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export function ProductSizeQuantity({
  size,
  quantity,
  onQuantityChange,
  onRemove
}: ProductSizeQuantityProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="min-w-[60px]">{size.tenSize}</span>
      <Input
        type="number"
        min="0"
        value={quantity}
        onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
        className="w-24"
      />
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700"
        type="button"
      >
        ×
      </button>
    </div>
  );
}