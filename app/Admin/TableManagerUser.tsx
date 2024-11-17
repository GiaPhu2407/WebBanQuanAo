import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  MatKhau?: string;
  Email: string;
  Hoten: string;
  Sdt: string;
  Diachi: string;
  idRole: number;
  Ngaydangky: string;
}

interface PaginationMeta {
  page: number;
  limit_size: number;
  totalRecords: number;
  totalPages: number;
}

interface TableDashboardProps {
  onEdit: (product: User) => void;
  onDelete: (id: number) => void;
  reloadKey?: number;
}

interface Toast {
  message: string;
  type: "error" | "success";
}

const Toast: React.FC<{ toast: Toast | null; onClose: () => void }> = ({
  toast,
  onClose,
}) => {
  if (!toast) return null;

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transform transition-transform duration-300 z-50 ${
        toast.type === "error" ? "bg-red-500" : "bg-green-500"
      } text-white`}
    >
      <div className="flex items-center">
        <span className="mr-2">{toast.type === "error" ? "❌" : "✅"}</span>
        <p className="font-medium">{toast.message}</p>
        <button onClick={onClose} className="ml-4 hover:text-gray-200">
          ✕
        </button>
      </div>
    </div>
  );
};

const TableDashboard: React.FC<TableDashboardProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit_size: 10,
    totalRecords: 0,
    totalPages: 1,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: "error" | "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

    if (!formData.Tentaikhoan?.trim()) return "Vui lòng nhập tên tài khoản";
    if (!selectedUser && !formData.MatKhau?.trim())
      return "Vui lòng nhập mật khẩu";
    if (!formData.Email?.trim() || !emailRegex.test(formData.Email))
      return "Email không hợp lệ";
    if (!formData.Hoten?.trim()) return "Vui lòng nhập họ tên";
    if (!formData.Sdt?.trim() || !phoneRegex.test(formData.Sdt))
      return "Số điện thoại không hợp lệ";
    if (!formData.Diachi?.trim()) return "Vui lòng nhập địa chỉ";
    return null;
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/phantranguser?page=${meta.page}&limit_size=${meta.limit_size}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.data);
      setMeta(data.meta);
    } catch (error) {
      showToast("Không thể tải danh sách người dùng", "error");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [meta.page, reloadKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      showToast(error, "error");
      return;
    }

    try {
      const url = selectedUser
        ? `/api/user/${selectedUser.idUsers}`
        : "/api/user";

      const method = selectedUser ? "PUT" : "POST";

      const submitData = {
        ...formData,
        // Chỉ gửi mật khẩu nếu là tạo mới hoặc có nhập mật khẩu khi sửa
        ...((!selectedUser || formData.MatKhau) && {
          MatKhau: formData.MatKhau,
        }),
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error("Operation failed");
      }

      showToast(
        selectedUser ? "Cập nhật thành công" : "Thêm người dùng thành công",
        "success"
      );
      setIsDialogOpen(false);
      setSelectedUser(null);
      setFormData({});
      fetchUsers();

      // Call callbacks if provided
      if (selectedUser && onEdit) {
        onEdit(selectedUser);
      }
    } catch (error) {
      showToast("Thao tác không thành công", "error");
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      const response = await fetch(`/api/user/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete operation failed");
      }

      showToast("Xóa người dùng thành công", "success");
      fetchUsers();

      // Call callback if provided
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      showToast("Không thể xóa người dùng", "error");
      console.error("Error deleting user:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setMeta((prev) => ({ ...prev, page: newPage }));
    }
  };

  const getPaginationRange = () => {
    const range = [];
    const start = Math.max(1, Math.min(meta.page - 2, meta.totalPages - 4));
    const end = Math.min(start + 4, meta.totalPages);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="w-full space-y-4">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
        <Button
          onClick={() => {
            setSelectedUser(null);
            setFormData({});
            setIsDialogOpen(true);
          }}
        >
          Thêm người dùng
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-500 to-purple-500">
              <TableHead className="text-white">ID</TableHead>
              <TableHead className="text-white">Tên tài khoản</TableHead>
              <TableHead className="text-white">Họ tên</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Số điện thoại</TableHead>
              <TableHead className="text-white">Địa chỉ</TableHead>
              <TableHead className="text-white">Vai trò</TableHead>
              <TableHead className="text-white">Ngày đăng ký</TableHead>
              <TableHead className="text-white">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Đang tải...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  Không có người dùng nào
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.idUsers}>
                  <TableCell>{user.idUsers}</TableCell>
                  <TableCell>{user.Tentaikhoan}</TableCell>
                  <TableCell>{user.Hoten}</TableCell>
                  <TableCell>{user.Email}</TableCell>
                  <TableCell>{user.Sdt}</TableCell>
                  <TableCell>{user.Diachi}</TableCell>
                  <TableCell>{user.idRole === 1 ? "Admin" : "User"}</TableCell>
                  <TableCell>
                    {user.Ngaydangky
                      ? new Date(user.Ngaydangky).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedUser(user);
                          setFormData({ ...user, MatKhau: undefined });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user.idUsers)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => handlePageChange(1)}
          disabled={meta.page === 1}
        >
          «
        </Button>
        <Button
          variant="outline"
          onClick={() => handlePageChange(meta.page - 1)}
          disabled={meta.page === 1}
        >
          ‹
        </Button>
        {getPaginationRange().map((pageNum) => (
          <Button
            key={pageNum}
            variant={pageNum === meta.page ? "default" : "outline"}
            onClick={() => handlePageChange(pageNum)}
          >
            {pageNum}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => handlePageChange(meta.page + 1)}
          disabled={meta.page === meta.totalPages}
        >
          ›
        </Button>
        <Button
          variant="outline"
          onClick={() => handlePageChange(meta.totalPages)}
          disabled={meta.page === meta.totalPages}
        >
          »
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? "Sửa người dùng" : "Thêm người dùng mới"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full gap-4">
              <Input
                placeholder="Tên tài khoản"
                value={formData.Tentaikhoan || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    Tentaikhoan: e.target.value,
                  }))
                }
              />

              {(!selectedUser || selectedUser) && (
                <Input
                  type="password"
                  placeholder={
                    selectedUser
                      ? "Mật khẩu mới (để trống nếu không đổi)"
                      : "Mật khẩu"
                  }
                  value={formData.MatKhau || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      MatKhau: e.target.value,
                    }))
                  }
                />
              )}

              <Input
                placeholder="Email"
                type="email"
                value={formData.Email || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, Email: e.target.value }))
                }
              />

              <Input
                placeholder="Họ tên"
                value={formData.Hoten || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, Hoten: e.target.value }))
                }
              />

              <Input
                placeholder="Số điện thoại"
                value={formData.Sdt || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, Sdt: e.target.value }))
                }
              />

              <Input
                placeholder="Địa chỉ"
                value={formData.Diachi || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, Diachi: e.target.value }))
                }
              />

              <Select
                value={String(formData.idRole || 2)}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, idRole: Number(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Admin</SelectItem>
                  <SelectItem value="2">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setFormData({});
                  setSelectedUser(null);
                }}
              >
                Hủy
              </Button>
              <Button type="submit">
                {selectedUser ? "Cập nhật" : "Thêm"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TableDashboard;
