import React, { useState } from "react";

 
// import ProductGrid from "../product/ProductGrid";
  
import { FilterState } from "../../component/type/filter";
  
import { filterProducts } from "../utils/productfilters";
import { useProducts } from "../hook/useProducts";
import FilterButton from "../filterbutton/filterdesktop";
import LoadingSpinner from "../common/LoadingSpinner";
import ProductGrid from "../ProductList";
import MobileFilter from "../filterbutton/filtermobile";
import Filter from "../Filter";
FilterButton
 

const FilterPage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { products, loading, error } = useProducts();
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    categories: [],
    gender: [],
    priceRange: [0, 10000000],
    sizes: [],
  });

  const handleFilterChange = (filters: FilterState) => {
    setActiveFilters(filters);
    setIsFilterOpen(false);
  };

  const filteredProducts = filterProducts(products, activeFilters);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sản phẩm</h1>
        <FilterButton 
          isOpen={isFilterOpen} 
          onClick={() => setIsFilterOpen(!isFilterOpen)} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Desktop Filter */}
        <div className="hidden md:block">
          <Filter onFilterChange={handleFilterChange} />
        </div>

        {/* Mobile Filter */}
        <MobileFilter
          isOpen={isFilterOpen}
          onFilterChange={handleFilterChange}
          onClose={() => setIsFilterOpen(false)}
        />

        {/* Product List Area */}
        <div className="md:col-span-3">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </div>
    </div>
  );
};