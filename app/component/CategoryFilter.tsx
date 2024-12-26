import React from 'react';
import { Category } from '@/app/component/type/category';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: number[];
  onCategoryChange: (id: number) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Danh mục</h2>
      <div className="space-y-2">
        {categories.map((category) => (
          <label key={category.idloaisanpham} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.idloaisanpham)}
              onChange={() => onCategoryChange(category.idloaisanpham)}
              className="mr-2"
            />
            {category.tenloai}
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;