import React, { useEffect } from "react";
import { FilterState } from "@/app/component/Type";

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
}

interface Category {
  idloaisanpham: number;
  tenloai: string;
}

interface tensanpham {
  mausac:string,
}

const Filter: React.FC<FilterProps> = ({ onFilterChange, onClose }) => {
  const [filters, setFilters] = React.useState<FilterState>({
    categories: [],
    gender: [],
    priceRange: [0, 10000000],
    sizes: [],
  });

  const [categories, setCategories] = React.useState<Category[]>([]);
  const availableSizes = ["S", "M", "L", "XL", "2XL"];

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

  const handleApplyFilters = () => {
    onFilterChange(filters);
    onClose?.();
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <div>
        <h3 className="text-lg font-semibold mb-2">Danh mục</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.idloaisanpham} className="flex items-center p-2 hover:bg-gray-50 rounded">
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
                className="mr-3 w-5 h-5"
              />
              <span className="text-sm">{category.tenloai}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Giới tính</h3>
        <div className="space-y-2">
          {["nam", "nu"].map((gender) => (
            <label key={gender} className="flex items-center p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={filters.gender.includes(gender)}
                onChange={(e) => {
                  const newGender = e.target.checked
                    ? [...filters.gender, gender]
                    : filters.gender.filter((g) => g !== gender);
                  handleChange("gender", newGender);
                }}
                className="mr-3 w-5 h-5"
              />
              <span className="text-sm">{gender === "nam" ? "Nam" : "Nữ"}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Giá</h3>
        <div className="space-y-4 px-2">
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
        <div className="grid grid-cols-3 gap-2">
          {availableSizes.map((size) => (
            <label
              key={size}
              className={`flex items-center justify-center p-2 border rounded cursor-pointer ${
                filters.sizes.includes(size)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={filters.sizes.includes(size)}
                onChange={(e) => {
                  const newSizes = e.target.checked
                    ? [...filters.sizes, size]
                    : filters.sizes.filter((s) => s !== size);
                  handleChange("sizes", newSizes);
                }}
                className="hidden"
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      {/* Mobile Apply Button */}
      {onClose && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <button
            onClick={handleApplyFilters}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default Filter;