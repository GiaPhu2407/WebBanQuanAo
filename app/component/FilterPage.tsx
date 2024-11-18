import React from "react";
import Filter from "@/app/component/Filter";
// import ProductList from "@/app/component/ProductList";
import { FilterState } from "./Type";

const FilterPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Bộ lọc sản phẩm</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Filter
            onFilterChange={function (filters: FilterState): void {
              throw new Error("Function not implemented.");
            }}
          />
        </div>
        <div className="md:col-span-3">{/* <ProductList /> */}</div>
      </div>
    </div>
  );
};

export default FilterPage;
