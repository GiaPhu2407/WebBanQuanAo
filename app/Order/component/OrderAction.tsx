interface OrderActionsProps {
    orderId: number;
    status: string;
    onCancel: (orderId: number) => void;
    onDelete: (orderId: number) => void;
  }
  
  export const OrderActions = ({ orderId, status, onCancel, onDelete }: OrderActionsProps) => {
    const canDelete = status === "Đã hủy" || status === "Đã giao";
    
    return (
      <div className="flex justify-end mt-4 space-x-2">
        {status !== "Đã hủy" && status !== "Đã giao" && (
          <button
            className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-md transition duration-200"
            onClick={() => onCancel(orderId)}
          >
            Hủy đơn
          </button>
        )}
        
        {canDelete && (
          <button
            className="text-gray-500 hover:bg-gray-50 px-4 py-2 rounded-md transition duration-200 flex items-center"
            onClick={() => onDelete(orderId)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-1" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            Xóa đơn
          </button>
        )}
      </div>
    );
  };