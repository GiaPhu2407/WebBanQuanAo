import React from "react";
import { Button } from "@/components/ui/button";
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
}

export function ProductColorSelector({
  selectedColors,
  onColorAdd,
  onColorRemove,
}: ProductColorSelectorProps) {
  const { colors, loading, error } = useColors();
  const [selectedColorIds, setSelectedColorIds] = React.useState<string[]>([]);

  // Filter out already selected colors
  const availableColors = colors.filter(
    (color) => !selectedColors.some((sc) => sc.idmausac === color.idmausac)
  );

  const handleAddColors = () => {
    selectedColorIds.forEach((colorId) => {
      const numericColorId = parseInt(colorId);
      if (!isNaN(numericColorId)) {
        onColorAdd({ idmausac: numericColorId, hinhanh: "" });
      }
    });
    setSelectedColorIds([]); // Reset selection after adding
  };

  const handleColorSelection = (colorId: string, isSelected: boolean) => {
    setSelectedColorIds((prev) =>
      isSelected ? [...prev, colorId] : prev.filter((id) => id !== colorId)
    );
  };

  if (loading) {
    return <div className="text-center py-4">Loading colors...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Selected colors display */}
      <div className="flex flex-wrap gap-2">
        {selectedColors.map((productColor) => {
          const color = colors.find(
            (c) => c.idmausac === productColor.idmausac
          );
          return (
            <div
              key={productColor.idmausac}
              className="flex items-center gap-2 px-3 py-2 bg-white border rounded-full shadow-sm"
            >
              <div
                className="w-4 h-4 rounded-full border shadow-sm"
                style={{ backgroundColor: color?.mamau }}
              />
              <span className="text-sm font-medium">{color?.tenmau}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onColorRemove(productColor.idmausac)}
                className="ml-1 h-5 w-5 p-0 hover:bg-red-50 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Color selector */}
      {availableColors.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableColors.map((color) => (
              <label
                key={color.idmausac}
                className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedColorIds.includes(color.idmausac.toString())}
                  onChange={(e) =>
                    handleColorSelection(
                      color.idmausac.toString(),
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300"
                />
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: color.mamau }}
                />
                <span className="text-sm">{color.tenmau}</span>
              </label>
            ))}
          </div>
          <Button
            onClick={handleAddColors}
            disabled={selectedColorIds.length === 0}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm {selectedColorIds.length} màu đã chọn
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
