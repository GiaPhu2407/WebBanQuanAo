import React, { useState } from "react";
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
  selectedItems?: number[];
  onDataImported?: () => void;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({
  data,
  selectedItems = [],
  onDataImported = () => {},
}) => {
  const exportToExcel = () => {
    const dataToExport =
      selectedItems.length > 0
        ? data.filter((item) => selectedItems.includes(item.idnhacungcap))
        : data;

    if (dataToExport.length === 0) {
      toast({
        title: "Thông báo",
        description:
          selectedItems.length > 0
            ? "Vui lòng chọn ít nhất một nhà cung cấp để xuất"
            : "Không có dữ liệu để xuất",
        variant: "default",
      });
      return;
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      dataToExport.map((item) => ({
        "Mã nhà cung cấp": item.idnhacungcap,
        "Tên nhà cung cấp": item.tennhacungcap,
        "Số điện thoại": item.sodienthoai,
        "Địa chỉ": item.diachi,
        Email: item.email,
        "Trạng thái": item.trangthai ? "Đang cung cấp" : "Ngừng cung cấp",
      }))
    );

    XLSX.utils.book_append_sheet(workbook, worksheet, "Nhà cung cấp");
    XLSX.writeFile(workbook, "danh-sach-nha-cung-cap.xlsx");
  };

  const exportToPdf = async () => {
    const dataToExport =
      selectedItems.length > 0
        ? data.filter((item) => selectedItems.includes(item.idnhacungcap))
        : data;

    if (dataToExport.length === 0) {
      toast({
        title: "Thông báo",
        description:
          selectedItems.length > 0
            ? "Vui lòng chọn ít nhất một nhà cung cấp để xuất"
            : "Không có dữ liệu để xuất",
        variant: "default",
      });
      return;
    }

    try {
      const response = await fetch("/api/exportpdfncc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: dataToExport,
          title: "Danh sách nhà cung cấp",
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

  const exportToWord = async () => {
    const dataToExport =
      selectedItems.length > 0
        ? data.filter((item) => selectedItems.includes(item.idnhacungcap))
        : data;

    if (dataToExport.length === 0) {
      toast({
        title: "Thông báo",
        description:
          selectedItems.length > 0
            ? "Vui lòng chọn ít nhất một nhà cung cấp để xuất"
            : "Không có dữ liệu để xuất",
        variant: "default",
      });
      return;
    }

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

    // Table rows
    const tableRows = [
      new TableRow({
        children: [
          "STT",
          "Mã NCC",
          "Tên nhà cung cấp",
          "Số điện thoại",
          "Địa chỉ",
          "Email",
          "Trạng thái",
        ].map(
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
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) {
        console.log("Không có file được chọn");
        return;
      }

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

        if (!isEmailValid || !isPhoneValid) {
          console.log(
            `Bỏ qua dữ liệu không hợp lệ: ${item.tennhacungcap} - Email: ${
              isEmailValid ? "Hợp lệ" : "Không hợp lệ"
            }, SĐT: ${isPhoneValid ? "Hợp lệ" : "Không hợp lệ"}`
          );
          return false;
        }
        return true;
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

      let successCount = 0;
      let errorCount = 0;

      for (const item of validatedData) {
        try {
          const response = await fetch("/api/nhacungcap", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
          });

          if (!response.ok) {
            errorCount++;
            console.error(
              `Lỗi khi thêm "${item.tennhacungcap}": ${response.statusText}`
            );
          } else {
            successCount++;
          }
        } catch (error) {
          errorCount++;
          console.error(`Lỗi khi thêm "${item.tennhacungcap}":`, error);
        }
      }

      e.target.value = "";

      toast({
        title: "Thành công",
        description: `Đã nhập ${successCount} nhà cung cấp từ file Excel${
          errorCount > 0 ? `, ${errorCount} lỗi` : ""
        }`,
        variant: "success",
      });

      // Call the callback to refresh data
      onDataImported();
    } catch (error) {
      console.error("Lỗi khi xử lý file:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi nhập dữ liệu. Vui lòng kiểm tra lại.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex space-x-2">
      <Button onClick={exportToWord} variant="outline">
        Xuất Word
      </Button>
      <Button onClick={exportToExcel} variant="outline">
        Xuất Excel
      </Button>
      <Button onClick={exportToPdf} variant="outline">
        Xuất PDF
      </Button>
      <label className="cursor-pointer">
        <Button variant="secondary" asChild>
          <span>Nhập Excel</span>
        </Button>
        <input
          type="file"
          accept=".xlsx, .xls"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
};

export default ExportButtons;
