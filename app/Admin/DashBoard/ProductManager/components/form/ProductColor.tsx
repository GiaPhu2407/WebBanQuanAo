import React from "react";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Plus, X } from "lucide-react";
import { ProductColor } from "@/app/Admin/type/product";
import { useColors } from "../../hooks/useColor";

interface ProductColorSelectorProps {
  selectedColors: Omit<
    ProductColor,
    "idProductColor" | "idsanpham" | "color"
  >[];
  onColorAdd: (
    color: Omit<ProductColor, "idProductColor" | "idsanpham" | "color">
  ) => void;
  onColorRemove: (colorId: number) => void;
  onImageChange: (colorId: number, imageUrl: string) => void;
}

export function ProductColorSelector({
  selectedColors,
  onColorAdd,
  onColorRemove,
  onImageChange,
}: ProductColorSelectorProps) {
  const { colors, loading, error } = useColors();
  const [selectedColorId, setSelectedColorId] = React.useState<string>("");

  // Filter out already selected colors
  const availableColors = colors.filter(
    (color) => !selectedColors.some((sc) => sc.idmausac === color.idmausac)
  );

  const handleAddColor = () => {
    if (selectedColorId) {
      const colorId = parseInt(selectedColorId);
      onColorAdd({ idmausac: colorId, hinhanh: "" });
      setSelectedColorId("");
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading colors...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Selected colors with their images */}
      <div className="grid grid-cols-1 gap-4">
        {selectedColors.map((productColor) => {
          const color = colors.find(
            (c) => c.idmausac === productColor.idmausac
          );
          return (
            <div
              key={productColor.idmausac}
              className="flex items-start gap-4 p-4 border rounded-lg bg-white shadow-sm"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-full border shadow-sm"
                    style={{ backgroundColor: color?.mamau }}
                  />
                  <span className="font-medium">{color?.tenmau}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onColorRemove(productColor.idmausac)}
                    className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-2">
                  {/* <FileUpload
                    value={productColor.hinhanh}
                    onChange={(url) =>
                      onImageChange(productColor.idmausac, url || "")
                    }
                    onRemove={() => onImageChange(productColor.idmausac, "")}
                  /> */}
                  {productColor.hinhanh && (
                    <div className="mt-2">
                      <img
                        src={productColor.hinhanh}
                        alt={`Color variant ${color?.tenmau}`}
                        className="max-h-32 rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Color selector */}
      {availableColors.length > 0 && (
        <div className="flex gap-2">
          <select
            value={selectedColorId}
            onChange={(e) => setSelectedColorId(e.target.value)}
            className="flex-1 p-2 border rounded-md bg-white"
          >
            <option value="">Chọn màu sắc</option>
            {availableColors.map((color) => (
              <option key={color.idmausac} value={color.idmausac}>
                {color.tenmau}
              </option>
            ))}
          </select>
          <Button
            onClick={handleAddColor}
            disabled={!selectedColorId}
            className="min-w-[120px]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm màu
          </Button>
        </div>
      )}

      {availableColors.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-2">
          Đã thêm tất cả các màu có sẵn
        </p>
      )}
    </div>
  );
}
