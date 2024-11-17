import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

interface User {
  idUsers: number;
  Tentaikhoan?: string;
  MatKhau?: string;
  Email?: string;
  Hoten?: string;
  Sdt?: string;
  DiaChi?: string;
  idRole?: number;
  Ngaydangky?: string;
  role?: {
    Tennguoidung?: string;
  };
}

interface Meta {
  page: number;
  limit_size: number;
  totalRecords: number;
  totalPages: number;
}

interface TableUserProps {
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  reloadKey: number;
}

const TableUser: React.FC<TableUserProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [users, setUsers] = useState<User[]>([]);
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
        `/api/users/phantrang?page=${meta.page}&limit_size=${meta.limit_size}`
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getRoleName = (roleId: number | undefined) => {
    switch (roleId) {
      case 1:
        return "Admin";
      case 2:
        return "User";
      default:
        return "N/A";
    }
  };

  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto rounded-lg shadow">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-red-500 to-pink-400">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Tên tài khoản
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Họ tên
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
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Ngày đăng ký
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Thao tác
              </th>
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
                  } hover:bg-blue-50 transition-colors duration-200`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.idUsers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.Tentaikhoan || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.Hoten || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.Sdt || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.DiaChi || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.Email || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getRoleName(user.idRole)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(user.Ngaydangky || "")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(user.idUsers)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
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
                <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                  Không có người dùng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-1 mt-4">
        <button
          onClick={() => handlePageChange(1)}
          disabled={meta.page === 1}
          className="px-3 py-1 rounded-md bg-white border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Trang đầu"
        >
          «
        </button>
        <button
          onClick={() => handlePageChange(meta.page - 1)}
          disabled={meta.page === 1}
          className="px-3 py-1 rounded-md bg-white border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Trang trước"
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
                : typeof number === "number"
                ? "bg-white hover:bg-gray-100"
                : "bg-gray-100"
            } ${number === "..." ? "cursor-default" : ""}`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
          className="px-3 py-1 rounded-md bg-white border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Trang sau"
        >
          ›
        </button>
        <button
          onClick={() => handlePageChange(meta.totalPages)}
          disabled={meta.page >= meta.totalPages}
          className="px-3 py-1 rounded-md bg-white border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Trang cuối"
        >
          »
        </button>
      </div>
    </div>
  );
};

export default TableUser;
