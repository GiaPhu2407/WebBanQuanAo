interface EmptyStateProps {
    onShopNow: () => void;
  }
  
  export const EmptyState = ({ onShopNow }: EmptyStateProps) => {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500 text-xl mb-4">
          Bạn chưa có đơn hàng nào
        </p>
        <button
          onClick={onShopNow}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Bắt đầu mua sắm
        </button>
      </div>
    );
  };