"use client";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import Footer from "../Footer";

interface ChiTietDonHang {
  idchitietdonhang: number;
  SoLuong: number;
  DonGia: number;
  sanpham: {
    tensanpham: string;
    mota: string;
    gia: number;
    hinhanh: string;
    giamgia: number;
    gioitinh: boolean; // true for "Nam", false for "Nữ"
    size: string;
  };
}

interface LichGiaoHang {
  NgayGiao: string;
  TrangThai: string;
}

interface DonHang {
  iddonhang: number;
  trangthai: string;
  tongsotien: number;
  ngaydat: string;
  ChiTietDonHang: ChiTietDonHang[];
  LichGiaoXe: LichGiaoHang[];
}

const OrderPage = () => {
  const [donHangs, setDonHangs] = useState<DonHang[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonHangs();
  }, []);

  const fetchDonHangs = async () => {
    try {
      const response = await fetch("/api/donhang");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Kiểm tra dữ liệu trả về có phải là mảng không
      if (Array.isArray(data)) {
        setDonHangs(data);
      } else {
        setError("Dữ liệu không hợp lệ.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = await new Promise((resolve) => {
      toast.custom(
        (t) => (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col gap-2">
              <p className="font-medium">Bạn có chắc muốn hủy đơn hàng này?</p>
              <div className="flex gap-2">
                <button
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => {
                    toast.dismiss(t.id);
                    resolve(true);
                  }}
                >
                  Hủy đơn
                </button>
                <button
                  className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  onClick={() => {
                    toast.dismiss(t.id);
                    resolve(false);
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        ),
        {
          duration: Infinity,
        }
      );
    });

    if (confirmed) {
      try {
        const response = await fetch(`/api/donhang/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Update local state by filtering out the deleted order
        setDonHangs((prevDonHangs) =>
          prevDonHangs.filter((donHang) => donHang.iddonhang !== id)
        );

        toast.success("Đã hủy đơn hàng thành công");
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Không thể hủy đơn hàng");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "đang xử lý":
        return "bg-yellow-100 text-yellow-800";
      case "đã xác nhận":
        return "bg-blue-100 text-blue-800";
      case "đang giao":
        return "bg-purple-100 text-purple-800";
      case "đã giao":
        return "bg-green-100 text-green-800";
      case "đã hủy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="light"
      >
        <span className="loading loading-spinner text-blue-600 loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div data-theme="light">
      <Toaster position="top-center" />
      <div className="container mx-auto px-36 py-28 ml-9 ">
        <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

        {donHangs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Bạn chưa có đơn hàng nào
          </div>
        ) : (
          <div className="flex flex-wrap flex-shrink justify-stretch gap-12">
            {donHangs.map((donHang) => (
              <div
                key={donHang.iddonhang}
                className="bg-white rounded-2xl shadow-xl p-6 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-600">Mã đơn hàng: </span>
                    <span className="font-semibold">#{donHang.iddonhang}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      donHang.trangthai
                    )}`}
                  >
                    {donHang.trangthai}
                  </span>
                </div>

                {donHang.ChiTietDonHang && donHang.ChiTietDonHang.length > 0 ? (
                  donHang.ChiTietDonHang.map((chiTiet) => (
                    <div
                      key={chiTiet.idchitietdonhang}
                      className="flex items-center gap-4 border-t pt-4"
                    >
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={chiTiet.sanpham.hinhanh.split("|")[0]}
                          alt={chiTiet.sanpham.tensanpham}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {chiTiet.sanpham.tensanpham}
                        </h3>
                        <p className="text-gray-600 mb-1">
                          Giới tính: <span>{chiTiet.sanpham.gioitinh ? "Nam" : "Nữ"}</span>
                        </p>
                        <p className="text-gray-600">
                          Đơn giá:{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(chiTiet.DonGia)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Số lượng: {chiTiet.SoLuong}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500">Không có chi tiết đơn hàng</div>
                )}

                <div className="flex justify-between items-center border-t pt-4">
                  <div>
                    <span className="text-gray-600">Tổng tiền: </span>
                    <span className="font-bold text-lg">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(donHang.tongsotien)}
                    </span>
                  </div>
                  {donHang.trangthai === "Chờ xác nhận" && (
                    <button
                      onClick={() => handleDelete(donHang.iddonhang)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                    >
                      Hủy đơn
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderPage;
