import React from 'react';
import { Button } from "@/components/ui/button";
import { Size } from '@/app/Admin/type/product';
import { ProductSizeQuantity } from './ProductFormActions';

interface ProductSizesProps {
  sizes: Size[];
  selectedSizes: { [key: number]: number };
  onSizeChange: (sizeId: number, quantity: number) => void;
  onSizeRemove: (sizeId: number) => void;
}

export function ProductSizes({
  sizes,
  selectedSizes,
  onSizeChange,
  onSizeRemove
}: ProductSizesProps) {
  // Lọc các size chưa được chọn
  const availableSizes = sizes.filter(size => 
    !Object.keys(selectedSizes).includes(size.idSize.toString())
  );

  const handleAddSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sizeId = parseInt(e.target.value);
    if (!isNaN(sizeId)) {
      onSizeChange(sizeId, 0); // Thêm size mới với số lượng ban đầu là 0
      e.target.value = ""; // Reset giá trị của select
    }
  };

  return (
    <div className="space-y-4">
      {/* Hiển thị danh sách size đã chọn */}
      {Object.entries(selectedSizes).map(([sizeId, quantity]) => {
        const size = sizes.find(s => s.idSize === parseInt(sizeId));
        if (!size) return null;

        return (
          <ProductSizeQuantity
            key={sizeId}
            size={size}
            quantity={quantity}
            onQuantityChange={(newQuantity) => onSizeChange(parseInt(sizeId), newQuantity)}
            onRemove={() => onSizeRemove(parseInt(sizeId))}
          />
        );
      })}

      {/* Hiển thị dropdown thêm size */}
      {availableSizes.length > 0 ? (
        <div>
          <label htmlFor="add-size" className="block text-sm font-medium mb-1">
            Thêm size
          </label>
          <select
            id="add-size"
            className="w-full p-2 border rounded-md"
            onChange={handleAddSize}
            defaultValue=""
          >
            <option value="" disabled>Chọn size</option>
            {availableSizes.map((size) => (
              <option key={size.idSize} value={size.idSize}>
                {size.tenSize}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Không còn size nào để thêm.</p>
      )}
    </div>
  );
}
