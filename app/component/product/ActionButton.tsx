import React from 'react';

interface ActionButtonsProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
  loading: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAddToCart,
  onBuyNow,
  loading,
}) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={onAddToCart}
        disabled={loading}
        className="flex-1 px-6 py-3 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50"
      >
        {loading ? "Đang xử lý..." : "Thêm vào giỏ hàng"}
      </button>
      <button
        onClick={onBuyNow}
        disabled={loading}
        className="flex-1 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        {loading ? "Đang xử lý..." : "Mua ngay"}
      </button>
    </div>
  );
};