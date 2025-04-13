import React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface ProductScheduleProps {
  releaseDate: Date | null;
  onDateChange: (date: Date | null) => void;
  isEditing?: boolean;
}

export function ProductSchedule({
  releaseDate,
  onDateChange,
  isEditing = false,
}: ProductScheduleProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onDateChange(date);
  };

  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Lịch phát hành sản phẩm
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="datetime-local"
            min={format(minDate, "yyyy-MM-dd'T'HH:mm")}
            value={releaseDate ? format(releaseDate, "yyyy-MM-dd'T'HH:mm") : ""}
            onChange={handleDateChange}
            className="pl-10"
          />
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        {isEditing && releaseDate && (
          <Button
            variant="outline"
            onClick={() => onDateChange(null)}
            className="text-red-500 hover:text-red-700"
          >
            Hủy lịch
          </Button>
        )}
      </div>
      <p className="text-sm text-gray-500">
        {releaseDate
          ? `Sản phẩm sẽ được hiển thị vào: ${format(
              releaseDate,
              "dd/MM/yyyy HH:mm"
            )}`
          : "Sản phẩm sẽ được hiển thị ngay lập tức"}
      </p>
    </div>
  );
}
