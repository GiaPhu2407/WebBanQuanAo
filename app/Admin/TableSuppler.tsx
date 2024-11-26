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
  const [searchField, setSearchField] = useState("tennhacungcap");

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

  return (
    <div className="w-full">
      {/* <CardContent className="p-6"> */}
      {/* <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Danh sách nhà cung cấp
          </h2>
          <SearchBar />
        </div> */}

      <div className="rounded-lg -ml-10 ">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-red-500 to-pink-500">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                ID
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                Tên nhà cung cấp
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                Số điện thoại
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                Địa chỉ
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                Email
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-3 py-2 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-red-500 rounded-full animate-spin border-t-transparent"></div>
                    <span className="ml-2">Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : suppliers && suppliers.length > 0 ? (
              suppliers.map((supplier, index) => (
                <tr
                  key={supplier.idnhacungcap}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition-colors duration-200`}
                >
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {supplier.idnhacungcap}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {supplier.tennhacungcap}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {supplier.sodienthoai}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {supplier.diachi}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {supplier.email}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        supplier.trangthai
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {supplier.trangthai ? "Đang cung cấp" : "Ngừng cung cấp"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onEdit(supplier)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(supplier.idnhacungcap)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  {searchTerm
                    ? "Không tìm thấy kết quả phù hợp"
                    : "Không có nhà cung cấp nào"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 mt-4">
        <div className="text-sm text-gray-700">
          Kết quả: {(meta.page - 1) * meta.limit_size + 1} -{" "}
          {Math.min(meta.page * meta.limit_size, meta.totalRecords)} của{" "}
          {meta.totalRecords}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(meta.page - 1)}
            disabled={meta.page === 1}
            // className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

          {[...Array(Math.max(0, Math.min(3, meta.totalPages || 0)))].map(
            (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`min-w-[40px] h-[40px] flex items-center justify-center rounded-lg border text-sm
                  ${
                    index + 1 === meta.page
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white hover:bg-gray-50"
                  }`}
              >
                {index + 1}
              </button>
            )
          )}

          {meta.totalPages > 3 && <span className="px-2">...</span>}

          {meta.totalPages > 3 && (
            <button
              onClick={() => handlePageChange(meta.totalPages)}
              className={`min-w-[40px] h-[40px] flex items-center justify-center rounded-lg border text-sm bg-white hover:bg-gray-50`}
            >
              {meta.totalPages}
            </button>
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
      {/* </CardContent> */}
    </div>
  );
};

export default TableSupplier;
