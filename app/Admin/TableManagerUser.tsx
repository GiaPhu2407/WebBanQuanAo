import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";

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

interface Role {
  idrole: number;
  tenrole: string;
  mota: string;
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
  const [roles, setRoles] = useState<Role[]>([]);
  const [showPasswords, setShowPasswords] = useState<{
    [key: number]: boolean;
  }>({});
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit_size: 10,
    totalRecords: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = (userId: number) => {
    setShowPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/phantranguser?page=${meta.page}&limit_size=${meta.limit_size}`
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

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/roles");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setRoles(data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoles([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [meta.page, meta.limit_size, reloadKey]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const handlePageChange = (newPage: number) => {
    setMeta((prev) => ({ ...prev, page: newPage }));
  };

  const getRoleName = (idRole: number) => {
    const role = roles.find((role) => role.idrole === idRole);
    return role?.tenrole || "N/A";
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
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-2">
      <div className="w-full rounded-lg ">
        <table className="w-full overflow-x-auto  divide-gray-200 bg-gradient-to-r from-red-500 to-pink-400">
          <thead>
            <tr>
              <th className="px-3 py-2 text-white">ID</th>
              <th className="px-3 py-2 text-white">Tên tài khoản</th>
              {/* <th className="px-3 py-2 text-white">Mật khẩu</th> */}
              <th className="px-3 py-2 text-white">Họ tên</th>
              <th className="px-3 py-2 text-white">SĐT</th>
              <th className="px-3 py-2 text-white">Địa chỉ</th>
              <th className="px-3 py-2 text-white">Email</th>
              <th className="px-3 py-2 text-white">Vai trò</th>
              <th className="px-3 py-2 text-white">Ngày đăng ký</th>
              <th className="px-3 py-2 text-white">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={10} className="px-6 py-4 text-center">
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
                  <td className="px-3 py-2">{user.idUsers}</td>
                  <td className="px-3 py-2">{user.Tentaikhoan}</td>
                  {/* <td className="px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <span>
                        {showPasswords[user.idUsers]
                          ? user.Matkhau
                          : "••••••••"}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(user.idUsers)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords[user.idUsers] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {user.Matkhau}
                  </td> */}
                  <td className="px-3 py-2">{user.Hoten}</td>
                  <td className="px-3 py-2">{user.Sdt}</td>
                  <td className="px-3 py-2">{user.Diachi}</td>
                  <td className="px-3 py-2">{user.Email}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    {user.idRole === 1 ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Admin
                      </span>
                    ) : user.idRole === 2 ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        User
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        Chưa phân quyền
                      </span>
                    )}
                  </td>{" "}
                  <td className="px-6 py-4">{formatDate(user.Ngaydangky)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(user.idUsers)}
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
                <td
                  colSpan={10}
                  className="px-6 py-4 text-center text-gray-500"
                >
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

export default TableUserDashboard;
