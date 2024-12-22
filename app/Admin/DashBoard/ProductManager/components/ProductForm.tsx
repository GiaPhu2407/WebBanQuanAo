import React from 'react';
import { FormData, LoaiSanPham } from '@/app/Admin/type/product';

import { ProductImage } from './form/ProductFormImage';
import { ProductSizes } from './form/ProductSize';
import { ProductGender } from './form/ProductFormGender';
import { ProductFormActions } from './form/ProductFormActions';
import { ProductBasicInfo } from './form/ProductBasic';
import { ProductDescription } from './form/ProductDescription';

interface ProductFormProps {
    formData: FormData;
    isEditing: boolean;
    imageUrl: string;
    loaisanphamList: LoaiSanPham[];
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onGenderChange: (isMale: boolean) => void;
    onSizeChange: (size: string) => void;
    onImageChange: (url: string) => void;
    onCancel: () => void;
  }
  
  export const ProductForm: React.FC<ProductFormProps> = ({
    formData,
    isEditing,
    imageUrl,
    loaisanphamList,
    onSubmit,
    onChange,
    onGenderChange,
    onSizeChange,
    onImageChange,
    onCancel,
  }) => {
    return (
      <form onSubmit={onSubmit} className="space-y-4">
        <ProductBasicInfo
          formData={formData}
          loaisanphamList={loaisanphamList}
          onChange={onChange}
        />
        
        <ProductDescription formData={formData} onChange={onChange} />
        
        <ProductImage imageUrl={imageUrl} onImageChange={onImageChange} />
        
        <ProductSizes formData={formData} onSizeQuantityChange={(sizes) => onSizeChange(sizes.map(size => size.tenSize).join(','))} />//+
        
        <ProductGender formData={formData} onGenderChange={onGenderChange} />
        
        <ProductFormActions isEditing={isEditing} onCancel={onCancel} />
      </form>
    );
  };