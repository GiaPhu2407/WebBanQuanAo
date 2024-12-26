import React from 'react';
 
import { FilterState } from '../type/filter';
// import Filter from '../Filter';

interface MobileFilterProps {
  isOpen: boolean;
  onFilterChange: (filters: FilterState) => void;
  onClose: () => void;
}

const MobileFilter: React.FC<MobileFilterProps> = ({ isOpen, onFilterChange, onClose }) => (
  <div className="md:hidden">
    <div
      className={`fixed left-0 right-0 bg-white z-50 transition-all duration-300 shadow-lg ${
        isOpen
          ? "top-[calc(var(--header-height,0px))] opacity-100"
          : "-top-full opacity-0"
      }`}
    >
      {/* <div className="max-h-[70vh] overflow-y-auto">
        <Filter 
          onFilterChange={onFilterChange}
          onClose={onClose}
        />
      </div> */}
    </div>

    {isOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
    )}
  </div>
);
export default MobileFilter