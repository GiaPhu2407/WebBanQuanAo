import React, { useEffect, useState } from "react";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface SanPham {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: string;
  mota: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: string;
  size: string;
  LoaiSanPham?: {
    tenloai: string;
    mota: string;
  };
}

interface LoaiSanPham {
  idloaisanpham: number;
  tenloai: string;
  mota: string;
}

interface Meta {
  page: number;
  limit_size: number;
  totalRecords: number;
  totalPages: number;
}

interface TableDashboardProps {
  onEdit: (product: SanPham) => void;
  onDelete: (id: number) => void;
  reloadKey: number;
}

const TableDashboard: React.FC<TableDashboardProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [products, setProducts] = useState<SanPham[]>([]);
  const [categories, setCategories] = useState<LoaiSanPham[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit_size: 10,
    totalRecords: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/phantrang?page=${meta.page}&limit_size=${meta.limit_size}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      if (result.data) {
        setProducts(result.data);
        setMeta({
          page: result.meta.page,
          limit_size: result.meta.limit_size,
          totalRecords: result.meta.totalRecords,
          totalPages: result.meta.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/loaisanpham");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [meta.page, meta.limit_size, reloadKey]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handlePageChange = (newPage: number) => {
    setMeta((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setMeta((prev) => ({ ...prev, page: 1, limit_size: newLimit }));
  };

  const getLoaiSanPhamName = (idloaisanpham: number) => {
    const category = categories.find(
      (cat) => cat.idloaisanpham === idloaisanpham
    );
    return category?.tenloai || "N/A";
  };

  return (
    <div className="space-y-4">
      <div className=" max-w-full ">
        <table className="w-[1000px] border-collapse border border-gray-200">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="px-4 py-2 text-center">ID</th>
              <th className="px-4 py-2 text-center">Tên Sản Phẩm</th>
              <th className="px-4 py-2 text-center">Loại SP</th>
              <th className="px-4 py-2 text-center">Giá</th>
              <th className="px-4 py-2 text-center">Giảm Giá</th>
              <th className="px-4 py-2 text-center">Giới Tính</th>
              <th className="px-4 py-2 text-center">Size</th>
              <th className="px-4 py-2 text-center">Hình Ảnh</th>
              <th className="px-4 py-2 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : products && products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.idsanpham}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-center">{product.idsanpham}</td>
                  <td className="px-4 py-2">{product.tensanpham}</td>
                  <td className="px-4 py-2 text-center">
                    {getLoaiSanPhamName(product.idloaisanpham)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(Number(product.gia))}
                  </td>
                  <td className="px-4 py-2 text-center">{product.giamgia}%</td>
                  <td className="px-4 py-2 text-center">
                    {product.gioitinh === "nam" ? "Nam" : "Nữ"}
                  </td>
                  <td className="px-4 py-2 text-center">{product.size}</td>
                  <td className="px-4 py-2 text-center">
                    <img
                      src={product.hinhanh || "/default-image.png"}
                      alt={product.tensanpham}
                      className="w-12 h-12 object-cover mx-auto"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil />
                      </button>
                      <button
                        onClick={() => onDelete(product.idsanpham)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  Không có sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center py-2">
        <button
          onClick={() => handlePageChange(meta.page - 1)}
          disabled={meta.page === 1}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          <ChevronLeft />
          <span className="ml-1">Trang trước</span>
        </button>
        <span className="text-gray-700">
          Trang {meta.page} / {meta.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          <span className="mr-1">Trang sau</span>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TableDashboard;
