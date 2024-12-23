import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/app/Admin/type/product';
import ProductDetailsDialog from './ProductDetails';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-red-500 to-pink-400">
            <tr>
              <th className="py-3 px-4 text-white text-left">Tên Sản Phẩm</th>
              <th className="py-3 px-4 text-white text-right">Giá</th>
              <th className="py-3 px-4 text-white text-center">Số Lượng</th>
              <th className="py-3 px-4 text-white text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.idsanpham} className="hover:bg-gray-50">
                <td className="py-3 px-4">{product.tensanpham}</td>
                <td className="py-3 px-4 text-right">
                  {formatCurrency(Number(product.gia))}
                </td>
                <td className="py-3 px-4 text-center">
                  {product.ProductSizes?.reduce((total, size) => total + size.soluong, 0) || 0}
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(product.idsanpham)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProduct && (
        <ProductDetailsDialog
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default ProductTable;