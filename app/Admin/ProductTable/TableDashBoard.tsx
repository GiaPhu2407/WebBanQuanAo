import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import ProductRow from "./ProductRow";
import { Loader2 } from "lucide-react";

interface SanPham {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: string;
  mota: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: boolean;
  size: string;
}

interface LoaiSanPham {
  idloaisanpham: number;
  tenloai: string;
  mota: string;
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
  const [loading, setLoading] = useState(false);
  
  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [gender, setGender] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [limitSize, setLimitSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams({
        page: currentPage.toString(),
        limit_size: limitSize.toString(),
      });

      if (searchTerm) searchParams.append("search", searchTerm);
      if (selectedCategory) searchParams.append("idloaisanpham", selectedCategory);
      if (minPrice) searchParams.append("minPrice", minPrice);
      if (maxPrice) searchParams.append("maxPrice", maxPrice);
      if (gender) searchParams.append("gioitinh", gender);

      const response = await fetch(`/api/phantrang?${searchParams.toString()}`);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const result = await response.json();
      setProducts(result.data);
      setTotalRecords(result.meta.totalRecords);
      setTotalPages(result.meta.totalPage);
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
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, limitSize, searchTerm, selectedCategory, minPrice, maxPrice, gender, reloadKey]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handlePriceChange = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
  };

  const handleGenderChange = (value: string) => {
    setGender(value);
    setCurrentPage(1);
  };

  const getLoaiSanPhamName = (idloaisanpham: number) => {
    return categories.find((cat) => cat.idloaisanpham === idloaisanpham)?.tenloai || "N/A";
  };

  return (
    <div className="space-y-4">
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        selectedCategory={selectedCategory}
        categories={categories}
        onCategoryChange={handleCategoryChange}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceChange={handlePriceChange}
        gender={gender}
        onGenderChange={handleGenderChange}
      />

      <div className="w-full rounded-lg shadow">
        <table className="w-full divide-gray-200 bg-gradient-to-r from-red-500 to-pink-400">
          <thead>
            <tr>
              <th className="px-19 py-3 text-white">ID</th>
              <th className="px-10 py-3 text-white">Tên Sản Phẩm</th>
              <th className="px-10 py-3 text-white">Loại SP</th>
              <th className="px-10 py-3 text-white">Giá</th>
              <th className="px-10 py-3 text-white">Giảm Giá</th>
              <th className="px-10 py-3 text-white">Giới Tính</th>
              <th className="px-10 py-3 text-white">Size</th>
              <th className="px-10 py-3 text-white">Hình Ảnh</th>
              <th className="px-10 py-3 text-white">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-2">Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductRow
                  key={product.idsanpham}
                  product={product}
                  categoryName={getLoaiSanPhamName(product.idloaisanpham)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                  Không có sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalRecords > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          limitSize={limitSize}
          totalRecords={totalRecords}
          onPageChange={setCurrentPage}
          onLimitChange={setLimitSize}
        />
      )}
    </div>
  );
};

export default TableDashboard;