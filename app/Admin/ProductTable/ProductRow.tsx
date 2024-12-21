import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface ProductRowProps {
  product: {
    idsanpham: number;
    tensanpham: string;
    hinhanh: string;
    gia: string;
    giamgia: number;
    gioitinh: boolean;
    size: string;
    idloaisanpham: number;
  };
  categoryName: string;
  onEdit: (product: any) => void;
  onDelete: (id: number) => void;
}

const ProductRow: React.FC<ProductRowProps> = ({
  product,
  categoryName,
  onEdit,
  onDelete,
}) => {
  return (
    <tr className="hover:bg-blue-50 transition-colors duration-200">
      <td className="px-6 py-4">{product.idsanpham}</td>
      <td className="px-6 py-4">{product.tensanpham}</td>
      <td className="px-6 py-4">{categoryName}</td>
      <td className="px-6 py-4 text-right">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(Number(product.gia))}
      </td>
      <td className="px-6 py-4 text-center">{product.giamgia}%</td>
      <td className="px-6 py-4 text-center">
        {product.gioitinh ? "Nam" : "Nữ"}
      </td>
      <td className="px-6 py-4 text-center">{product.size}</td>
      <td className="px-6 py-4">
        <div className="flex justify-center">
          <img
            src={product.hinhanh || "/default-image.png"}
            alt={product.tensanpham}
            className="w-12 h-12 object-cover rounded-md shadow-sm"
          />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => onEdit(product)}
            className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(product.idsanpham)}
            className="p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;