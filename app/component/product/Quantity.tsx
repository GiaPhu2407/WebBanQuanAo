import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onChange: (quantity: number) => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  maxQuantity,
  onChange,
}) => {
  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium">Số lượng:</span>
      <div className="flex items-center border border-gray-300 rounded-lg">
        <button
          onClick={() => onChange(quantity - 1)}
          className="px-3 py-2 hover:bg-gray-100"
          disabled={quantity <= 1}
        >
          -
        </button>
        <input
          type="number"
          min="1"
          max={maxQuantity}
          value={quantity}
          onChange={(e) => {
            const newQuantity = parseInt(e.target.value) || 1;
            onChange(Math.min(newQuantity, maxQuantity));
          }}
          className="w-16 text-center border-x border-gray-300"
        />
        <button
          onClick={() => onChange(quantity + 1)}
          className="px-3 py-2 hover:bg-gray-100"
          disabled={quantity >= maxQuantity}
        >
          +
        </button>
      </div>
    </div>
  );
};