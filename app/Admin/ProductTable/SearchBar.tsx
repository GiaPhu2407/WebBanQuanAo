import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  categories: { idloaisanpham: number; tenloai: string; }[];
  onCategoryChange: (value: string) => void;
  minPrice: string;
  maxPrice: string;
  onPriceChange: (min: string, max: string) => void;
  gender: string;
  onGenderChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  categories,
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceChange,
  gender,
  onGenderChange
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả loại sản phẩm</option>
            {categories.map((category) => (
              <option key={category.idloaisanpham} value={category.idloaisanpham}>
                {category.tenloai}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Giá từ"
            value={minPrice}
            onChange={(e) => onPriceChange(e.target.value, maxPrice)}
            className="w-1/2 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            placeholder="Đến giá"
            value={maxPrice}
            onChange={(e) => onPriceChange(minPrice, e.target.value)}
            className="w-1/2 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Gender Filter */}
        <div>
          <select
            value={gender}
            onChange={(e) => onGenderChange(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả giới tính</option>
            <option value="true">Nam</option>
            <option value="false">Nữ</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;