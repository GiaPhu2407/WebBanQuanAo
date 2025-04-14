// import React, { ChangeEvent } from "react";
// import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/use-toast";
// import * as XLSX from "xlsx";
// import * as QRCode from "qrcode";
// import {
//   Document,
//   Packer,
//   Paragraph,
//   Table,
//   TableRow,
//   TableCell,
//   HeadingLevel,
//   TextRun,
//   AlignmentType,
//   WidthType,
// } from "docx";

// interface LoaiSanPham {
//   idloaisanpham: number;
//   tenloai: string;
//   mota: string;
// }

// interface ExportOptionsProps {
//   selectedItems: number[];
//   loaisanphamList: LoaiSanPham[];
//   onDataImported: () => void;
// }

// export const ExportOptions: React.FC<ExportOptionsProps> = ({
//   selectedItems,
//   loaisanphamList,
//   onDataImported,
// }) => {
//   const generateQRCodeData = async (data: LoaiSanPham[]) => {
//     const currentDate = new Date();
//     // Cấu trúc dữ liệu QR phù hợp với QR Scanner
//     const qrData = {
//       tieuDe: "Danh sách loại sản phẩm",
//       ngayXuat: currentDate.toLocaleString("vi-VN"),
//       tongSoMuc: data.length,
//       danhSach: data.map((item) => ({
//         id: item.idloaisanpham,
//         ten: item.tenloai,
//         moTa: item.mota,
//       })),
//       thongTinThem: {
//         thoiGianTao: currentDate.toISOString(),
//         soTrang: "1/1",
//         nguoiTao: "Hệ thống quản lý",
//         maBaoCao: `LSP-${Math.floor(
//           Math.random() * 10000
//         )}-${currentDate.getFullYear()}`,
//       },
//     };

//     try {
//       // Tạo QR code với kích thước lớn hơn và thêm margin
//       const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
//         width: 200, // Tăng kích thước
//         margin: 2, // Thêm margin
//         errorCorrectionLevel: "H", // Độ chính xác cao nhất
//         color: {
//           dark: "#000000", // Màu đen cho QR
//           light: "#FFFFFF", // Màu trắng cho nền
//         },
//       });
//       return { qrCodeDataUrl, qrData };
//     } catch (err) {
//       console.error("Lỗi khi tạo mã QR:", err);
//       return { qrCodeDataUrl: null, qrData: null };
//     }
//   };

//   const exportToPdf = async () => {
//     if (selectedItems.length === 0) {
//       toast({
//         title: "Thông báo",
//         description: "Vui lòng chọn ít nhất một mục để xuất",
//         variant: "default",
//       });
//       return;
//     }

//     const selectedData = loaisanphamList.filter((item) =>
//       selectedItems.includes(item.idloaisanpham)
//     );

//     try {
//       // Tạo mã QR và lấy dữ liệu
//       const { qrCodeDataUrl, qrData } = await generateQRCodeData(selectedData);
//       if (!qrCodeDataUrl) {
//         throw new Error("Không thể tạo mã QR");
//       }

//       const response = await fetch("/api/exportpdfloaisanpham", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           data: selectedData,
//           loaisanpham: "Danh sách loại sản phẩm",
//           qrCode: qrCodeDataUrl,
//           metadata: {
//             ngayTao: new Date().toLocaleString("vi-VN"),
//             nguoiTao: "Hệ thống",
//             tongSoMuc: selectedData.length,
//             qrData: JSON.stringify(qrData), // Lưu dữ liệu QR vào metadata
//           },
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Lỗi khi tạo PDF");
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = "danh-sach-loai-san-pham.pdf";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);

//       toast({
//         title: "Thành công",
//         description: "Đã xuất file PDF thành công",
//         variant: "success",
//       });
//     } catch (error) {
//       console.error("Lỗi khi xuất PDF:", error);
//       toast({
//         title: "Lỗi",
//         description: "Có lỗi xảy ra khi xuất PDF",
//         variant: "destructive",
//       });
//     }
//   };

//   const exportToExcel = () => {
//     if (selectedItems.length === 0) {
//       toast({
//         title: "Thông báo",
//         description: "Vui lòng chọn ít nhất một mục để xuất",
//         variant: "default",
//       });
//       return;
//     }

//     const selectedData = loaisanphamList.filter((item) =>
//       selectedItems.includes(item.idloaisanpham)
//     );

//     const workbook = XLSX.utils.book_new();
//     const worksheet = XLSX.utils.json_to_sheet(
//       selectedData.map((item) => ({
//         "Mã loại": item.idloaisanpham,
//         "Tên loại": item.tenloai,
//         "Mô tả": item.mota,
//       }))
//     );

//     XLSX.utils.book_append_sheet(workbook, worksheet, "Loại sản phẩm");
//     XLSX.writeFile(workbook, "danh-sach-loai-san-pham.xlsx");
//   };

//   const exportSelectedToWord = async () => {
//     if (selectedItems.length === 0) {
//       toast({
//         title: "Thông báo",
//         description: "Vui lòng chọn ít nhất một mục để xuất",
//         variant: "default",
//       });
//       return;
//     }

//     const selectedData = loaisanphamList.filter((item) =>
//       selectedItems.includes(item.idloaisanpham)
//     );

//     const currentDate = new Date();
//     const day = currentDate.getDate();
//     const month = currentDate.getMonth() + 1;
//     const year = currentDate.getFullYear();

//     // Header paragraphs
//     const headerParagraphs = [
//       new Paragraph({
//         alignment: AlignmentType.CENTER,
//         children: [
//           new TextRun({
//             text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
//             bold: true,
//             size: 28,
//           }),
//         ],
//       }),
//       new Paragraph({
//         alignment: AlignmentType.CENTER,
//         children: [
//           new TextRun({
//             text: "Độc lập - Tự do - Hạnh phúc",
//             bold: true,
//             size: 28,
//           }),
//         ],
//       }),
//       new Paragraph({
//         alignment: AlignmentType.CENTER,
//         children: [
//           new TextRun({
//             text: "------------------------",
//             size: 28,
//           }),
//         ],
//       }),
//       new Paragraph({
//         alignment: AlignmentType.RIGHT,
//         children: [
//           new TextRun({
//             text: `Ngày ${day} tháng ${month} năm ${year}`,
//             italics: true,
//             size: 24,
//           }),
//         ],
//       }),
//       new Paragraph({ text: "" }),
//       new Paragraph({
//         alignment: AlignmentType.CENTER,
//         heading: HeadingLevel.HEADING_1,
//         children: [
//           new TextRun({
//             text: "THÔNG TIN DANH SÁCH LOẠI SẢN PHẨM",
//             bold: true,
//             size: 32,
//             color: "000000",
//           }),
//         ],
//       }),
//       new Paragraph({ text: "" }),
//     ];

//     // Table rows
//     const tableRows = [
//       new TableRow({
//         children: ["STT", "Mã loại", "Tên loại", "Mô tả"].map(
//           (text) =>
//             new TableCell({
//               children: [
//                 new Paragraph({
//                   text,
//                   alignment: AlignmentType.CENTER,
//                 }),
//               ],
//               shading: {
//                 fill: "f5f5f5",
//               },
//             })
//         ),
//       }),
//       ...selectedData.map(
//         (item, index) =>
//           new TableRow({
//             children: [
//               new TableCell({
//                 children: [
//                   new Paragraph({
//                     text: (index + 1).toString(),
//                     alignment: AlignmentType.CENTER,
//                   }),
//                 ],
//               }),
//               new TableCell({
//                 children: [
//                   new Paragraph({
//                     text: item.idloaisanpham.toString(),
//                     alignment: AlignmentType.CENTER,
//                   }),
//                 ],
//               }),
//               new TableCell({
//                 children: [new Paragraph({ text: item.tenloai })],
//               }),
//               new TableCell({
//                 children: [new Paragraph({ text: item.mota })],
//               }),
//             ],
//           })
//       ),
//     ];

//     // Terms and conditions
//     const termsSection = [
//       new Paragraph({ text: "" }),
//       new Paragraph({
//         children: [
//           new TextRun({
//             text: "ĐIỀU KHOẢN THỎA THUẬN:",
//             bold: true,
//             size: 24,
//           }),
//         ],
//       }),
//       new Paragraph({
//         children: [
//           new TextRun({
//             text: "1. Các loại sản phẩm được phân loại theo đúng danh mục và mô tả như đã được liệt kê.",
//             size: 24,
//           }),
//         ],
//       }),
//       new Paragraph({
//         children: [
//           new TextRun({
//             text: "2. Mọi thay đổi về thông tin loại sản phẩm cần được cập nhật và thông báo cho các bên liên quan.",
//             size: 24,
//           }),
//         ],
//       }),
//       new Paragraph({
//         children: [
//           new TextRun({
//             text: "3. Việc phân loại sản phẩm phải tuân thủ các quy định và tiêu chuẩn của đơn vị.",
//             size: 24,
//           }),
//         ],
//       }),
//       new Paragraph({
//         children: [
//           new TextRun({
//             text: "4. Danh sách này có hiệu lực kể từ ngày ký và có thể được cập nhật theo nhu cầu thực tế.",
//             size: 24,
//           }),
//         ],
//       }),
//     ];

//     // Signature section
//     const signatureSection = [
//       new Paragraph({ text: "" }),
//       new Paragraph({
//         children: [
//           new TextRun({
//             text: "NGƯỜI LẬP DANH SÁCH",
//             bold: true,
//             size: 24,
//           }),
//           new TextRun({ text: "\t\t\t\t\t\t\t\t" }),
//           new TextRun({
//             text: "NGƯỜI PHÊ DUYỆT",
//             bold: true,
//             size: 24,
//           }),
//         ],
//         alignment: AlignmentType.CENTER,
//       }),
//       new Paragraph({ text: "" }),
//       new Paragraph({
//         children: [
//           new TextRun({
//             text: "(Ký, ghi rõ họ tên)",
//             italics: true,
//             size: 20,
//           }),
//           new TextRun({ text: "\t\t\t\t\t\t\t\t\t\t\t" }),
//           new TextRun({
//             text: "(Ký, ghi rõ họ tên)",
//             italics: true,
//             size: 20,
//           }),
//         ],
//         alignment: AlignmentType.CENTER,
//       }),
//     ];

//     const doc = new Document({
//       sections: [
//         {
//           properties: {},
//           children: [
//             ...headerParagraphs,
//             new Table({
//               rows: tableRows,
//               width: { size: 100, type: WidthType.PERCENTAGE },
//             }),
//             ...termsSection,
//             ...signatureSection,
//           ],
//         },
//       ],
//     });

//     const blob = await Packer.toBlob(doc);
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `danh-sach-loai-san-pham-${day}${month}${year}.docx`;
//     link.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
//     try {
//       const file = event.target.files?.[0];
//       if (!file) {
//         console.log("Không có file được chọn");
//         return;
//       }

//       const data = await file.arrayBuffer();
//       const workbook = XLSX.read(data);
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, {
//         raw: false,
//         defval: "",
//       });

//       const formattedData = jsonData.map((item: any) => {
//         const tenloai = (
//           item["Tên loại"] ||
//           item["TÊN LOẠI"] ||
//           item["TEN LOAI"] ||
//           item["tenloai"] ||
//           item["TENLOAI"] ||
//           item["Tên Loại"] ||
//           item["3"] ||
//           ""
//         ).trim();

//         const mota = (
//           item["Mô tả"] ||
//           item["MÔ TẢ"] ||
//           item["MO TA"] ||
//           item["mota"] ||
//           item["MOTA"] ||
//           item["4"] ||
//           ""
//         ).trim();

//         return { tenloai, mota };
//       });

//       const validData = formattedData.filter(
//         (item) => item.tenloai !== "" && item.mota !== ""
//       );

//       if (validData.length === 0) {
//         toast({
//           title: "Thông báo",
//           description: "Không tìm thấy dữ liệu hợp lệ trong file Excel",
//           variant: "default",
//         });
//         return;
//       }

//       for (const item of validData) {
//         try {
//           const response = await fetch("/api/loaisanpham", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(item),
//           });

//           if (!response.ok) {
//             throw new Error(`Lỗi khi thêm "${item.tenloai}"`);
//           }
//         } catch (error) {
//           console.error(`Lỗi khi thêm "${item.tenloai}":`, error);
//         }
//       }

//       event.target.value = "";
//       onDataImported();

//       toast({
//         title: "Thành công",
//         description: `Đã nhập ${validData.length} loại sản phẩm từ file Excel`,
//         variant: "success",
//       });
//     } catch (error) {
//       console.error("Lỗi khi xử lý file:", error);
//       toast({
//         title: "Lỗi",
//         description:
//           "Có lỗi xảy ra khi nhập dữ liệu. Vui lòng kiểm tra định dạng file và thử lại",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="flex flex-wrap gap-2 my-2">
//       <Button variant="outline" onClick={exportToExcel}>
//         Xuất Excel
//       </Button>
//       <Button variant="outline" onClick={exportToPdf}>
//         Xuất PDF
//       </Button>
//       <Button variant="outline" onClick={exportSelectedToWord}>
//         Xuất Word
//       </Button>
//       <div className="relative">
//         <input
//           type="file"
//           id="fileUpload"
//           className="hidden"
//           accept=".xlsx, .xls"
//           onChange={handleFileUpload}
//         />
//         <Button
//           variant="outline"
//           onClick={() => document.getElementById("fileUpload")?.click()}
//         >
//           Nhập Excel
//         </Button>
//       </div>
//     </div>
//   );
// };

import React, { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import * as XLSX from "xlsx";
import * as QRCode from "qrcode";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  TextRun,
  AlignmentType,
  WidthType,
} from "docx";

interface LoaiSanPham {
  idloaisanpham: number;
  tenloai: string;
  mota: string;
}

interface ExcelRowData {
  [key: string]: string | number | undefined;
  "Tên loại"?: string;
  "TÊN LOẠI"?: string;
  "TEN LOAI"?: string;
  tenloai?: string;
  TENLOAI?: string;
  "Tên Loại"?: string;
  "3"?: string;
  "Mô tả"?: string;
  "MÔ TẢ"?: string;
  "MO TA"?: string;
  mota?: string;
  MOTA?: string;
  "4"?: string;
}

interface QRData {
  tieuDe: string;
  ngayXuat: string;
  tongSoMuc: number;
  danhSach: {
    id: number;
    ten: string;
    moTa: string;
  }[];
  thongTinThem: {
    thoiGianTao: string;
    soTrang: string;
    nguoiTao: string;
    maBaoCao: string;
  };
}

interface QRCodeResult {
  qrCodeDataUrl: string | null;
  qrData: QRData | null;
}

interface BulkInsertResponse {
  insertedCount: number;
  failedCount: number;
  failedItems?: { tenloai: string; mota: string; reason: string }[];
}

interface ExportOptionsProps {
  selectedItems: number[];
  loaisanphamList: LoaiSanPham[];
  onDataImported: () => void;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({
  selectedItems,
  loaisanphamList,
  onDataImported,
}) => {
  const generateQRCodeData = async (
    data: LoaiSanPham[]
  ): Promise<QRCodeResult> => {
    const currentDate = new Date();
    // Cấu trúc dữ liệu QR phù hợp với QR Scanner
    const qrData: QRData = {
      tieuDe: "Danh sách loại sản phẩm",
      ngayXuat: currentDate.toLocaleString("vi-VN"),
      tongSoMuc: data.length,
      danhSach: data.map((item) => ({
        id: item.idloaisanpham,
        ten: item.tenloai,
        moTa: item.mota,
      })),
      thongTinThem: {
        thoiGianTao: currentDate.toISOString(),
        soTrang: "1/1",
        nguoiTao: "Hệ thống quản lý",
        maBaoCao: `LSP-${Math.floor(
          Math.random() * 10000
        )}-${currentDate.getFullYear()}`,
      },
    };

    try {
      // Tạo QR code với kích thước lớn hơn và thêm margin
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 200, // Tăng kích thước
        margin: 2, // Thêm margin
        errorCorrectionLevel: "H", // Độ chính xác cao nhất
        color: {
          dark: "#000000", // Màu đen cho QR
          light: "#FFFFFF", // Màu trắng cho nền
        },
      });
      return { qrCodeDataUrl, qrData };
    } catch (err) {
      console.error("Lỗi khi tạo mã QR:", err);
      return { qrCodeDataUrl: null, qrData: null };
    }
  };

  const exportToPdf = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Thông báo",
        description: "Vui lòng chọn ít nhất một mục để xuất",
        variant: "default",
      });
      return;
    }

    const selectedData = loaisanphamList.filter((item) =>
      selectedItems.includes(item.idloaisanpham)
    );

    try {
      // Tạo mã QR và lấy dữ liệu
      const { qrCodeDataUrl, qrData } = await generateQRCodeData(selectedData);
      if (!qrCodeDataUrl) {
        throw new Error("Không thể tạo mã QR");
      }

      const response = await fetch("/api/exportpdfloaisanpham", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: selectedData,
          loaisanpham: "Danh sách loại sản phẩm",
          qrCode: qrCodeDataUrl,
          metadata: {
            ngayTao: new Date().toLocaleString("vi-VN"),
            nguoiTao: "Hệ thống",
            tongSoMuc: selectedData.length,
            qrData: JSON.stringify(qrData), // Lưu dữ liệu QR vào metadata
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi tạo PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "danh-sach-loai-san-pham.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Thành công",
        description: "Đã xuất file PDF thành công",
        variant: "success",
      });
    } catch (error) {
      console.error("Lỗi khi xuất PDF:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xuất PDF",
        variant: "destructive",
      });
    }
  };

  const exportToExcel = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Thông báo",
        description: "Vui lòng chọn ít nhất một mục để xuất",
        variant: "default",
      });
      return;
    }

    const selectedData = loaisanphamList.filter((item) =>
      selectedItems.includes(item.idloaisanpham)
    );

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      selectedData.map((item) => ({
        "Mã loại": item.idloaisanpham,
        "Tên loại": item.tenloai,
        "Mô tả": item.mota,
      }))
    );

    XLSX.utils.book_append_sheet(workbook, worksheet, "Loại sản phẩm");
    XLSX.writeFile(workbook, "danh-sach-loai-san-pham.xlsx");
  };

  const exportSelectedToWord = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Thông báo",
        description: "Vui lòng chọn ít nhất một mục để xuất",
        variant: "default",
      });
      return;
    }

    const selectedData = loaisanphamList.filter((item) =>
      selectedItems.includes(item.idloaisanpham)
    );

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    // Header paragraphs
    const headerParagraphs = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
            bold: true,
            size: 28,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Độc lập - Tự do - Hạnh phúc",
            bold: true,
            size: 28,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "------------------------",
            size: 28,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: `Ngày ${day} tháng ${month} năm ${year}`,
            italics: true,
            size: 24,
          }),
        ],
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: "THÔNG TIN DANH SÁCH LOẠI SẢN PHẨM",
            bold: true,
            size: 32,
            color: "000000",
          }),
        ],
      }),
      new Paragraph({ text: "" }),
    ];

    // Table rows
    const tableRows = [
      new TableRow({
        children: ["STT", "Mã loại", "Tên loại", "Mô tả"].map(
          (text) =>
            new TableCell({
              children: [
                new Paragraph({
                  text,
                  alignment: AlignmentType.CENTER,
                }),
              ],
              shading: {
                fill: "f5f5f5",
              },
            })
        ),
      }),
      ...selectedData.map(
        (item, index) =>
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    text: (index + 1).toString(),
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: item.idloaisanpham.toString(),
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                children: [new Paragraph({ text: item.tenloai })],
              }),
              new TableCell({
                children: [new Paragraph({ text: item.mota })],
              }),
            ],
          })
      ),
    ];

    // Terms and conditions
    const termsSection = [
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [
          new TextRun({
            text: "ĐIỀU KHOẢN THỎA THUẬN:",
            bold: true,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "1. Các loại sản phẩm được phân loại theo đúng danh mục và mô tả như đã được liệt kê.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "2. Mọi thay đổi về thông tin loại sản phẩm cần được cập nhật và thông báo cho các bên liên quan.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "3. Việc phân loại sản phẩm phải tuân thủ các quy định và tiêu chuẩn của đơn vị.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "4. Danh sách này có hiệu lực kể từ ngày ký và có thể được cập nhật theo nhu cầu thực tế.",
            size: 24,
          }),
        ],
      }),
    ];

    // Signature section
    const signatureSection = [
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [
          new TextRun({
            text: "NGƯỜI LẬP DANH SÁCH",
            bold: true,
            size: 24,
          }),
          new TextRun({ text: "\t\t\t\t\t\t\t\t" }),
          new TextRun({
            text: "NGƯỜI PHÊ DUYỆT",
            bold: true,
            size: 24,
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({ text: "" }),
      new Paragraph({
        children: [
          new TextRun({
            text: "(Ký, ghi rõ họ tên)",
            italics: true,
            size: 20,
          }),
          new TextRun({ text: "\t\t\t\t\t\t\t\t\t\t\t" }),
          new TextRun({
            text: "(Ký, ghi rõ họ tên)",
            italics: true,
            size: 20,
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
    ];

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            ...headerParagraphs,
            new Table({
              rows: tableRows,
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),
            ...termsSection,
            ...signatureSection,
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `danh-sach-loai-san-pham-${day}${month}${year}.docx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) {
        console.log("Không có file được chọn");
        return;
      }

      // Hiển thị thông báo đang xử lý
      toast({
        title: "Đang xử lý",
        description: "Đang đọc dữ liệu từ file Excel...",
        variant: "default",
      });

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<ExcelRowData>(worksheet, {
        raw: false,
        defval: "",
      });

      // Chuyển đổi dữ liệu thành định dạng phù hợp
      const formattedData = jsonData.map((item: ExcelRowData) => {
        const tenloai = (
          item["Tên loại"] ||
          item["TÊN LOẠI"] ||
          item["TEN LOAI"] ||
          item["tenloai"] ||
          item["TENLOAI"] ||
          item["Tên Loại"] ||
          item["3"] ||
          ""
        )
          .toString()
          .trim();

        const mota = (
          item["Mô tả"] ||
          item["MÔ TẢ"] ||
          item["MO TA"] ||
          item["mota"] ||
          item["MOTA"] ||
          item["4"] ||
          ""
        )
          .toString()
          .trim();

        return { tenloai, mota };
      });

      // Kiểm tra dữ liệu hợp lệ
      const validData = formattedData.filter(
        (item) => item.tenloai !== "" && item.mota !== ""
      );

      if (validData.length === 0) {
        toast({
          title: "Thông báo",
          description: "Không tìm thấy dữ liệu hợp lệ trong file Excel",
          variant: "default",
        });
        return;
      }

      // Thực hiện bulk insert thay vì insert từng bản ghi
      try {
        const response = await fetch("/api/loaisanpham/bulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: validData,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Lỗi khi nhập dữ liệu");
        }

        // Lấy kết quả trả về
        const result = (await response.json()) as BulkInsertResponse;

        // Reset input file
        event.target.value = "";

        // Cập nhật giao diện
        onDataImported();

        // Thông báo chi tiết
        toast({
          title: "Nhập dữ liệu thành công",
          description: `Đã nhập ${result.insertedCount} loại sản phẩm từ ${
            validData.length
          } bản ghi${
            result.failedCount > 0
              ? `. ${result.failedCount} bản ghi bị bỏ qua do trùng lặp hoặc không hợp lệ.`
              : ""
          }`,
          variant: "success",
        });

        // Nếu có lỗi, hiển thị thêm thông tin chi tiết trong console
        if (result.failedCount > 0 && result.failedItems) {
          console.info("Các bản ghi không thể nhập:", result.failedItems);
        }
      } catch (error: unknown) {
        console.error("Lỗi khi bulk insert:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi nhập dữ liệu";
        toast({
          title: "Lỗi",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Lỗi khi xử lý file:", error);
      toast({
        title: "Lỗi",
        description:
          "Có lỗi xảy ra khi đọc file Excel. Vui lòng kiểm tra định dạng file và thử lại",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex flex-wrap gap-2 my-2">
      <Button variant="outline" onClick={exportToExcel}>
        Xuất Excel
      </Button>
      <Button variant="outline" onClick={exportToPdf}>
        Xuất PDF
      </Button>
      <Button variant="outline" onClick={exportSelectedToWord}>
        Xuất Word
      </Button>
      <div className="relative">
        <input
          type="file"
          id="fileUpload"
          className="hidden"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById("fileUpload")?.click()}
        >
          Nhập Excel
        </Button>
      </div>
    </div>
  );
};
