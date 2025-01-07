import React from 'react';
import { Size } from '@/app/component/Category/type/size';

interface SizeSelectorProps {
    sizes: Size[];
    quantities: { [key: number]: number };
    selectedSize: number | null;
    onSizeSelect: (sizeId: string) => void;
  }
  
  export const SizeSelector: React.FC<SizeSelectorProps> = ({
    sizes,
    quantities,
    selectedSize,
    onSizeSelect,
  }) => {
    return (
      <div className="space-y-2">
        <span className="text-sm font-medium">Kích thước có sẵn:</span>
        <div className="grid grid-cols-2 gap-2">
          {sizes.map((sizeOption) => {
            const quantity = quantities[sizeOption.idSize] || 0;
            const isAvailable = quantity > 0;
            
            return (
              <div
                key={sizeOption.idSize}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedSize === sizeOption.idSize
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-300'
                } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => isAvailable && onSizeSelect(String(sizeOption.idSize))}
              >
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{sizeOption.tenSize}</span>
                    <span className={`text-sm ${
                      quantity === 0 ? 'text-red-500' :
                      quantity < 5 ? 'text-orange-500' : 'text-green-500'
                    }`}>
                      {quantity === 0 ? 'Hết hàng' :
                       quantity < 5 ? `Sắp hết hàng (${quantity})` :
                       `Còn ${quantity} sản phẩm`}
                    </span>
                  </div>
                  {quantity > 0 && quantity < 5 && (
                    <span className="text-xs text-orange-500">
                      Còn {quantity} sản phẩm cuối cùng
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };