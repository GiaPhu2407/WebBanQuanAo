import React from 'react';

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-col gap-2">
        <p className="font-medium">{message}</p>
        <div className="flex gap-2">
          <button
            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={onConfirm}
          >
            Xác nhận
          </button>
          <button
            className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            onClick={onCancel}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};