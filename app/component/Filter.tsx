import React, { useState, useEffect } from 'react';
import { Category } from '@/app/component/type/product';

interface FilterProps {
  onFilterChange: (filters: {
    categories: number[];
    gender: string | null;
    priceRange: number[];
    sizes: string[];
  }) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/loaisanpham");
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const debouncedFilter = setTimeout(() => {
      onFilterChange({
        categories: selectedCategories,
        gender: selectedGender,
        priceRange,
        sizes: selectedSizes,
      });
    }, 300);

    return () => clearTimeout(debouncedFilter);
  }, [selectedCategories, selectedGender, priceRange, selectedSizes]);

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedGender(null);
    setPriceRange([0, 10000000]);
    setSelectedSizes([]);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <button onClick={handleReset} className="text-blue-600 hover:underline mb-4">
        Reset Filters
      </button>

      <div className="space-y-6">
        <div>
          <h3 className="font-bold mb-2">Categories</h3>
          {categories.map((category) => (
            <label key={category.idloaisanpham} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.idloaisanpham)}
                onChange={() => setSelectedCategories(prev => 
                  prev.includes(category.idloaisanpham) 
                    ? prev.filter(id => id !== category.idloaisanpham)
                    : [...prev, category.idloaisanpham]
                )}
              />
              {category.tenloai}
            </label>
          ))}
        </div>

        <div>
          <h3 className="font-bold mb-2">Gender</h3>
          {['nam', 'nu'].map((gender) => (
            <label key={gender} className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                checked={selectedGender === gender}
                onChange={() => setSelectedGender(prev => prev === gender ? null : gender)}
              />
              {gender === 'nam' ? 'Male' : 'Female'}
            </label>
          ))}
        </div>

        <div>
          <h3 className="font-bold mb-2">Price Range</h3>
          <div className="flex gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="border rounded p-1 w-24"
            />
            <span>-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="border rounded p-1 w-24"
            />
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2">Sizes</h3>
          <div className="flex gap-2 flex-wrap">
            {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSizes(prev => 
                  prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                )}
                className={`px-3 py-1 border rounded ${
                  selectedSizes.includes(size) ? 'bg-blue-600 text-white' : ''
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Filter