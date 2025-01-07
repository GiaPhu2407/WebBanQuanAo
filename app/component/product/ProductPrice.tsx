import React from 'react';
import { formatPrice, calculateDiscountedPrice } from '@/app/component/Category/utils/price';

interface ProductPriceProps {
  price: number;
  discount: number;
}

export const ProductPrice: React.FC<ProductPriceProps> = ({ price, discount }) => {
  const discountedPrice = calculateDiscountedPrice(price, discount);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-blue-600">
          {formatPrice(discountedPrice)}
        </span>
        {discount > 0 && (
          <span className="text-lg text-gray-500 line-through">
            {formatPrice(price)}
          </span>
        )}
      </div>
      {discount > 0 && (
        <span className="inline-block px-2 py-1 text-sm font-semibold text-white bg-red-500 rounded-full">
          Giảm {discount}%
        </span>
      )}
    </div>
  );
};