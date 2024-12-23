import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface SanPham {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: string;
  mota: string;
  mausac:string,
  idloaisanpham: number;
  giamgia: number;
  gioitinh: boolean;
  size: string;
  loaisanpham?: {
    tenloai: string;
    mota: string;
  };
  images?: Array<{ url: string }>;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit_size: 10,
    totalRecords: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const fetchProducts = async (search?: string) => {
    setLoading(true);
    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const response = await fetch(
        `/api/phantrang?page=${meta.page}&limit_size=${meta.limit_size}${searchParam}`
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

  useEffect(() => {
    fetchProducts(searchTerm);
  }, [meta.page, meta.limit_size, reloadKey]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      setMeta(prev => ({ ...prev, page: 1 }));
      fetchProducts(value);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  const handlePageChange = (newPage: number) => {
    setMeta(prev => ({ ...prev, page: newPage }));
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
      {/* Search and filters */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 max-w-sm relative">
          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        
        <div className="text-sm text-gray-600">
          Tổng số: {meta.totalRecords} sản phẩm
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-red-500 to-pink-400">
            <tr>
              <th className="py-3 px-4 text-white text-left">ID</th>
              <th className="py-3 px-4 text-white text-left">Tên Sản Phẩm</th>
              <th className="py-3 px-4 text-white text-left">Loại SP</th>
              <th className="py-3 px-4 text-white text-right">Giá</th>
              <th className="py-3 px-4 text-white text-center">Giảm Giá</th>
              <th className="py-3 px-4 text-white text-center">Màu sắc</th>
              <th className="py-3 px-4 text-white text-center">Giới Tính</th>
              <th className="py-3 px-4 text-white text-center">Size</th>
              <th className="py-3 px-4 text-white text-center">Hình Ảnh</th>
              <th className="py-3 px-4 text-white text-center">Thao Tác</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={9} className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent" />
                    <span>Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((product, index) => (
                <tr
                  key={product.idsanpham}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td className="py-3 px-4">{product.idsanpham}</td>
                  <td className="py-3 px-4">{product.tensanpham}</td>
                  <td className="py-3 px-4">{product.loaisanpham?.tenloai}</td>
                  <td className="py-3 px-4 text-right">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(Number(product.gia))}
                  </td>
                  <td className="py-3 px-4 text-center">{product.giamgia}%</td>
                  <td className="py-3 px-4 text-center">{product.mausac}</td>
                  <td className="py-3 px-4 text-center">
                    {product.gioitinh ? "Nam" : "Nữ"}
                  </td>
                  <td className="py-3 px-4 text-center">{product.size}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <img
                        src={product.hinhanh || "/placeholder.png"}
                        alt={product.tensanpham}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(product)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(product.idsanpham)}
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
                <td colSpan={9} className="p-4 text-center text-gray-500">
                  {searchTerm
                    ? "Không tìm thấy sản phẩm nào"
                    : "Chưa có sản phẩm nào"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Hiển thị {(meta.page - 1) * meta.limit_size + 1} -{" "}
          {Math.min(meta.page * meta.limit_size, meta.totalRecords)} trong{" "}
          {meta.totalRecords} sản phẩm
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

export default TableDashboard;