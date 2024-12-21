import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LoaiSanPham {
  idloaisanpham: number;
  tenloai: string;
  mota: string;
}

interface Meta {
  page: number;
  limit_size: number;
  totalRecords: number;
  totalPages: number;
}

interface TableDashboardProps {
  onEdit: (category: LoaiSanPham) => void;
  onDelete: (id: number) => void;
  reloadKey: number;
}

const TableTypeProduct: React.FC<TableDashboardProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [categories, setCategories] = useState<LoaiSanPham[]>([]);
  const [searchText, setSearchText] = useState("");
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit_size: 10,
    totalRecords: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/phantrangloaisanpham?page=${meta.page}&limit_size=${meta.limit_size}&search=${encodeURIComponent(searchText)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      if (result.data) {
        setCategories(result.data);
        setMeta({
          page: result.meta.page,
          limit_size: result.meta.limit_size,
          totalRecords: result.meta.totalRecords,
          totalPages: result.meta.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [meta.page, meta.limit_size, searchText, reloadKey]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setMeta(prev => ({ ...prev, page: 1 }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  const handlePageChange = (newPage: number) => {
    setMeta(prev => ({ ...prev, page: newPage }));
  };

  const renderPagination = () => {
    const pages = [];
    let startPage = Math.max(1, meta.page - 2);
    let endPage = Math.min(meta.totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === meta.page ? "default" : "outline"}
          onClick={() => handlePageChange(i)}
          className="min-w-[40px]"
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 max-w-sm relative">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên loại hoặc mô tả..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        
        <div className="text-sm text-gray-600">
          Tổng số: {meta.totalRecords} loại sản phẩm
        </div>
      </div>

      <div className="w-full ">
        <CardContent>
          <div className="w-full rounded-lg shadow ">
            <table className="w-full divide-gray-200 bg-gradient-to-r from-red-500 to-pink-400 ">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-white">ID Loại SP</th>
                  <th className="px-4 py-3 text-white">Tên Loại</th>
                  <th className="px-4 py-3 text-white">Mô Tả</th>
                  <th className="px-4 py-3 text-white">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
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
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {category.idloaisanpham}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {category.tenloai}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {category.mota}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(category)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(category.idloaisanpham)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {searchText ? "Không tìm thấy kết quả phù hợp" : "Không có loại sản phẩm nào"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </div>

      {/* Updated Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Hiển thị {(meta.page - 1) * meta.limit_size + 1} -{" "}
          {Math.min(meta.page * meta.limit_size, meta.totalRecords)} trong{" "}
          {meta.totalRecords} loại sản phẩm
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(meta.page - 1)}
            disabled={meta.page === 1}
          >
            <span className="sr-only">Previous</span>
            ←
          </Button>

          {renderPagination()}

          <Button
            variant="outline"
            onClick={() => handlePageChange(meta.page + 1)}
            disabled={meta.page >= meta.totalPages}
          >
            <span className="sr-only">Next</span>
            →
          </Button>

          <Select
            value={String(meta.limit_size)}
            onValueChange={(value) =>
              setMeta((prev) => ({
                ...prev,
                limit_size: Number(value),
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TableTypeProduct;