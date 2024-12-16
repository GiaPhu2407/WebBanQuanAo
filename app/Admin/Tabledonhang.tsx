import React, { useEffect, useState } from "react";
import { Eye, Trash2, Edit } from "lucide-react";

interface DonHang {
  iddonhang: number;
  tongsoluong: number;
  trangthai: string;
  tongsotien: number;
  ngaydat: string;
  idUsers: number;
  users?: {
    Hoten: string;
    Email: string;
    Sdt: string;
  };
  lichgiaohang?: {
    NgayGiao: string;
  }[];
}
interface ChitietDonhang {
  iddonhang: number;
  idsanpham: number;
  idchitietdonhang: number;
  soluong: number;
  gia: number;
  sanpham?: {
    tensanpham: string;
    hinhanh: string;
    Gia: number;
  };
}
interface Meta {
  page: number;
  limit_size: number;
  totalRecords: number;
  totalPage: number;
}

interface TableDonHangProps {
  onView: (donhang: DonHang) => void;
  onEdit: (donhang: DonHang) => void;
  onDelete: (id: number) => void;
  reloadKey: number;
  userId?: number;
}

const TableDonHang: React.FC<TableDonHangProps> = ({
  onView,
  onEdit,
  onDelete,
  reloadKey,
  userId,
}) => {
  const [donHangs, setDonHangs] = useState<DonHang[]>([]);
  const [chiTietDonHang, setChiTietDonHang] = useState<ChitietDonhang[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit_size: 10,
    totalRecords: 0,
    totalPage: 1,
  });
  const [loading, setLoading] = useState(false);

  const fetchDonHangs = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/phantrangdonhang", window.location.origin);
      url.searchParams.append("page", meta.page.toString());
      url.searchParams.append("limit_size", meta.limit_size.toString());
      if (userId) {
        url.searchParams.append("userId", userId.toString());
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error("Không thể tải danh sách đơn hàng");
      }
      const result = await response.json();
      if (result.data) {
        setDonHangs(result.data);
        setMeta({
          page: result.meta.page,
          limit_size: result.meta.limit_size,
          totalRecords: result.meta.totalRecords,
          totalPage: result.meta.totalPage,
        });
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
      setDonHangs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchChiTietDonHang = async (idDonHang: number) => {
    try {
      const response = await fetch(`/api/chitietdonhang/${idDonHang}`);
      if (!response.ok) {
        throw new Error("Không thể tải chi tiết đơn hàng");
      }
      const result = await response.json();
      setChiTietDonHang(result.data);
    } catch (error) {
      console.error("Lỗi:", error);
      setChiTietDonHang([]);
    }
  };

  useEffect(() => {
    fetchDonHangs();
  }, [meta.page, meta.limit_size, reloadKey, userId]);

  const handlePageChange = (newPage: number) => {
    setMeta((prev) => ({ ...prev, page: newPage }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "đã giao":
        return "text-green-600";
      case "đang xử lý":
        return "text-blue-600";
      case "đã hủy":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-4">
      <div className="w-full rounded-lg shadow">
        <table className="w-full divide-gray-200 bg-gradient-to-r from-blue-500 to-purple-400">
          <thead>
            <tr>
              <th className="px-4 py-3 text-white">Mã ĐH</th>
              <th className="px-4 py-3 text-white">Tổng SL</th>
              <th className="px-4 py-3 text-white">Hình ảnh</th>
              <th className="px-4 py-3 text-white">Tổng Tiền</th>
              <th className="px-4 py-3 text-white">Ngày Đặt</th>
              <th className="px-4 py-3 text-white">Trạng Thái</th>
              <th className="px-4 py-3 text-white">Khách Hàng</th>
              <th className="px-4 py-3 text-white">Ngày Giao</th>
              <th className="px-4 py-3 text-white">Thao Tác</th>
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
            ) : donHangs.length > 0 ? (
              donHangs.map((donhang) => (
                <tr
                  key={donhang.iddonhang}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-4 py-4 text-center">{donhang.iddonhang}</td>
                  <td className="px-4 py-4 text-center">
                    {donhang.tongsoluong || 0}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <img
                      src={
                        chiTietDonHang.find(
                          (item) => item.iddonhang === donhang.iddonhang
                        )?.sanpham?.hinhanh || "/no-image.jpg"
                      }
                      alt="Hình sản phẩm"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-4 py-4 text-right">
                    {formatCurrency(donhang.tongsotien || 0)}
                  </td>
                  <td className="px-4 py-4">{formatDate(donhang.ngaydat)}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`font-semibold ${getStatusColor(
                        donhang.trangthai || ""
                      )}`}
                    >
                      {donhang.trangthai || "Chưa xác định"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {donhang.users?.Hoten || "Không xác định"}
                  </td>
                  <td className="px-4 py-4">
                    {donhang.lichgiaohang?.[0]?.NgayGiao
                      ? formatDate(donhang.lichgiaohang[0].NgayGiao)
                      : "Chưa giao"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onView(donhang)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onEdit(donhang)}
                        className="p-1 text-green-600 hover:text-green-800"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(donhang.iddonhang)}
                        className="p-1 text-red-600 hover:text-red-800"
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
                  Không có đơn hàng nào
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

          {[1, 2, 3].map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`min-w-[40px] h-[40px] flex items-center justify-center rounded-lg border text-sm
                  ${
                    number === meta.page
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white hover:bg-gray-50"
                  }`}
            >
              {number}
            </button>
          ))}

          {meta.totalPage > 3 && <span className="px-2">...</span>}

          {meta.totalPage > 3 && (
            <button
              onClick={() => handlePageChange(meta.totalPage)}
              className={`min-w-[40px] h-[40px] flex items-center justify-center rounded-lg border text-sm bg-white hover:bg-gray-50`}
            >
              {meta.totalPage}
            </button>
          )}

          <button
            onClick={() => handlePageChange(meta.page + 1)}
            disabled={meta.page >= meta.totalPage}
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

export default TableDonHang;
