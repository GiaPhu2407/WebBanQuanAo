// components/Filter.tsx
import React, { useState, useEffect } from "react";

// Types
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
        const categoryResponse = await fetch("/api/loaisanpham");
        if (!categoryResponse.ok) throw new Error("Failed to fetch categories");
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);

        const productResponse = await fetch("/api/sanpham");
        if (!productResponse.ok) throw new Error("Failed to fetch products");
        const products = await productResponse.json();

        const allSizes = products
          .map((product: { size: string }) =>
            product.size.split(",").map((s: string) => s.trim())
          )
          .flat();
        const uniqueSizes = Array.from(new Set(allSizes)).filter(
          (size) => size !== ""
        );

        setSizes(uniqueSizes as string[]); //+
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //   if (loading) return <div>Loading...</div>;

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

export default Filter;
