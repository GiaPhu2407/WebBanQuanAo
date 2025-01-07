import React from 'react';
import { ProductImage } from '@/app/component/Category/type/product';

interface ImageGalleryProps {
  mainImage: string;
  images: ProductImage[];
  selectedImage: string;
  onImageSelect: (image: string) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  mainImage,
  images,
  selectedImage,
  onImageSelect,
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-2">
        <div
          className={`w-20 aspect-square cursor-pointer rounded-lg overflow-hidden border-2 ${
            selectedImage === mainImage ? "border-blue-500" : "border-transparent"
          }`}
          onClick={() => onImageSelect(mainImage)}
        >
          <img
            src={mainImage}
            alt="Main"
            className="w-full h-full object-cover"
          />
        </div>
        {images.map((image) => (
          <div
            key={image.idImage}
            className={`w-20 aspect-square cursor-pointer rounded-lg overflow-hidden border-2 ${
              selectedImage === image.url ? "border-blue-500" : "border-transparent"
            }`}
            onClick={() => onImageSelect(image.url)}
          >
            <img
              src={image.url}
              alt={image.altText || "Product image"}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="flex-1">
        <div className="aspect-square relative overflow-hidden rounded-xl">
          <img
            src={selectedImage}
            alt="Selected product image"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};