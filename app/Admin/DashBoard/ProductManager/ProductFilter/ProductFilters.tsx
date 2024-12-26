import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Định nghĩa interface cho category
interface Category {
  idloaisanpham: number;
  tenloai: string;
}

// Định nghĩa interface cho props
interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categories: Category[];
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  genderFilter: string;
  onGenderChange: (value: string) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  categories,
  categoryFilter,
  onCategoryChange,
  genderFilter,
  onGenderChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Search Input */}
      <div className="flex-1 relative min-w-[200px]">
        <Input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>

      {/* Category Filter */}
      <div className="min-w-[200px]">
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Loại sản phẩm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {categories.map((category) => (
              <SelectItem
                key={category.idloaisanpham}
                value={category.idloaisanpham.toString()}
              >
                {category.tenloai}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Gender Filter */}
      <div className="min-w-[200px]">
        <Select value={genderFilter} onValueChange={onGenderChange}>
          <SelectTrigger>
            <SelectValue placeholder="Giới tính" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="true">Nam</SelectItem>
            <SelectItem value="false">Nữ</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductFilters;