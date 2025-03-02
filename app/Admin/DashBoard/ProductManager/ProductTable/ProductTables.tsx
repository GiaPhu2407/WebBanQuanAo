import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/app/Admin/type/product";
import ProductDetailsDialog from "./ProductDetails";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  selectedItems: number[];
  onSelectItem: (id: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
  selectedItems,
  onSelectItem,
  onSelectAll,
  allSelected,
}) => {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="mr-2"
                />
                Tên Sản Phẩm
              </th>
              <th className="py-3 px-4 text-right w-[120px] text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá
              </th>
              <th className="py-3 px-4 text-center w-[80px] text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ">
                Số Lượng
              </th>
              <th className="py-3 px-4 text-center w-[150px] text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.idsanpham} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(product.idsanpham)}
                    onChange={(e) =>
                      onSelectItem(product.idsanpham, e.target.checked)
                    }
                    className="mr-2"
                  />
                  {product.tensanpham}
                </td>
                <td className="py-3 px-4 text-right w-[120px] whitespace-nowrap">
                  {formatCurrency(Number(product.gia))}
                </td>
                <td className="py-3 px-4 text-center w-[80px]">
                  {product.ProductSizes?.reduce(
                    (total, size) => total + size.soluong,
                    0
                  ) || 0}
                </td>
                <td className="py-3 px-4 text-center w-[150px]">
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
