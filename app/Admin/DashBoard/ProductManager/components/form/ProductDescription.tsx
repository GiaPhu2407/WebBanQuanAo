import React from 'react';
import { FormData } from '@/app/Admin/type/product';

interface ProductDescriptionProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Mô tả</span>
      </label>
      <textarea
        name="mota"
        value={formData.mota}
        onChange={onChange}
        className="textarea textarea-bordered h-24"
        required
      />
    </div>
  );
};