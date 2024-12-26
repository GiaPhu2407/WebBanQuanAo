import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className="md:hidden flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
  >
    <span>Bộ lọc</span>
    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
  </button>
);
export default FilterButton;