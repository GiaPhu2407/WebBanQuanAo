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
        `/api/phantranguser?page=${meta.page}&limit_size=${meta.limit_size}&search=${encodeURIComponent(searchText)}`
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
      setMeta(prev => ({ ...prev, page: 1 }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  const handlePageChange = (newPage: number) => {
    setMeta(prev => ({ ...prev, page: newPage }));
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
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        
        <div className="text-sm text-gray-600">
          Tổng số: {meta.totalRecords} người dùng
        </div>
      </div>

      <div className="w-full">
        <CardContent>
          <div className="w-full rounded-lg shadow">
            <table className="w-full divide-gray-200">
              <thead className="bg-gradient-to-r from-red-500 to-pink-400">
                <tr>
                  <th className="px-4 py-3 text-white">ID</th>
                  <th className="px-4 py-3 text-white">Tên tài khoản</th>
                  <th className="px-4 py-3 text-white">Họ tên</th>
                  <th className="px-4 py-3 text-white">SĐT</th>
                  <th className="px-4 py-3 text-white">Địa chỉ</th>
                  <th className="px-4 py-3 text-white">Email</th>
                  <th className="px-4 py-3 text-white">Vai trò</th>
                  <th className="px-4 py-3 text-white">Ngày đăng ký</th>
                  <th className="px-4 py-3 text-white">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                        <span className="ml-2">Đang tải dữ liệu...</span>
                      </div>
                    </td>
                  </tr>
                ) : users && users.length > 0 ? (
                  users.map((user, index) => (
                    <tr
                      key={user.idUsers}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100`}
                    >
                      <td className="px-4 py-3 text-center">{user.idUsers}</td>
                      <td className="px-4 py-3">{user.Tentaikhoan}</td>
                      <td className="px-4 py-3">{user.Hoten}</td>
                      <td className="px-4 py-3">{user.Sdt}</td>
                      <td className="px-4 py-3">{user.Diachi}</td>
                      <td className="px-4 py-3">{user.Email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.idRole === 1
                              ? "bg-red-100 text-red-800"
                              : user.idRole === 2
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.idRole === 1 ? "User" : user.idRole === 2 ? "Admin" : "Chưa phân quyền"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{formatDate(user.Ngaydangky)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(user)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(user.idUsers)}
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
                      colSpan={9}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {searchText ? "Không tìm thấy kết quả phù hợp" : "Không có người dùng nào"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Hiển thị {(meta.page - 1) * meta.limit_size + 1} -{" "}
          {Math.min(meta.page * meta.limit_size, meta.totalRecords)} trong{" "}
          {meta.totalRecords} người dùng
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

export default TableUserDashboard;