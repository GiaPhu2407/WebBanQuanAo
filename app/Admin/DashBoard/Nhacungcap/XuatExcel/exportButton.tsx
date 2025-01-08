import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, File } from "lucide-react";
import { exportToWord } from "./xuatword";
import { exportToExcel } from "./xuatexcel";
import { exportToPDF } from "./xuatpdf";
exportToPDF;

interface ExportButtonsProps {
  data: any[];
}

export function ExportButtons({ data }: ExportButtonsProps) {
  const handleExportWord = () => {
    exportToWord(data);
  };

  const handleExportExcel = () => {
    exportToExcel(data);
  };

  const handleExportPDF = () => {
    exportToPDF(data);
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleExportWord}
        className="flex items-center gap-2 bg-white text-black"
      >
        <FileText className="w-4 h-4 " />
        Xuất Word
      </Button>
      <Button
        onClick={handleExportExcel}
        className="flex items-center gap-2  bg-white text-black"
      >
        <FileSpreadsheet className="w-4 h-4" />
        Xuất Excel
      </Button>
      <Button
        onClick={handleExportPDF}
        className="flex items-center gap-2  bg-white text-black"
      >
        <File className="w-4 h-4" />
        Xuất PDF
      </Button>
    </div>
  );
}
