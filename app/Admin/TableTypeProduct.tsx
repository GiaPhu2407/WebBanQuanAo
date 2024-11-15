import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
        `/api/phantrangloaisanpham?page=${meta.page}&limit_size=${meta.limit_size}`
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
  }, [meta.page, meta.limit_size, reloadKey]);

  const handlePageChange = (newPage: number) => {
    setMeta((prev) => ({ ...prev, page: newPage }));
  };

  const generatePaginationNumbers = () => {
    const pageNumbers = [];
    let start = Math.max(1, meta.page - 2);
    let end = Math.min(meta.totalPages, meta.page + 2);

    if (start > 1) {
      pageNumbers.push(1);
      if (start > 2) pageNumbers.push("...");
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (end < meta.totalPages) {
      if (end < meta.totalPages - 1) pageNumbers.push("...");
      pageNumbers.push(meta.totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="space-y-4">
      <div className="w-full">
        <CardContent>
          <div className="w-full rounded-lg shadow">
            <table className="w-full divide-gray-200 bg-gradient-to-r from-red-500 to-pink-400">
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
                  categories.map((category) => (
                    <tr
                      key={category.idloaisanpham}
                      className="hover:bg-blue-50 transition-colors duration-200"
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
                          <button
                            onClick={() => onEdit(category)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => onDelete(category.idloaisanpham)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
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
                      Không có loại sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex items-center justify-center space-x-1 mt-4">
        <button
          onClick={() => handlePageChange(1)}
          disabled={meta.page === 1}
          className="px-3 py-1 rounded-md bg-white border hover:bg-gray-100 disabled:opacity-50"
        >
          «
        </button>
        <button
          onClick={() => handlePageChange(meta.page - 1)}
          disabled={meta.page === 1}
          className="px-3 py-1 rounded-md bg-white border hover:bg-gray-100 disabled:opacity-50"
        >
          ‹
        </button>

        {generatePaginationNumbers().map((number, index) => (
          <button
            key={index}
            onClick={() =>
              typeof number === "number" && handlePageChange(number)
            }
            disabled={number === "..."}
            className={`px-3 py-1 rounded-md border ${
              number === meta.page
                ? "bg-blue-500 text-white"
                : typeof number === "number" && number % 2 === 0
                ? "bg-gray-200 font-semibold"
                : "bg-white hover:bg-gray-100"
            } ${number === "..." ? "cursor-default" : ""}`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
          className="px-3 py-1 rounded-md bg-white border hover:bg-gray-100 disabled:opacity-50"
        >
          ›
        </button>
        <button
          onClick={() => handlePageChange(meta.totalPages)}
          disabled={meta.page >= meta.totalPages}
          className="px-3 py-1 rounded-md bg-white border hover:bg-gray-100 disabled:opacity-50"
        >
          »
        </button>
      </div>
    </div>
  );
};

export default TableTypeProduct;
