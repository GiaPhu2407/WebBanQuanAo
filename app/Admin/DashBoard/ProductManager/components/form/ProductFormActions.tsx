import React from 'react';

interface ProductFormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
}

export const ProductFormActions: React.FC<ProductFormActionsProps> = ({
  isEditing,
  onCancel,
}) => {
  return (
    <div className="modal-action">
      <button type="button" className="btn btn-ghost" onClick={onCancel}>
        Hủy
      </button>
      <button type="submit" className="btn btn-primary">
        {isEditing ? "Cập nhật" : "Thêm mới"}
      </button>
    </div>
  );
};