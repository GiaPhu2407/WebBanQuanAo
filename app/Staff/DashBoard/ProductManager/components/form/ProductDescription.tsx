import React from 'react';
import { Size } from '@/app/Admin/type/product';

interface ProductSizeInputProps {
  sizes: Size[];
  productSizes: { [key: number]: number };
  onSizeChange: (sizeId: number, quantity: number) => void;
}

const ProductSizeInput: React.FC<ProductSizeInputProps> = ({
  sizes,
  productSizes,
  onSizeChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {sizes.map((size) => (
        <div key={size.idSize} className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={productSizes[size.idSize] !== undefined}
              onChange={(e) => {
                if (e.target.checked) {
                  onSizeChange(size.idSize, 0);
                } else {
                  onSizeChange(size.idSize, -1);
                }
              }}
              className="checkbox"
            />
            <span>{size.tenSize}</span>
          </label>
          {productSizes[size.idSize] !== undefined && (
            <input
              type="number"
              value={productSizes[size.idSize]}
              onChange={(e) => onSizeChange(size.idSize, parseInt(e.target.value) || 0)}
              min="0"
              className="input input-bordered w-24"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductSizeInput;