import React from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  limitSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  limitSize,
  totalRecords,
  onPageChange,
  onLimitChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 2) pages.push('...');
      if (currentPage > 1 && currentPage < totalPages) pages.push(currentPage);
      if (currentPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="text-sm text-gray-700">
        Hiển thị: {(currentPage - 1) * limitSize + 1} -{' '}
        {Math.min(currentPage * limitSize, totalRecords)} trên {totalRecords} kết quả
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-2">...</span>
            ) : (
              <button
                onClick={() => onPageChange(Number(page))}
                className={`min-w-[40px] h-[40px] flex items-center justify-center rounded-lg border text-sm
                  ${page === currentPage
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white hover:bg-gray-50'
                  }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="relative ml-2">
          <select
            value={limitSize}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 cursor-pointer text-sm"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;