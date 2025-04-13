import React, { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import * as XLSX from "xlsx";
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
  selectedItems: number[];
  onDataImported: () => void;
  onSelectAll: () => void;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({
  data,
  selectedItems,
  onDataImported,
  onSelectAll,
}) => {
  const requireSelection = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Cần chọn dữ liệu",
        description: "Vui lòng chọn ít nhất một nhà cung cấp để xuất",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const exportToExcel = () => {
    if (!requireSelection()) return;

    const dataToExport = data.filter((item) =>
      selectedItems.includes(item.idnhacungcap)
    );

    // Create a workbook and worksheet
    const workbook = XLSX.utils.book_new();

    // Prepare data with transformed headers
    const wsData = dataToExport.map((item) => ({
      "Mã nhà cung cấp": item.idnhacungcap,
      "Tên nhà cung cấp": item.tennhacungcap,
      "Số điện thoại": item.sodienthoai,
      "Địa chỉ": item.diachi,
      Email: item.email,
      "Trạng thái": item.trangthai ? "Đang cung cấp" : "Ngừng cung cấp",
    }));

    const worksheet = XLSX.utils.json_to_sheet(wsData);

    // Set column widths to add more spacing
    const colWidths = [
      { wch: 20 }, // Mã nhà cung cấp
      { wch: 30 }, // Tên nhà cung cấp
      { wch: 20 }, // Số điện thoại
      { wch: 35 }, // Địa chỉ
      { wch: 25 }, // Email
      { wch: 18 }, // Trạng thái
    ];

    worksheet["!cols"] = colWidths;

    // Make ALL headers bold
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:F1");

    // Apply bold formatting to all headers
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      const cell = worksheet[cellAddress];

      if (!cell) continue;

      // Apply bold formatting to all headers
      if (!cell.s) cell.s = {};
      cell.s.font = { bold: true, sz: 14 };
      cell.s.fill = { fgColor: { rgb: "E6F0FF" } }; // Light blue background for all headers
      cell.s.alignment = { horizontal: "center" };
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Nhà cung cấp");
    XLSX.writeFile(workbook, "danh-sach-nha-cung-cap.xlsx");

    toast({
      title: "Thành công",
      description: `Đã xuất ${dataToExport.length} nhà cung cấp sang Excel`,
      variant: "success",
    });
  };

  const exportToPdf = async () => {
    if (!requireSelection()) return;

    const dataToExport = data.filter((item) =>
      selectedItems.includes(item.idnhacungcap)
    );

    try {
      // Chỉnh API để xử lý các tiêu đề in đậm
      const response = await fetch("/api/exportpdfncc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: dataToExport,
          title: "Danh sách nhà cung cấp",
          boldHeaders: true, // Thêm tùy chọn in đậm tiêu đề
        }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi tạo PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "danh-sach-nha-cung-cap.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Thành công",
        description: `Đã xuất ${dataToExport.length} nhà cung cấp sang PDF`,
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

  const exportToWord = async () => {
    if (!requireSelection()) return;

    const dataToExport = data.filter((item) =>
      selectedItems.includes(item.idnhacungcap)
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
            text: "DANH SÁCH NHÀ CUNG CẤP",
            bold: true,
            size: 32,
            color: "000000",
          }),
        ],
      }),
      new Paragraph({ text: "" }),
    ];

    // Table rows với tất cả các tiêu đề in đậm
    const tableRows = [
      new TableRow({
        children: [
          // Header cells with adjusted widths and ALL BOLD
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "STT",
                    bold: true,
                    size: 24,
                  }),
                ],
              }),
            ],
            shading: {
              fill: "f5f5f5",
            },
            width: {
              size: 800,
              type: WidthType.DXA,
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Mã nhà cung cấp",
                    bold: true,
                    size: 24,
                  }),
                ],
              }),
            ],
            shading: {
              fill: "f5f5f5",
            },
            width: {
              size: 1800,
              type: WidthType.DXA,
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Tên nhà cung cấp",
                    bold: true,
                    size: 24,
                  }),
                ],
              }),
            ],
            shading: {
              fill: "f5f5f5",
            },
            width: {
              size: 3000,
              type: WidthType.DXA,
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Số điện thoại",
                    bold: true,
                    size: 24,
                  }),
                ],
              }),
            ],
            shading: {
              fill: "f5f5f5",
            },
            width: {
              size: 2000,
              type: WidthType.DXA,
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Địa chỉ",
                    bold: true,
                    size: 24,
                  }),
                ],
              }),
            ],
            shading: {
              fill: "f5f5f5",
            },
            width: {
              size: 3000,
              type: WidthType.DXA,
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Email",
                    bold: true,
                    size: 24,
                  }),
                ],
              }),
            ],
            shading: {
              fill: "f5f5f5",
            },
            width: {
              size: 2500,
              type: WidthType.DXA,
            },
          }),
          new TableCell({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Trạng thái",
                    bold: true,
                    size: 24,
                  }),
                ],
              }),
            ],
            shading: {
              fill: "f5f5f5",
            },
            width: {
              size: 2000,
              type: WidthType.DXA,
            },
          }),
        ],
      }),
      // Data rows
      ...dataToExport.map(
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
                    text: item.idnhacungcap.toString(),
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                children: [new Paragraph({ text: item.tennhacungcap })],
              }),
              new TableCell({
                children: [new Paragraph({ text: item.sodienthoai })],
              }),
              new TableCell({
                children: [new Paragraph({ text: item.diachi })],
              }),
              new TableCell({
                children: [new Paragraph({ text: item.email })],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: item.trangthai ? "Đang cung cấp" : "Ngừng cung cấp",
                  }),
                ],
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
            text: "1. Nhà cung cấp cam kết cung cấp đúng và đầy đủ thông tin như đã được liệt kê trong danh sách trên.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "2. Mọi thay đổi về thông tin liên hệ cần được thông báo bằng văn bản cho đơn vị quản lý trong vòng 07 ngày làm việc.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "3. Nhà cung cấp có trách nhiệm duy trì chất lượng dịch vụ và tuân thủ các quy định của đơn vị quản lý.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "4. Các bên cam kết thực hiện đúng các điều khoản đã thỏa thuận.",
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
    link.download = `danh-sach-nha-cung-cap-${day}${month}${year}.docx`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Thành công",
      description: `Đã xuất ${dataToExport.length} nhà cung cấp sang Word`,
      variant: "success",
    });
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
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        defval: "",
      });

      const formattedData = jsonData.map((item: any) => {
        const tennhacungcap = (
          item["Tên nhà cung cấp"] ||
          item["TÊN NHÀ CUNG CẤP"] ||
          item["tennhacungcap"] ||
          item["TENNHACUNGCAP"] ||
          item["Tên Nhà Cung Cấp"] ||
          ""
        ).trim();

        const sodienthoai = (
          item["Số điện thoại"] ||
          item["SỐ ĐIỆN THOẠI"] ||
          item["sodienthoai"] ||
          item["SODIENTHOAI"] ||
          item["Số Điện Thoại"] ||
          ""
        ).trim();

        const diachi = (
          item["Địa chỉ"] ||
          item["ĐỊA CHỈ"] ||
          item["diachi"] ||
          item["DIACHI"] ||
          item["Địa Chỉ"] ||
          ""
        ).trim();

        const email = (
          item["Email"] ||
          item["EMAIL"] ||
          item["email"] ||
          ""
        ).trim();

        const trangthai = (
          item["Trạng thái"] ||
          item["TRẠNG THÁI"] ||
          item["trangthai"] ||
          item["TRANGTHAI"] ||
          item["Trạng Thái"] ||
          "Đang cung cấp"
        ).trim();

        return {
          tennhacungcap,
          sodienthoai,
          diachi,
          email,
          trangthai:
            trangthai === "Đang cung cấp" ||
            trangthai === "true" ||
            trangthai === "True",
        };
      });

      // Kiểm tra dữ liệu hợp lệ cơ bản
      const validData = formattedData.filter(
        (item) =>
          item.tennhacungcap !== "" &&
          item.sodienthoai !== "" &&
          item.diachi !== "" &&
          item.email !== ""
      );

      if (validData.length === 0) {
        toast({
          title: "Thông báo",
          description: "Không tìm thấy dữ liệu hợp lệ trong file Excel",
          variant: "default",
        });
        return;
      }

      // Validate email and phone
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

      const validatedData = validData.filter((item) => {
        const isEmailValid = emailRegex.test(item.email);
        const isPhoneValid = phoneRegex.test(item.sodienthoai);
        return isEmailValid && isPhoneValid;
      });

      if (validatedData.length === 0) {
        toast({
          title: "Thông báo",
          description:
            "Không có dữ liệu hợp lệ sau khi kiểm tra định dạng email và số điện thoại",
          variant: "default",
        });
        return;
      }

      // Thực hiện bulk insert thay vì từng bản ghi một
      try {
        const response = await fetch("/api/nhacungcap/bulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: validatedData,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Lỗi khi nhập dữ liệu");
        }

        // Lấy kết quả trả về
        const result = await response.json();

        // Reset input file
        event.target.value = "";

        // Cập nhật giao diện
        onDataImported();

        // Thông báo chi tiết
        toast({
          title: "Nhập dữ liệu thành công",
          description: `Đã nhập ${result.insertedCount} nhà cung cấp từ ${
            validatedData.length
          } bản ghi${
            result.failedCount > 0
              ? `. ${result.failedCount} bản ghi bị bỏ qua do trùng lặp hoặc không hợp lệ.`
              : ""
          }`,
          variant: "success",
        });

        // Nếu có lỗi, hiển thị thêm thông tin chi tiết trong console
        if (result.failedCount > 0) {
          console.info("Các bản ghi không thể nhập:", result.failedItems);
        }
      } catch (error: any) {
        console.error("Lỗi khi bulk insert:", error);
        toast({
          title: "Lỗi",
          description: error.message || "Có lỗi xảy ra khi nhập dữ liệu",
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
      <Button
        variant="secondary"
        onClick={onSelectAll}
        className="bg-blue-100 hover:bg-blue-200"
      >
        Chọn tất cả
      </Button>
      <Button
        variant="outline"
        onClick={exportToExcel}
        disabled={selectedItems.length === 0}
      >
        Xuất Excel ({selectedItems.length})
      </Button>
      <Button
        variant="outline"
        onClick={exportToPdf}
        disabled={selectedItems.length === 0}
      >
        Xuất PDF ({selectedItems.length})
      </Button>
      <Button
        variant="outline"
        onClick={exportToWord}
        disabled={selectedItems.length === 0}
      >
        Xuất Word ({selectedItems.length})
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

export default ExportButtons;
