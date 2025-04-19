import React from "react";

interface ProductSaleStatsProps {
  soldCount: number;
  totalQuantity: number;
}

const ProductSaleStats: React.FC<ProductSaleStatsProps> = ({
  soldCount,
  totalQuantity,
}) => {
  // Calculate percentage for progress bar
  const totalInventory = soldCount + totalQuantity;
  const soldPercentage =
    totalInventory > 0 ? (soldCount / totalInventory) * 100 : 0;

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-3">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-orange-500 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700 font-medium">Đã bán:</span>
          </div>
          <span className="font-semibold text-orange-600">
            {soldCount} sản phẩm
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm11 14a1 1 0 001-1v-1H3v1a1 1 0 001 1h12z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700 font-medium">Còn lại:</span>
          </div>
          <span className="font-semibold text-blue-600">
            {totalQuantity} sản phẩm
          </span>
        </div>

        <div className="mt-1">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-orange-500 to-orange-400 h-2.5 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${soldPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>{Math.round(soldPercentage)}% đã bán</span>
            <span>{Math.round(100 - soldPercentage)}% còn lại</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSaleStats;
