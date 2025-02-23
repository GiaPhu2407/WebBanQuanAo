import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface LoaiSanPhamTableProps {
  categories: Array<{
    idloaisanpham: number;
    tenloai: string;
    mota: string;
  }>;
  loading: boolean;
  selectedItems: number[];
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (id: number, checked: boolean) => void;
  onEdit: (category: any) => void;
  onDelete: (id: number) => void;
  searchText: string;
}

export const LoaiSanPhamTable: React.FC<LoaiSanPhamTableProps> = ({
  categories,
  loading,
  selectedItems,
  onSelectAll,
  onSelectItem,
  onEdit,
  onDelete,
  searchText,
}) => {
  const allSelected =
    categories.length > 0 && selectedItems.length === categories.length;
  const someSelected =
    selectedItems.length > 0 && selectedItems.length < categories.length;

  return (
    <div className="w-full rounded-lg shadow">
      <table className="w-full divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <div className="flex items-center">
                <Checkbox
                  checked={allSelected || someSelected}
                  onCheckedChange={(checked: boolean) => onSelectAll(checked)}
                  // For visual indication of partial selection
                  className={
                    someSelected ? "data-[state=checked]:bg-gray-500" : ""
                  }
                />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID Loại SP
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên Loại
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mô Tả
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao Tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center">
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                  <span className="ml-2">Đang tải dữ liệu...</span>
                </div>
              </td>
            </tr>
          ) : categories && categories.length > 0 ? (
            categories.map((category, index) => (
              <tr
                key={category.idloaisanpham}
                className={`${
                  selectedItems.includes(category.idloaisanpham)
                    ? "bg-blue-50"
                    : index % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Checkbox
                      checked={selectedItems.includes(category.idloaisanpham)}
                      onCheckedChange={(checked: boolean) =>
                        onSelectItem(category.idloaisanpham, checked)
                      }
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.idloaisanpham}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.tenloai}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {category.mota}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(category)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(category.idloaisanpham)}
                    >
                      Xóa
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                Không tìm thấy dữ liệu
                {searchText && ` phù hợp với từ khóa "${searchText}"`}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LoaiSanPhamTable;
