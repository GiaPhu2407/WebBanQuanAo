"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Eye, Trash2, Edit, MapPin } from "lucide-react";

interface DonHang {
  iddonhang: number;
  tongsoluong: number;
  trangthai: string;
  tongsotien: number;
  ngaydat: string;
  idUsers: number;
  idDiaChi?: number | null;
  idDiscount?: number | null;
  discountValue?: number | null;
  chitietdonhang: {
    idchitietdonhang: number;
    iddonhang: number;
    idsanpham: number;
    tensanpham: string;
    dongia: number;
    soluong: number;
    sanpham: {
      idsanpham: number;
      tensanpham: string;
      gia: string;
      hinhanh: string;
      gioitinh: boolean;
    };
  }[];
  users?: {
    idUsers: number;
    Hoten: string;
    Email: string;
    Sdt: string;
    Diachi: string;
  };
  lichgiaohang?: {
    NgayGiao: string;
  }[];
  diaChiGiaoHang?: {
    idDiaChi: number;
    tenNguoiNhan: string;
    soDienThoai: string;
    diaChiChiTiet: string;
    phuongXa: string;
    quanHuyen: string;
    thanhPho: string;
  } | null;
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
    gia: string;
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
  addressesCache?: Record<number, any>;
}

const TableDonHang: React.FC<TableDonHangProps> = ({
  onView,
  onEdit,
  onDelete,
  reloadKey,
  userId,
  addressesCache = {},
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
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

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
        // Enhance orders with address data from cache if available
        const enhancedOrders = result.data.map((order: DonHang) => {
          if (
            order.idDiaChi &&
            !order.diaChiGiaoHang &&
            addressesCache[order.idDiaChi]
          ) {
            return {
              ...order,
              diaChiGiaoHang: addressesCache[order.idDiaChi],
            };
          }
          return order;
        });

        setDonHangs(enhancedOrders);
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

  // Lắng nghe sự kiện sidebar toggle để điều chỉnh kích thước bảng
  useEffect(() => {
    const handleSidebarToggle = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSidebarExpanded(customEvent.detail.expanded);
    };

    window.addEventListener("sidebarToggle", handleSidebarToggle);

    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarToggle);
    };
  }, []);

  useEffect(() => {
    fetchDonHangs();
  }, [meta.page, meta.limit_size, reloadKey, userId, addressesCache]);

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

  const getImageUrl = (sanpham: any) => {
    if (!sanpham) return "/no-image.jpg";

    if (sanpham.hinhanh) {
      if (sanpham.hinhanh.startsWith("http")) {
        return sanpham.hinhanh;
      }
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${sanpham.hinhanh}`;
    }

    return "/no-image.jpg";
  };

  // Tính toán lớp CSS cho vùng container chính dựa trên trạng thái sidebar
  const mainContainerClass = sidebarExpanded
    ? "ml-64 transition-all duration-300 pt-16"
    : "ml-16 transition-all duration-300 pt-16";

  // Get shipping address display text
  const getShippingAddressText = (order: DonHang) => {
    if (order.diaChiGiaoHang) {
      return `${order.diaChiGiaoHang.tenNguoiNhan}, ${order.diaChiGiaoHang.soDienThoai}`;
    }

    if (order.idDiaChi && addressesCache[order.idDiaChi]) {
      const address = addressesCache[order.idDiaChi];
      return `${address.tenNguoiNhan}, ${address.soDienThoai}`;
    }

    return order.idDiaChi ? "Có địa chỉ (click để xem)" : "Không có địa chỉ";
  };

  return (
    <div className={`${mainContainerClass} px-4`}>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner text-blue-600 loading-lg"></span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left">Mã ĐH</th>
                    <th className="px-4 py-3 text-left">Ngày đặt</th>
                    <th className="px-4 py-3 text-left">Khách hàng</th>
                    <th className="px-4 py-3 text-left">Địa chỉ giao hàng</th>
                    <th className="px-4 py-3 text-center">Tổng SL</th>
                    <th className="px-4 py-3 text-center">Hình ảnh</th>
                    <th className="px-4 py-3 text-right">Tổng tiền</th>
                    <th className="px-4 py-3 text-center">Trạng thái</th>
                    <th className="px-4 py-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {donHangs.length > 0 ? (
                    donHangs.map((donhang) => (
                      <tr
                        key={donhang.iddonhang}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">#{donhang.iddonhang}</td>
                        <td className="px-4 py-3">
                          {formatDate(donhang.ngaydat)}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">
                              {donhang.users?.Hoten || "Không có thông tin"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {donhang.users?.Email || "Không có email"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {donhang.users?.Sdt || "Không có SĐT"}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div
                            className={`flex items-center ${
                              donhang.idDiaChi
                                ? "text-blue-600"
                                : "text-gray-500 italic"
                            }`}
                          >
                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="text-sm truncate max-w-[150px]">
                              {getShippingAddressText(donhang)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {donhang.tongsoluong}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <img
                            src={
                              getImageUrl(donhang.chitietdonhang[0]?.sanpham) ||
                              "/placeholder.svg"
                            }
                            alt={
                              donhang.chitietdonhang[0]?.sanpham?.tensanpham ||
                              "Sản phẩm"
                            }
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/no-image.jpg";
                              target.onerror = null;
                            }}
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          {formatCurrency(donhang.tongsotien)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                donhang.trangthai
                              )} bg-opacity-20 ${
                                donhang.trangthai.toLowerCase() === "đã giao"
                                  ? "bg-green-100"
                                  : donhang.trangthai.toLowerCase() ===
                                    "đang xử lý"
                                  ? "bg-blue-100"
                                  : "bg-red-100"
                              }`}
                            >
                              {donhang.trangthai}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => onView(donhang)}
                              className="btn btn-sm btn-circle btn-ghost text-blue-600"
                              title="Xem chi tiết"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => onEdit(donhang)}
                              className="btn btn-sm btn-circle btn-ghost text-amber-600"
                              title="Cập nhật trạng thái"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => onDelete(donhang.iddonhang)}
                              className="btn btn-sm btn-circle btn-ghost text-red-600"
                              title="Xóa đơn hàng"
                            >
                              <Trash2 size={18} />
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
                        Không có đơn hàng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            {meta.totalPage > 1 && (
              <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
                <div>
                  <p className="text-sm text-gray-600">
                    Hiển thị {donHangs.length} / {meta.totalRecords} đơn hàng
                  </p>
                </div>
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
                  {Array.from(
                    { length: Math.min(5, meta.totalPage) },
                    (_, i) => {
                      // Logic để hiển thị trang hiện tại và các trang xung quanh
                      let pageToShow = meta.page - 2 + i;
                      if (meta.page < 3) {
                        pageToShow = i + 1;
                      } else if (meta.page > meta.totalPage - 2) {
                        pageToShow = meta.totalPage - 4 + i;
                      }

                      // Đảm bảo các trang hiển thị nằm trong phạm vi hợp lệ
                      if (pageToShow > 0 && pageToShow <= meta.totalPage) {
                        return (
                          <button
                            key={pageToShow}
                            className={`join-item btn btn-sm ${
                              meta.page === pageToShow ? "btn-active" : ""
                            }`}
                            onClick={() => handlePageChange(pageToShow)}
                          >
                            {pageToShow}
                          </button>
                        );
                      }
                      return null;
                    }
                  )}
                  <button
                    className="join-item btn btn-sm"
                    onClick={() => handlePageChange(meta.page + 1)}
                    disabled={meta.page === meta.totalPage}
                  >
                    ›
                  </button>
                  <button
                    className="join-item btn btn-sm"
                    onClick={() => handlePageChange(meta.totalPage)}
                    disabled={meta.page === meta.totalPage}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TableDonHang;
