import React, { useState } from "react";
import Filter from "@/app/component/Filter";
import { FilterState } from "./Type";
import { ChevronDown, ChevronUp } from "lucide-react";

const FilterPage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    categories: [],
    gender: [],
    priceRange: [0, 10000000],
    sizes: [],
  });

  const handleFilterChange = (filters: FilterState) => {
    setActiveFilters(filters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sản phẩm</h1>
        
        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="md:hidden flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <span>Bộ lọc</span>
          {isFilterOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Desktop Filter */}
        <div className="hidden md:block">
          <Filter onFilterChange={handleFilterChange} />
        </div>

        {/* Mobile Filter Dropdown */}
        <div className="md:hidden">
          <div
            className={`fixed left-0 right-0 bg-white z-50 transition-all duration-300 shadow-lg ${
              isFilterOpen
                ? "top-[calc(var(--header-height,0px))] opacity-100"
                : "-top-full opacity-0"
            }`}
          >
            <div className="max-h-[70vh] overflow-y-auto">
              <Filter 
                onFilterChange={handleFilterChange}
                onClose={() => setIsFilterOpen(false)}
              />
            </div>
          </div>

          {/* Overlay */}
          {isFilterOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsFilterOpen(false)}
            />
          )}
        </div>

        {/* Product List Area */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-gray-100 rounded-lg p-4 h-48" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPage;