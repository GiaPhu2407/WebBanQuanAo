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

interface User {
  idUsers: number;
  Tentaikhoan: string;
  Matkhau: string;
  Hoten: string;
  Sdt: string;
  Diachi: string;
  Email: string;
  idRole: number;
  Ngaydangky: string;
  role?: {
    tenrole: string;
    mota: string;
  };
}

interface Meta {
  page: number;
  limit_size: number;
  totalRecords: number;
  totalPages: number;
}

interface TableUserDashboardProps {
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  reloadKey: number;
}

const TableUserDashboard: React.FC<TableUserDashboardProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState("");
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit_size: 10,
    totalRecords: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/phantranguser?page=${meta.page}&limit_size=${
          meta.limit_size
        }&search=${encodeURIComponent(searchText)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      if (result.data) {
        setUsers(result.data);
        setMeta({
          page: result.meta.page,
          limit_size: result.meta.limit_size,
          totalRecords: result.meta.totalRecords,
          totalPages: result.meta.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [meta.page, meta.limit_size, searchText, reloadKey]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setMeta((prev) => ({ ...prev, page: 1 }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  const handlePageChange = (newPage: number) => {
    setMeta((prev) => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
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
        <button
          key={i}
          className={`join-item btn btn-sm ${
            meta.page === i ? "btn-active" : ""
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="px-4">
      <div className="space-y-4">
        {/* Search Input */}
        <div className="flex justify-between items-center gap-4 mb-6">
          <div className="flex-1 max-w-sm relative">
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          <div className="text-sm text-gray-600 font-medium">
            Tổng số: {meta.totalRecords} người dùng
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                <span className="text-gray-600">Đang tải dữ liệu...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Tên tài khoản
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Họ tên
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        SĐT
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Địa chỉ
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">
                        Vai trò
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Ngày đăng ký
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.length > 0 ? (
                      users.map((user) => (
                        <tr
                          key={user.idUsers}
                          className="border-b hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-4 py-3 text-center font-medium text-gray-900">
                            {user.idUsers}
                          </td>
                          <td className="px-4 py-3 text-gray-900 font-medium">
                            {user.Tentaikhoan}
                          </td>
                          <td className="px-4 py-3 text-gray-900">
                            {user.Hoten}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {user.Sdt}
                          </td>
                          <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">
                            {user.Diachi}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {user.Email}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.idRole === 1
                                  ? "bg-blue-100 text-blue-800"
                                  : user.idRole === 2
                                  ? "bg-red-100 text-red-800"
                                  : user.idRole === 3
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {user.idRole === 1
                                ? "User"
                                : user.idRole === 2
                                ? "Admin"
                                : user.idRole === 3
                                ? "Nhân viên"
                                : "Chưa phân quyền"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {formatDate(user.Ngaydangky)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => onEdit(user)}
                                className="btn btn-sm btn-circle btn-ghost text-amber-600 hover:bg-amber-50"
                                title="Chỉnh sửa"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDelete(user.idUsers)}
                                className="btn btn-sm btn-circle btn-ghost text-red-600 hover:bg-red-50"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={9}
                          className="text-center py-8 text-gray-500"
                        >
                          {searchText
                            ? "Không tìm thấy kết quả phù hợp"
                            : "Không có người dùng nào"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t">
                  <div>
                    <p className="text-sm text-gray-600">
                      Hiển thị {(meta.page - 1) * meta.limit_size + 1} -{" "}
                      {Math.min(meta.page * meta.limit_size, meta.totalRecords)}{" "}
                      trong {meta.totalRecords} người dùng
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="join">
                      <button
                        className="join-item btn btn-sm"
                        onClick={() => handlePageChange(1)}
                        disabled={meta.page === 1}
                      >
                        «
                      </button>
                      <button
                        className="join-item btn btn-sm"
                        onClick={() => handlePageChange(meta.page - 1)}
                        disabled={meta.page === 1}
                      >
                        ‹
                      </button>

                      {renderPagination()}

                      <button
                        className="join-item btn btn-sm"
                        onClick={() => handlePageChange(meta.page + 1)}
                        disabled={meta.page >= meta.totalPages}
                      >
                        ›
                      </button>
                      <button
                        className="join-item btn btn-sm"
                        onClick={() => handlePageChange(meta.totalPages)}
                        disabled={meta.page >= meta.totalPages}
                      >
                        »
                      </button>
                    </div>

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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableUserDashboard;
