import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import debounce from "lodash/debounce";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("tennhacungcap"); // Mặc định tìm theo tên

  // Tạo hàm debounce để trì hoãn việc tìm kiếm
  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value);
    setMeta((prev) => ({ ...prev, page: 1 }));
  }, 500);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: meta.page.toString(),
        limit_size: meta.limit_size.toString(),
      });

      if (searchTerm) {
        queryParams.append("search", searchTerm);
        queryParams.append("searchField", searchField);
      }

      const response = await fetch(`/api/phantrangnhacungcap?${queryParams}`);
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
  }, [meta.page, meta.limit_size, reloadKey, searchTerm, searchField]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setMeta((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleLimitChange = (value: string) => {
    setMeta((prev) => ({ ...prev, page: 1, limit_size: parseInt(value) }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  };

  const handleSearchFieldChange = (value: string) => {
    setSearchField(value);
    if (searchTerm) {
      setMeta((prev) => ({ ...prev, page: 1 }));
    }
  };

  const SearchBar = () => (
    <div className="flex items-center gap-4">
      <Select value={searchField} onValueChange={handleSearchFieldChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Tìm theo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tennhacungcap">Tên nhà cung cấp</SelectItem>
          <SelectItem value="sodienthoai">Số điện thoại</SelectItem>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="diachi">Địa chỉ</SelectItem>
        </SelectContent>
      </Select>
      <div className="relative">
        <input
          type="text"
          placeholder="Nhập từ khóa tìm kiếm..."
          onChange={handleSearchChange}
          className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>
    </div>
  );

  const Pagination = () => {
    const pageNumbers = [];
    let leftSide = meta.page - 2;
    let rightSide = meta.page + 2;

    if (leftSide <= 0) {
      leftSide = 1;
      rightSide = Math.min(5, meta.totalPages);
    }

    if (rightSide > meta.totalPages) {
      rightSide = meta.totalPages;
      leftSide = Math.max(1, meta.totalPages - 4);
    }

    for (let i = leftSide; i <= rightSide; i++) {
      pageNumbers.push(i);
    }

    if (meta.totalPages <= 1) return null;

    return (
      <div className="flex flex-col items-center gap-4 mt-4">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-700">
            <span>Hiển thị </span>
            <Select
              value={meta.limit_size.toString()}
              onValueChange={handleLimitChange}
            >
              <SelectTrigger className="w-20">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span> mục / trang</span>
          </div>
          <div className="text-sm text-gray-700">
            Trang <span className="font-medium">{meta.page}</span> /{" "}
            <span className="font-medium">{meta.totalPages}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={meta.page === 1}
            className="px-3 py-2 rounded-md bg-white border disabled:opacity-50 hover:bg-gray-100"
            aria-label="Trang đầu"
          >
            ««
          </button>

          <button
            onClick={() => handlePageChange(meta.page - 1)}
            disabled={meta.page === 1}
            className="px-3 py-2 rounded-md bg-white border disabled:opacity-50 hover:bg-gray-100"
            aria-label="Trang trước"
          >
            «
          </button>

          {leftSide > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-2 rounded-md border bg-white hover:bg-gray-100"
              >
                1
              </button>
              {leftSide > 2 && <span className="px-3 py-2">...</span>}
            </>
          )}

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-3 py-2 rounded-md border ${
                number === meta.page
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {number}
            </button>
          ))}

          {rightSide < meta.totalPages && (
            <>
              {rightSide < meta.totalPages - 1 && (
                <span className="px-3 py-2">...</span>
              )}
              <button
                onClick={() => handlePageChange(meta.totalPages)}
                className="px-3 py-2 rounded-md border bg-white hover:bg-gray-100"
              >
                {meta.totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(meta.page + 1)}
            disabled={meta.page >= meta.totalPages}
            className="px-3 py-2 rounded-md bg-white border disabled:opacity-50 hover:bg-gray-100"
            aria-label="Trang sau"
          >
            »
          </button>

          <button
            onClick={() => handlePageChange(meta.totalPages)}
            disabled={meta.page >= meta.totalPages}
            className="px-3 py-2 rounded-md bg-white border disabled:opacity-50 hover:bg-gray-100"
            aria-label="Trang cuối"
          >
            »»
          </button>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Danh sách nhà cung cấp
          </h2>
          <SearchBar />
        </div>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-red-500 to-pink-500">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Tên nhà cung cấp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-red-500 rounded-full animate-spin border-t-transparent"></div>
                      <span className="ml-2">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : suppliers && suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <tr
                    key={supplier.idnhacungcap}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.idnhacungcap}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.tennhacungcap}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.sodienthoai}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.diachi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => onEdit(supplier)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          title="Chỉnh sửa"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(supplier.idnhacungcap)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          title="Xóa"
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
                    {searchTerm
                      ? "Không tìm thấy kết quả phù hợp"
                      : "Không có nhà cung cấp nào"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination />
      </CardContent>
    </Card>
  );
};

export default TableSupplier;
