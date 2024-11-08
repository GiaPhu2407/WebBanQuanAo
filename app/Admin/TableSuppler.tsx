import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface NhaCungCap {
  idnhacungcap: number;
  tennhacungcap: string;
  sodienthoai: string;
  diachi: string;
  email: string;
  trangthai: boolean;
}

interface Meta {
  page: number;
  limit_size: number;
  totalRecords: number;
  totalPages: number;
}

interface TableSupplierProps {
  onEdit: (supplier: NhaCungCap) => void;
  onDelete: (id: number) => void;
  reloadKey: number;
}

const TableSupplier: React.FC<TableSupplierProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [suppliers, setSuppliers] = useState<NhaCungCap[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit_size: 10,
    totalRecords: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/phantrangnhacungcap?page=${meta.page}&limit_size=${meta.limit_size}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      if (result.data) {
        setSuppliers(result.data);
        setMeta({
          page: result.meta.page,
          limit_size: result.meta.limit_size,
          totalRecords: result.meta.totalRecords,
          totalPages: result.meta.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
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
    <div className="space-y-4 -ml-40 ">
      <div className="w-full">
        <CardContent>
          <div className="w-full rounded-lg shadow">
            <table className="w-full divide-gray-200 bg-gradient-to-r from-red-500 to-pink-400">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-white">ID</th>
                  <th className="px-4 py-3 text-white">Tên nhà cung cấp</th>
                  <th className="px-4 py-3 text-white">Số điện thoại</th>
                  <th className="px-4 py-3 text-white">Địa chỉ</th>
                  <th className="px-4 py-3 text-white">Email</th>
                  <th className="px-4 py-3 text-white">Trạng thái</th>
                  <th className="px-4 py-3 text-white">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                        <span className="ml-2">Đang tải dữ liệu...</span>
                      </div>
                    </td>
                  </tr>
                ) : suppliers && suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <tr
                      key={supplier.idnhacungcap}
                      className={`hover:bg-blue-50 transition-colors duration-200`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {supplier.idnhacungcap}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {supplier.tennhacungcap}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {supplier.sodienthoai}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {supplier.diachi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {supplier.email}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            supplier.trangthai
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {supplier.trangthai
                            ? "Đang cung cấp"
                            : "Ngừng cung cấp"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => onEdit(supplier)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => onDelete(supplier.idnhacungcap)}
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
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Không có nhà cung cấp nào
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

export default TableSupplier;
