import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface LoaiSanPham {
  idloaisanpham: number;
  tenloai: string;
  mota: string;
}

interface LoaiSanPhamTableProps {
  categories: LoaiSanPham[];
  loading: boolean;
  selectedItems: number[];
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (id: number, checked: boolean) => void;
  onEdit: (category: LoaiSanPham) => void;
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

  // Thêm CSS toàn cục để đảm bảo áp dụng khoảng cách dòng nhỏ
  useEffect(() => {
    // Tạo style element
    const style = document.createElement("style");
    style.id = "compact-table-styles";

    // Thêm CSS cực kỳ chặt chẽ
    style.innerHTML = `
      .ultra-compact-table tr {
        height: 30px !important; /* Chiều cao cố định nhỏ */
        min-height: 30px !important;
        max-height: 30px !important;
        line-height: 1 !important;
      }
      
      .ultra-compact-table td,
      .ultra-compact-table th {
        padding-top: 2px !important;
        padding-bottom: 2px !important;
        margin-top: -2px !important;
        margin-bottom: -2px !important;
        height: 30px !important;
        max-height: 30px !important;
        line-height: 1 !important;
      }
      
      .ultra-compact-table .button-container {
        display: flex;
        padding: 0 !important;
        margin: 0 !important;
        height: 20px !important;
      }
      
      .ultra-compact-table button {
        padding: 0 8px !important;
        height: 20px !important;
        line-height: 1 !important;
        min-height: unset !important;
        margin: 0 !important;
      }
    `;

    // Thêm vào head của document
    document.head.appendChild(style);

    // Dọn dẹp khi component unmount
    return () => {
      if (document.getElementById("compact-table-styles")) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="w-full rounded-lg shadow">
      <table className="w-full divide-gray-200 ultra-compact-table">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 text-left">
              <div className="flex items-center">
                <Checkbox
                  checked={allSelected || someSelected}
                  onCheckedChange={(checked: boolean) => onSelectAll(checked)}
                  className={
                    someSelected ? "data-[state=checked]:bg-gray-500" : ""
                  }
                />
              </div>
            </th>
            <th className="px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID Loại SP
            </th>
            <th className="px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên Loại
            </th>
            <th className="px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mô Tả
            </th>
            <th className="px-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao Tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={5} className="px-2 text-center">
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                  <span className="ml-2 text-xs">Đang tải...</span>
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
                <td className="px-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <Checkbox
                      checked={selectedItems.includes(category.idloaisanpham)}
                      onCheckedChange={(checked: boolean) =>
                        onSelectItem(category.idloaisanpham, checked)
                      }
                    />
                  </div>
                </td>
                <td className="px-2 whitespace-nowrap text-xs text-gray-900">
                  {category.idloaisanpham}
                </td>
                <td className="px-2 whitespace-nowrap text-xs text-gray-900">
                  {category.tenloai}
                </td>
                <td className="px-2 text-xs text-gray-900">{category.mota}</td>
                <td className="px-2 whitespace-nowrap text-xs">
                  <div className="flex space-x-1 button-container">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs py-0 h-5"
                      onClick={() => onEdit(category)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="text-xs py-0 h-5"
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
              <td
                colSpan={5}
                className="px-2 text-center text-xs text-gray-500"
              >
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
