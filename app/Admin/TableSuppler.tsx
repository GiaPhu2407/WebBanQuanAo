import React, { useEffect, useState } from "react";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

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

  const handleLimitChange = (newLimit: number) => {
    setMeta((prev) => ({ ...prev, page: 1, limit_size: newLimit }));
  };

  return (
    <div className="space-y-4">
      <div className="max-w-full">
        <table className="border-collapse border border-gray-200">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="px-4 py-2 text-center">ID</th>
              <th className="px-4 py-2 text-center">Tên nhà cung cấp</th>
              <th className="px-4 py-2 text-center">Số điện thoại</th>
              <th className="px-4 py-2 text-center">Địa chỉ</th>
              <th className="px-4 py-2 text-center">Email</th>
              <th className="px-4 py-2 text-center">Trạng thái</th>
              <th className="px-4 py-2 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : suppliers && suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <tr
                  key={supplier.idnhacungcap}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-center">
                    {supplier.idnhacungcap}
                  </td>
                  <td className="px-4 py-2">{supplier.tennhacungcap}</td>
                  <td className="px-4 py-2">{supplier.sodienthoai}</td>
                  <td className="px-4 py-2">{supplier.diachi}</td>
                  <td className="px-4 py-2">{supplier.email}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        supplier.trangthai
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {supplier.trangthai ? "Đang cung cấp" : "Ngừng cung cấp"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(supplier)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil />
                      </button>
                      <button
                        onClick={() => onDelete(supplier.idnhacungcap)}
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
                <td colSpan={7} className="text-center py-4">
                  Không có nhà cung cấp nào
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

export default TableSupplier;
