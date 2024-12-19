import React, { useEffect } from "react";
import { FilterState } from "@/app/component/Type";

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
}

interface Category {
  idloaisanpham: number;
  tenloai: string;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState<FilterState>({
    categories: [],
    gender: [],
    priceRange: [0, 10000000],
    sizes: [],
  });

  const [categories, setCategories] = React.useState<Category[]>([]);
  const availableSizes = ["S", "M", "L", "XL", "2XL"];

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/loaisanpham");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <div>
        <h3 className="text-lg font-semibold mb-2">Danh mục</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.idloaisanpham} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.categories.includes(category.idloaisanpham)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...filters.categories, category.idloaisanpham]
                    : filters.categories.filter(
                        (id) => id !== category.idloaisanpham
                      );
                  handleChange("categories", newCategories);
                }}
                className="mr-2"
              />
              {category.tenloai}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Giới tính</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.gender.includes("nam")}
              onChange={(e) => {
                const newGender = e.target.checked
                  ? [...filters.gender, "nam"]
                  : filters.gender.filter((g) => g !== "nam");
                handleChange("gender", newGender);
              }}
              className="mr-2"
            />
            Nam
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.gender.includes("nu")}
              onChange={(e) => {
                const newGender = e.target.checked
                  ? [...filters.gender, "nu"]
                  : filters.gender.filter((g) => g !== "nu");
                handleChange("gender", newGender);
              }}
              className="mr-2"
            />
            Nữ
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Giá</h3>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="10000000"
            step="10000"
            value={filters.priceRange[1]}
            onChange={(e) =>
              handleChange("priceRange", [0, Number(e.target.value)])
            }
            className="w-full"
          />
          <div className="text-sm text-gray-600">
            {`0₫ - ${filters.priceRange[1].toLocaleString("vi-VN")}₫`}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Kích thước</h3>
        <div className="space-y-2">
          {availableSizes.map((size) => (
            <label key={size} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.sizes.includes(size)}
                onChange={(e) => {
                  const newSizes = e.target.checked
                    ? [...filters.sizes, size]
                    : filters.sizes.filter((s) => s !== size);
                  handleChange("sizes", newSizes);
                }}
                className="mr-2"
              />
              {size}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;
