import React from "react";
import Fileupload from "@/components/ui/Fileupload";

interface MultiProductImageProps {
  imageUrls: string[];
  onImagesChange: (urls: string[]) => void;
}

export const MultiProductImage: React.FC<MultiProductImageProps> = ({
  imageUrls,
  onImagesChange,
}) => {
  const handleAddImage = (newUrl: string) => {
    if (newUrl) {
      onImagesChange([...imageUrls, newUrl]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = imageUrls.filter(
      (_, index) => index !== indexToRemove
    );
    onImagesChange(updatedImages);
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Hình ảnh</span>
      </label>

      {/* Image Gallery */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative group border rounded p-1">
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="h-32 w-full object-contain"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="btn btn-error btn-xs absolute bottom-1 right-1 opacity-70 group-hover:opacity-100"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <Fileupload
        endpoint="imageUploader"
        onChange={(url) => handleAddImage(url || "")}
        showmodal={true}
      />

      <div className="text-sm text-gray-500 mt-1">
        {imageUrls.length > 0
          ? `Đã tải lên ${imageUrls.length} hình ảnh`
          : "Chưa có hình ảnh nào được tải lên"}
      </div>
    </div>
  );
};
