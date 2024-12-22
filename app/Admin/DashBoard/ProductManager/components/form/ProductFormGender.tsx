import React from 'react';
import { FormData } from '@/app/Admin/type/product';

interface ProductGenderProps {
    formData: FormData;
    onGenderChange: (isMale: boolean) => void;
  }
  
  export const ProductGender: React.FC<ProductGenderProps> = ({
    formData,
    onGenderChange,
  }) => {
    return (
      <div className="form-control">
        <label className="label">
          <span className="label-text">Giới tính</span>
        </label>
        <div className="flex gap-4">
          <label className="cursor-pointer flex items-center">
            <input
              type="radio"
              name="gioitinh"
              checked={formData.gioitinh === true}
              onChange={() => onGenderChange(true)}
              className="radio radio-primary mr-2"
            />
            <span>Nam</span>
          </label>
          <label className="cursor-pointer flex items-center">
            <input
              type="radio"
              name="gioitinh"
              checked={formData.gioitinh === false}
              onChange={() => onGenderChange(false)}
              className="radio radio-primary mr-2"
            />
            <span>Nữ</span>
          </label>
        </div>
      </div>
    );
  };