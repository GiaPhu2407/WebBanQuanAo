// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { FileSpreadsheet, FileText, File, X } from "lucide-react";
// import { exportLoaiSanPhamToExcel } from "./xuatexcel";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { exportLoaiSanPhamToWord } from "./xuatword";

// interface LoaiSanPham {
//   idloaisanpham: number;
//   tenloai: string;
//   mota: string;
// }

// interface ExportButtonsProps {
//   data: LoaiSanPham[];
// }

// const ExportButtons = ({ data }: ExportButtonsProps) => {
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
//   const [previewType, setPreviewType] = useState<
//     "word" | "excel" | "pdf" | null
//   >(null);

//   const handlePreview = (type: "word" | "excel" | "pdf") => {
//     setPreviewType(type);
//     setIsPreviewOpen(true);
//   };

//   const generatePreviewContent = () => {
//     const currentDate = new Date();
//     const day = currentDate.getDate();
//     const month = currentDate.getMonth() + 1;
//     const year = currentDate.getFullYear();

//     return (
//       <div className="bg-white p-8 min-h-full">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <p className="font-bold text-lg mb-2">
//             CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
//           </p>
//           <p className="font-bold text-lg mb-2">Độc lập - Tự do - Hạnh phúc</p>
//           <p className="text-lg">------------------------</p>
//         </div>

//         {/* Date */}
//         <div className="text-right mb-8 italic">
//           <p>
//             Ngày {day} tháng {month} năm {year}
//           </p>
//         </div>

//         {/* Title */}
//         <div className="text-center mb-8">
//           <h1 className="font-bold text-xl">DANH SÁCH LOẠI SẢN PHẨM</h1>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 p-2 text-center">STT</th>
//                 <th className="border border-gray-300 p-2 text-center">
//                   Mã Loại
//                 </th>
//                 <th className="border border-gray-300 p-2 text-center">
//                   Tên Loại
//                 </th>
//                 <th className="border border-gray-300 p-2 text-center">
//                   Mô Tả
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item, index) => (
//                 <tr
//                   key={item.idloaisanpham}
//                   className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                 >
//                   <td className="border border-gray-300 p-2 text-center">
//                     {index + 1}
//                   </td>
//                   <td className="border border-gray-300 p-2 text-center">
//                     {item.idloaisanpham}
//                   </td>
//                   <td className="border border-gray-300 p-2">{item.tenloai}</td>
//                   <td className="border border-gray-300 p-2">{item.mota}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   const handleExport = async () => {
//     switch (previewType) {
//       case "word":
//         exportLoaiSanPhamToWord(data);
//         break;
//       case "excel":
//         exportLoaiSanPhamToExcel(data);
//         break;
//       case "pdf":
//         try {
//           const response = await fetch("/api/exportpdfloaisanpham", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ data }),
//           });

//           if (!response.ok) {
//             throw new Error("PDF generation failed");
//           }

//           const blob = await response.blob();
//           const url = window.URL.createObjectURL(blob);
//           const link = document.createElement("a");
//           const currentDate = new Date();
//           const fileName = `danh-sach-loai-san-pham-${currentDate.getDate()}${
//             currentDate.getMonth() + 1
//           }${currentDate.getFullYear()}.pdf`;

//           link.href = url;
//           link.download = fileName;
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);
//           window.URL.revokeObjectURL(url);
//         } catch (error) {
//           console.error("Error generating PDF:", error);
//         }
//         break;
//     }
//   };

//   const getPreviewTitle = () => {
//     switch (previewType) {
//       case "word":
//         return "Xem trước tài liệu Word";
//       case "excel":
//         return "Xem trước tài liệu Excel";
//       case "pdf":
//         return "Xem trước tài liệu PDF";
//       default:
//         return "";
//     }
//   };

//   const getExportButtonText = () => {
//     switch (previewType) {
//       case "word":
//         return "Tải xuống Word";
//       case "excel":
//         return "Tải xuống Excel";
//       case "pdf":
//         return "Tải xuống PDF";
//       default:
//         return "";
//     }
//   };

//   const getExportIcon = () => {
//     switch (previewType) {
//       case "word":
//         return <FileText className="w-4 h-4" />;
//       case "excel":
//         return <FileSpreadsheet className="w-4 h-4" />;
//       case "pdf":
//         return <File className="w-4 h-4" />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       <div className="flex gap-2">
//         <Button
//           onClick={() => handlePreview("word")}
//           className="flex items-center gap-2 bg-white text-black border border-gray-200 shadow-sm hover:bg-blue-50"
//         >
//           <FileText className="w-4 h-4" />
//           Xem Word
//         </Button>
//         <Button
//           onClick={() => handlePreview("excel")}
//           className="flex items-center gap-2 bg-white text-black border border-gray-200 shadow-sm hover:bg-green-50"
//         >
//           <FileSpreadsheet className="w-4 h-4" />
//           Xem Excel
//         </Button>
//         <Button
//           onClick={() => handlePreview("pdf")}
//           className="flex items-center gap-2 bg-white text-black border border-gray-200 shadow-sm hover:bg-red-50"
//         >
//           <File className="w-4 h-4" />
//           Xem PDF
//         </Button>
//       </div>

//       <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
//         <DialogContent className="max-w-5xl h-[80vh] overflow-y-auto">
//           <DialogHeader className="sticky top-0 bg-white z-10 pb-4 mb-4 border-b">
//             <div className="flex justify-between items-center">
//               <DialogTitle>{getPreviewTitle()}</DialogTitle>
//               <div className="flex gap-2">
//                 <Button
//                   onClick={handleExport}
//                   variant="outline"
//                   className="flex items-center gap-2"
//                 >
//                   {getExportIcon()}
//                   {getExportButtonText()}
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   className="h-8 w-8 p-0"
//                   onClick={() => {
//                     setIsPreviewOpen(false);
//                     setPreviewType(null);
//                   }}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </DialogHeader>
//           {generatePreviewContent()}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default ExportButtons;
