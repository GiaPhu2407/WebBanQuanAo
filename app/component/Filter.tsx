import { useState } from "react";

interface Filters {
  gender: string[];
  color: string;
  size: string[];
  priceRange: string;
}

interface FilterProps {
  onFilterChange: (filters: Filters) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<Filters>({
    gender: [],
    color: "",
    size: [],
    priceRange: "",
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;

    setFilters((prev) => {
      const updatedArray = checked
        ? [...(prev[name as keyof Filters] as string[]), value]
        : (prev[name as keyof Filters] as string[]).filter(
            (item: string) => item !== value
          );

      const updatedFilters = { ...prev, [name]: updatedArray };
      onFilterChange(updatedFilters);
      return updatedFilters;
    });
  };

  const handleRadioChange = (name: string, value: string) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev, [name]: value };
      onFilterChange(updatedFilters);
      return updatedFilters;
    });
  };

  return (
    
    <div className="w-1/4 p-4 mt-20 border rounded">
      <h2 className="text-xl font-semibold mb-4">Bộ lọc</h2>

      {/* Giới tính */}
      <div className="mb-4">
        <label className="block mb-1">Giới tính</label>
        <div className="flex flex-col">
          <label>
            <input
              type="checkbox"
              name="gender"
              value="male"
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Nam
          </label>
          <label>
            <input
              type="checkbox"
              name="gender"
              value="female"
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Nữ
          </label>
        </div>
      </div>

      {/* Màu sắc */}
      <div className="mb-4">
        <label className="block mb-1">Màu sắc</label>
        <div className="flex flex-wrap gap-2">
          {[
            { color: "black", label: "Đen" },
            { color: "red", label: "Đỏ" },
            { color: "yellow", label: "Vàng" },
            { color: "orange", label: "Cam" },
            { color: "gray", label: "Xám" },
            { color: "pink", label: "Hồng" },
            { color: "purple", label: "Tím" },
            { color: "brown", label: "Nâu" },
            { color: "white", label: "Trắng" },
            { color: "other", label: "Khác", isSpecial: true },
          ].map(({ color, label, isSpecial }) => (
            <div
              key={color}
              onClick={() => handleRadioChange("color", color)}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name="color"
                value={color}
                checked={filters.color === color}
                onChange={(e) => handleRadioChange(e.target.name, e.target.value)}
                className="mr-2 hidden" // Hidden but needed for accessibility
              />
              <span
                className={`w-6 h-6 rounded-full border-2 ${
                  filters.color === color ? "border-blue-500" : "border-gray-300"
                } ${
                  isSpecial
                    ? "bg-gradient-to-r from-green-400 to-orange-500"
                    : `bg-${color}-500`
                }`}
              />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Kích thước */}
      <div className="mb-4">
        <label className="block mb-1">Kích thước</label>
        <div className="flex flex-wrap gap-2">
          {["S", "M", "L", "XL"].map((size) => (
            <label key={size}>
              <input
                type="checkbox"
                name="size"
                value={size}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      {/* Giá */}
      <div className="mb-4">
        <label className="block mb-1">Theo giá</label>
        <div className="flex flex-col">
          {["0-250000", "250000-500000", "500000-1000000"].map((range) => (
            <label key={range}>
              <input
                type="radio"
                name="priceRange"
                value={range}
                onChange={(e) => handleRadioChange(e.target.name, e.target.value)}
                className="mr-2"
              />
              {range}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;
