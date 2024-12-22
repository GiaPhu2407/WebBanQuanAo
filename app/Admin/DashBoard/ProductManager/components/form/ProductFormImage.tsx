import React from 'react';
import Fileupload from '@/components/ui/Fileupload';

interface ProductImageProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  imageUrl,
  onImageChange,
}) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Hình ảnh</span>
      </label>
      <Fileupload
        endpoint="imageUploader"
        onChange={(url) => onImageChange(url || "")}
        showmodal={!imageUrl}
      />
      {imageUrl && (
        <div className="mt-2">
          <img
            src={imageUrl}
            alt="Preview"
            className="max-h-40 object-contain mx-auto"
          />
          <button
            type="button"
            onClick={() => onImageChange("")}
            className="btn btn-error btn-sm mt-2"
          >
            Xóa ảnh
          </button>
        </div>
      )}
    </div>
  );
};