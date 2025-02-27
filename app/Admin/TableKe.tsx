import React, { useEffect, useState } from "react";
import { Pencil, Trash2, LayoutGrid } from "lucide-react";

interface Ke {
  idke: number;
  idvung: number | null;
  tenke: string | null;
  vung?: {
    idVung: number;
    tenvung?: string;
  };
}

interface Meta {
  page: number;
  limit_size: number;
  totalRecords: number;
  totalPages: number;
}

interface KeTableProps {
  onEdit: (ke: Ke) => void;
  onDelete: (id: number) => void;
  reloadKey: number;
}

const KeTable: React.FC<KeTableProps> = ({ onEdit, onDelete, reloadKey }) => {
  const [keItems, setKeItems] = useState<Ke[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit_size: 10,
    totalRecords: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  const fetchKeItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/phantrangke?page=${meta.page}&limit_size=${meta.limit_size}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      if (result.data) {
        setKeItems(result.data);
        setMeta({
          page: result.meta.page,
          limit_size: result.meta.limit_size,
          totalRecords: result.meta.totalRecords,
          totalPages: result.meta.totalPage,
        });
      }
    } catch (error) {
      console.error("Error fetching ke items:", error);
      setKeItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeItems();
  }, [meta.page, meta.limit_size, reloadKey]);

  const handlePageChange = (newPage: number) => {
    setMeta((prev) => ({ ...prev, page: newPage }));
  };

  const generatePaginationNumbers = () => {
    const pages = [];
    const maxButtons = 3;
    let start = Math.max(1, meta.page - Math.floor(maxButtons / 2));
    let end = Math.min(start + maxButtons - 1, meta.totalPages);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="space-y-4">
      <div className="w-full rounded-lg shadow">
        <table className="w-full divide-gray-200 bg-gradient-to-r from-blue-500 to-purple-400">
          <thead>
            <tr>
              <th className="px-6 py-3 text-white">ID Kệ</th>
              <th className="px-6 py-3 text-white">Tên Kệ</th>
              <th className="px-6 py-3 text-white">Vùng</th>
              <th className="px-6 py-3 text-white">Thao Tác</th>
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
            ) : keItems && keItems.length > 0 ? (
              keItems.map((keItem, index) => (
                <tr
                  key={keItem.idke}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition-colors duration-200`}
                >
                  <td className="px-6 py-4 text-center">{keItem.idke}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <LayoutGrid className="w-5 h-5 mr-2 text-blue-600" />
                      {keItem.tenke || "Chưa đặt tên"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {keItem.vung?.tenvung || "Chưa phân vùng"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onEdit(keItem)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(keItem.idke)}
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
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Không có dữ liệu kệ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4">
        <div className="text-sm text-gray-700">
          Kết quả: {(meta.page - 1) * meta.limit_size + 1} -{" "}
          {Math.min(meta.page * meta.limit_size, meta.totalRecords)} của{" "}
          {meta.totalRecords}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(meta.page - 1)}
            disabled={meta.page === 1}
            className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {generatePaginationNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`min-w-[40px] h-[40px] flex items-center justify-center rounded-lg border text-sm
                ${
                  pageNum === meta.page
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white hover:bg-gray-50"
                }`}
            >
              {pageNum}
            </button>
          ))}

          {meta.totalPages > 3 && meta.page < meta.totalPages - 1 && (
            <>
              <span className="px-2">...</span>
              <button
                onClick={() => handlePageChange(meta.totalPages)}
                className={`min-w-[40px] h-[40px] flex items-center justify-center rounded-lg border text-sm bg-white hover:bg-gray-50`}
              >
                {meta.totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(meta.page + 1)}
            disabled={meta.page >= meta.totalPages}
            className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="relative ml-2">
            <select
              value={meta.limit_size}
              onChange={(e) =>
                setMeta((prev) => ({
                  ...prev,
                  limit_size: Number(e.target.value),
                  page: 1,
                }))
              }
              className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 cursor-pointer text-sm"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeTable;