import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/app/Admin/type/product";

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
  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-white text-left">
                <input
                  type="checkbox"
                  checked={allSelected && products.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên Sản Phẩm
              </th>
              <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại SP
              </th>
              <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá
              </th>
              <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giảm Giá
              </th>
              <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Màu sắc
              </th>
              <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giới Tính
              </th>
              <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình Ảnh
              </th>
              <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-4 text-center text-gray-500">
                  Không có sản phẩm nào
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr
                  key={product.idsanpham}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 ${
                    selectedItems.includes(product.idsanpham)
                      ? "bg-blue-50"
                      : ""
                  }`}
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(product.idsanpham)}
                      onChange={(e) =>
                        onSelectItem(product.idsanpham, e.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-3 px-4">{product.idsanpham}</td>
                  <td className="py-3 px-4">{product.tensanpham}</td>
                  <td className="py-3 px-4">{product.loaisanpham?.tenloai}</td>
                  <td className="py-3 px-4 text-right">
                    {formatCurrency(product.gia)}
                  </td>
                  <td className="py-3 px-4 text-center">{product.giamgia}%</td>
                  <td className="py-3 px-4 text-center">{product.mausac}</td>
                  <td className="py-3 px-4 text-center">
                    {product.gioitinh ? "Nam" : "Nữ"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <img
                        src={product.hinhanh || "/placeholder.png"}
                        alt={product.tensanpham}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
