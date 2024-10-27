"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import hinh from "@/app/image/hinh.png";

// Types
interface Product {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: number;
  mota: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: boolean;
  size: string;
  loaisanpham: {
    tenloai: string;
    mota: string;
  };
}

interface FilterState {
  categories: number[];
  gender: string[];
  priceRange: [number, number];
  sizes: string[];
}

interface CategoryType {
  id: number;
  tenloai: string;
}

// Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Product Card Component
const ProductCard = ({ product }: { product: Product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const sizes = product.size
    ? product.size.split(",").map((s) => s.trim())
    : [];
  const discountedPrice =
    product.giamgia > 0
      ? product.gia * (1 - product.giamgia / 100)
      : product.gia;

  return (
    <div
      className="w-full bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        <img
          src={product.hinhanh || hinh.src}
          alt={product.tensanpham}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? "scale-105" : ""
          }`}
        />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
        {product.giamgia > 0 && (
          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
            -{product.giamgia}%
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-medium text-lg line-clamp-1">
          {product.tensanpham}
        </h3>

        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs border border-gray-300 rounded-full">
            {product.gioitinh ? "Nam" : "Nữ"}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{product.mota}</p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(discountedPrice)}
          </span>
          {product.giamgia > 0 && (
            <span className="text-sm text-gray-500 line-through">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.gia)}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <span
              key={size}
              className="px-2 py-1 text-xs border border-gray-300 rounded-full"
            >
              {size}
            </span>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <button className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Mua ngay
          </button>
          <Link
            href={`/component/Category?id=${product.idsanpham}`}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

// Filter Component
interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    gender: [],
    priceRange: [0, 10000000],
    sizes: [],
  });

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/loaisanpham");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchSizes = async () => {
      try {
        const response = await fetch("/api/sizes");
        if (!response.ok) throw new Error("Failed to fetch sizes");
        const data = await response.json();
        setSizes(data);
      } catch (error) {
        console.error("Error fetching sizes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchSizes();
  }, []);

  const handleCategoryChange = (categoryId: number) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((id) => id !== categoryId)
      : [...filters.categories, categoryId];

    const newFilters = {
      ...filters,
      categories: newCategories,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSizeChange = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];

    const newFilters = {
      ...filters,
      sizes: newSizes,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleGenderChange = (gender: string) => {
    const newGender = filters.gender.includes(gender)
      ? filters.gender.filter((g) => g !== gender)
      : [...filters.gender, gender];

    const newFilters = {
      ...filters,
      gender: newGender,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const initialFilters: FilterState = {
      categories: [],
      gender: [],
      priceRange: [0, 10000000],
      sizes: [],
    };
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoryResponse = await fetch("/api/loaisanpham");
        if (!categoryResponse.ok) throw new Error("Failed to fetch categories");
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);

        // Fetch products to extract sizes
        const productResponse = await fetch("/api/sanpham");
        if (!productResponse.ok) throw new Error("Failed to fetch products");
        const products = await productResponse.json();

        // Extract unique sizes from products
        const allSizes = products
          .map((product: Product) =>
            product.size.split(",").map((s: string) => s.trim())
          )
          .flat();
        const uniqueSizes = Array.from(new Set(allSizes)).filter(
          (size) => size !== ""
        );
        setSizes(uniqueSizes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (loading) return <LoadingSpinner />;

  return (
    <div className="w-64 p-4 space-y-6 bg-white shadow-sm rounded-lg h-fit">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">Bộ lọc</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Đặt lại
        </button>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-medium mb-3">Danh mục</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{category.tenloai}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <h3 className="font-medium mb-3">Giới tính</h3>
        <div className="space-y-2">
          {[
            { id: "nam", label: "Nam" },
            { id: "nu", label: "Nữ" },
          ].map((gender) => (
            <label
              key={gender.id}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.gender.includes(gender.id)}
                onChange={() => handleGenderChange(gender.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{gender.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-3">Khoảng giá</h3>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="10000000"
            step="100000"
            value={filters.priceRange[1]}
            onChange={(e) => {
              const newFilters: FilterState = {
                ...filters,
                priceRange: [0, parseInt(e.target.value)],
              };
              setFilters(newFilters);
              onFilterChange(newFilters);
            }}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>0đ</span>
            <span>
              {new Intl.NumberFormat("vi-VN").format(filters.priceRange[1])}đ
            </span>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-medium mb-3">Kích thước</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              className={`px-3 py-1 text-sm border rounded-full transition-colors ${
                filters.sizes.includes(size)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 hover:border-blue-600"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Component
const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/sanpham");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...products];

    // Apply filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.idloaisanpham)
      );
    }

    if (filters.gender.length > 0) {
      filtered = filtered.filter((product) =>
        filters.gender.includes(product.gioitinh ? "nam" : "nu")
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.gia >= filters.priceRange[0] &&
        product.gia <= filters.priceRange[1]
    );

    if (filters.sizes.length > 0) {
      filtered = filtered.filter((product) => {
        const productSizes = product.size.split(",").map((s) => s.trim());
        return filters.sizes.some((size) => productSizes.includes(size));
      });
    }

    setFilteredProducts(filtered);
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <Filter onFilterChange={handleFilterChange} />
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.idsanpham} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  Không tìm thấy sản phẩm phù hợp
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
