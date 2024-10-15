"use client";
import { SetStateAction, useState } from "react";

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

  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleCheckboxChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Nếu đã chọn cùng giá trị thì bỏ chọn, nếu không thì chọn giá trị mới
    setSelectedGender(selectedGender === value ? null : value);

    // Cập nhật vào filters để gửi lên onFilterChange
    const updatedFilters = { ...filters, gender: [value] };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleRadioChange = (name: string, value: string) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev, [name]: value };
      onFilterChange(updatedFilters);
      return updatedFilters;
    });
  };

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

  return (
    <div className="w-1/4 p-4 border rounded mt-4">
      <h2 className="text-xl font-semibold mb-4">Bộ lọc</h2>

      {/* Giới tính */}
      <div className="mb-6 space-y-2">
        <label className="block mb-1 font-medium">Giới tính</label>
        <div className="flex flex-col space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="gender"
              value="male"
              checked={selectedGender === "male"}
              onChange={handleCheckboxChange1}
              className="mr-2"
              id="1"
            />
            Nam
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="gender"
              value="female"
              checked={selectedGender === "female"}
              onChange={handleCheckboxChange1}
              className="mr-2"
              id="2"
            />
            Nữ
          </label>
        </div>
      </div>

      {/* Màu sắc */}
      <div className="mb-6 space-y-2">
        <label className="block mb-1 font-medium">Màu sắc</label>
        <div className="grid grid-cols-3 gap-3">
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
                onChange={(e) =>
                  handleRadioChange(e.target.name, e.target.value)
                }
                className="mr-2 hidden" // Hidden but needed for accessibility
              />
              <span
                className={`w-6 h-6 rounded-full border-2 ${
                  filters.color === color
                    ? "border-blue-500"
                    : "border-gray-300"
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
      <div className="mb-6 space-y-2">
        <label className="block mb-1 font-medium">Kích thước</label>
        <div className="flex flex-wrap gap-3">
          {["S", "M", "L", "XL"].map((size) => (
            <label key={size} className="flex items-center">
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
      <div className="space-y-2">
        <label className="block mb-1 font-medium">Theo giá</label>
        <div className="flex flex-col space-y-2">
          {["0-250000", "250000-500000", "500000-1000000"].map((range) => (
            <label key={range} className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                value={range}
                onChange={(e) =>
                  handleRadioChange(e.target.name, e.target.value)
                }
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
