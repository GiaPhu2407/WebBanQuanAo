import React, { useEffect, useState } from "react";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

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

  const handleLimitChange = (newLimit: number) => {
    setMeta((prev) => ({ ...prev, page: 1, limit_size: newLimit }));
  };

  return (
    <div className="space-y-4">
      <div className=" max-w-full ">
        <table className=" border-collapse border border-gray-200">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="px-4 py-2 text-center">ID Loại SP</th>
              <th className="px-4 py-2 text-center">Tên Loại</th>
              <th className="px-4 py-2 text-center">Mô Tả</th>
              <th className="px-4 py-2 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : categories && categories.length > 0 ? (
              categories.map((category) => (
                <tr
                  key={category.idloaisanpham}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-center">
                    {category.idloaisanpham}
                  </td>
                  <td className="px-4 py-2">{category.tenloai}</td>
                  <td className="px-4 py-2">{category.mota}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(category)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil />
                      </button>
                      <button
                        onClick={() => onDelete(category.idloaisanpham)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Không có loại sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center py-2">
        <button
          onClick={() => handlePageChange(meta.page - 1)}
          disabled={meta.page === 1}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          <ChevronLeft />
          <span className="ml-1">Trang trước</span>
        </button>
        <span className="text-gray-700">
          Trang {meta.page} / {meta.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          <span className="mr-1">Trang sau</span>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TableTypeProduct;
