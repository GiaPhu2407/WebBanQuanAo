// pages/FilterPage.tsx
import React from "react";
import Filter from "@/app/component/Filter"; // Đảm bảo đường dẫn đúng

const FilterPage: React.FC = () => {
  const handleFilterChange = (filters: any) => {
    // Xử lý logic khi bộ lọc thay đổi (nếu cần)
    console.log(filters);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Bộ lọc sản phẩm</h1>
      <Filter onFilterChange={handleFilterChange} />
    </div>
  );
};

export default FilterPage;
