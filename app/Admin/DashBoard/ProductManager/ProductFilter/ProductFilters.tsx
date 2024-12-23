
// ProductFilters.tsx
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

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categories: string;
  onCategoryChange: (value: string) => void;
  gender: string;
  onGenderChange: (value: string) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  categories,
  onCategoryChange,
  gender,
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

      {/* Category Filter (Select) */}
      <div className="min-w-[200px]">
        <Select value={categories} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Loại sản phẩm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="1">Áo thun</SelectItem>
            <SelectItem value="2">Áo sơ mi</SelectItem>
            <SelectItem value="3">Quần jean</SelectItem>
            <SelectItem value="4">Quần tây</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gender Filter (Select) */}
      <div className="min-w-[200px]">
        <Select value={gender} onValueChange={onGenderChange}>
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