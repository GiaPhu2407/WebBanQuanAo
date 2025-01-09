import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, File, X } from "lucide-react";
import { exportToExcel } from "./xuatexcel";
import { exportToPDF } from "./xuatpdf";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { exportToWord } from "./xuatword";

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

const ExportButtons = ({ data }: ExportButtonsProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState<
    "word" | "excel" | "pdf" | null
  >(null);

  const handlePreview = (type: "word" | "excel" | "pdf") => {
    setPreviewType(type);
    setIsPreviewOpen(true);
  };

  const generatePreviewContent = () => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    return (
      <div className="bg-white p-8 min-h-full">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="font-bold text-lg mb-2">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </p>
          <p className="font-bold text-lg mb-2">Độc lập - Tự do - Hạnh phúc</p>
          <p className="text-lg">------------------------</p>
        </div>

        {/* Date */}
        <div className="text-right mb-8 italic">
          <p>
            Ngày {day} tháng {month} năm {year}
          </p>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-bold text-xl">DANH SÁCH NHÀ CUNG CẤP</h1>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-center">STT</th>
                <th className="border border-gray-300 p-2 text-center">
                  Mã NCC
                </th>
                <th className="border border-gray-300 p-2 text-center">
                  Tên nhà cung cấp
                </th>
                <th className="border border-gray-300 p-2 text-center">
                  Số điện thoại
                </th>
                <th className="border border-gray-300 p-2 text-center">
                  Địa chỉ
                </th>
                <th className="border border-gray-300 p-2 text-center">
                  Email
                </th>
                <th className="border border-gray-300 p-2 text-center">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={item.idnhacungcap}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border border-gray-300 p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item.idnhacungcap}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item.tennhacungcap}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item.sodienthoai}
                  </td>
                  <td className="border border-gray-300 p-2">{item.diachi}</td>
                  <td className="border border-gray-300 p-2">{item.email}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item.trangthai ? "Đang cung cấp" : "Ngừng cung cấp"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const handleExport = () => {
    switch (previewType) {
      case "word":
        exportToWord(data);
        break;
      case "excel":
        exportToExcel(data);
        break;
      case "pdf":
        exportToPDF(data);
        break;
    }
  };

  const getPreviewTitle = () => {
    switch (previewType) {
      case "word":
        return "Xem trước tài liệu Word";
      case "excel":
        return "Xem trước tài liệu Excel";
      case "pdf":
        return "Xem trước tài liệu PDF";
      default:
        return "";
    }
  };

  const getExportButtonText = () => {
    switch (previewType) {
      case "word":
        return "Tải xuống Word";
      case "excel":
        return "Tải xuống Excel";
      case "pdf":
        return "Tải xuống PDF";
      default:
        return "";
    }
  };

  const getExportIcon = () => {
    switch (previewType) {
      case "word":
        return <FileText className="w-4 h-4" />;
      case "excel":
        return <FileSpreadsheet className="w-4 h-4" />;
      case "pdf":
        return <File className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={() => handlePreview("word")}
          className="flex items-center gap-2 bg-white text-black border border-gray-200 shadow-sm hover:bg-blue-50"
        >
          <FileText className="w-4 h-4" />
          Xem Word
        </Button>
        <Button
          onClick={() => handlePreview("excel")}
          className="flex items-center gap-2 bg-white text-black border border-gray-200 shadow-sm hover:bg-green-50"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Xem Excel
        </Button>
        <Button
          onClick={() => handlePreview("pdf")}
          className="flex items-center gap-2 bg-white text-black border border-gray-200 shadow-sm hover:bg-red-50"
        >
          <File className="w-4 h-4" />
          Xem PDF
        </Button>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl h-[80vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4 mb-4 border-b">
            <div className="flex justify-between items-center">
              <DialogTitle>{getPreviewTitle()}</DialogTitle>
              <div className="flex gap-2">
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {getExportIcon()}
                  {getExportButtonText()}
                </Button>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    setIsPreviewOpen(false);
                    setPreviewType(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          {generatePreviewContent()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExportButtons;
