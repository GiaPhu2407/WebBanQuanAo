import React from "react";
import { Button } from "@/components/ui/button";

import { exportToWord } from "./xuatword";
import { exportToPDF } from "./xuatpdf";
import { exportToExcel } from "./xuatexcel";
import { FileSpreadsheet, File, FileText } from "lucide-react";

interface NhaCungCap {
  idnhacungcap: number;
  tennhacungcap: string;
  sodienthoai: string;
  diachi: string;
  email: string;
  trangthai: boolean;
}

interface ExportButtonsProps {
  data: NhaCungCap[];
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ data }) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => exportToExcel(data)}
        variant="outline"
        className="flex items-center gap-2"
      >
        <FileSpreadsheet className="w-4 h-4" />
        Xuất Excel
      </Button>

      <Button
        onClick={() => exportToPDF(data)}
        variant="outline"
        className="flex items-center gap-2"
      >
        <File className="w-4 h-4" />
        Xuất PDF
      </Button>

      <Button
        onClick={() => exportToWord(data)}
        variant="outline"
        className="flex items-center gap-2"
      >
        <FileText className="w-4 h-4" />
        Xuất Word
      </Button>
    </div>
  );
};
