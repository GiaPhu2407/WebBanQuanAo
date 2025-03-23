import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface Product {
  idsanpham: number;
  tensanpham: string;
  gia: number;
  giamgia: number;
  hinhanh: string;
  ProductColors?: {
    idmausac: number;
    hinhanh: string;
  }[];
}

export const SortableProduct: React.FC<{ product: Product }> = ({ product }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.idsanpham });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  const discountedPrice = product.giamgia > 0
    ? product.gia * (1 - product.giamgia / 100)
    : product.gia;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white rounded-lg overflow-hidden shadow-md transition-shadow hover:shadow-lg`}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 cursor-grab active:cursor-grabbing p-2 rounded-full bg-white/80 hover:bg-white z-10"
      >
        <GripVertical className="w-5 h-5 text-gray-500" />
      </div>

      <div className="aspect-square overflow-hidden">
        <img
          src={product.hinhanh}
          alt={product.tensanpham}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        {product.giamgia > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
            -{product.giamgia}%
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          {product.tensanpham}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(discountedPrice)}
          </span>
          {product.giamgia > 0 && (
            <span className="text-sm text-gray-500 line-through">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(product.gia)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};