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
import { Product } from "@/app/Admin/DashBoard/ProductManager/type/product";

interface ExportProductOptionsProps {
  selectedItems: number[];
  productList: Product[];
  onDataImported: () => void;
}

export const ExportProductOptions: React.FC<ExportProductOptionsProps> = ({
  selectedItems,
  productList,
  onDataImported,
}) => {
  const exportToExcel = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Thông báo",
        description: "Vui lòng chọn ít nhất một mục để xuất",
        variant: "default",
      });
      return;
    }

    const selectedData = productList.filter((item) =>
      selectedItems.includes(item.idsanpham)
    );

    // Format data for Excel
    const excelData = selectedData.map((item) => {
      // Properly format size information
      const sizes =
        item.ProductSizes && item.ProductSizes.length > 0
          ? item.ProductSizes.map(
              (ps) =>
                `${ps.size?.tenSize || `Size ${ps.idSize}`}: ${ps.soluong}`
            ).join(", ")
          : "";

      return {
        "Mã SP": item.idsanpham,
        "Tên sản phẩm": item.tensanpham,
        "Loại sản phẩm": item.loaisanpham?.tenloai || "",
        Giá: Number(item.gia).toLocaleString("vi-VN") + " VNĐ",
        "Giảm giá": item.giamgia + "%",
        "Màu sắc": item.mausac || "",
        "Giới tính": item.gioitinh ? "Nam" : "Nữ",
        Size: sizes,
        "Mô tả": item.mota,
        "Hình ảnh": item.hinhanh,
      };
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 10 }, // Mã SP
      { wch: 30 }, // Tên sản phẩm
      { wch: 20 }, // Loại sản phẩm
      { wch: 15 }, // Giá
      { wch: 10 }, // Giảm giá
      { wch: 15 }, // Màu sắc
      { wch: 10 }, // Giới tính
      { wch: 30 }, // Size
      { wch: 40 }, // Mô tả
      { wch: 50 }, // Hình ảnh
    ];
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sản phẩm");
    XLSX.writeFile(workbook, "danh-sach-san-pham.xlsx");
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

    const selectedData = productList.filter((item) =>
      selectedItems.includes(item.idsanpham)
    );

    try {
      const response = await fetch("/api/exportpdfproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: selectedData,
          title: "Danh sách sản phẩm",
        }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi tạo PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "danh-sach-san-pham.pdf";
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

  const exportSelectedToWord = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Thông báo",
        description: "Vui lòng chọn ít nhất một mục để xuất",
        variant: "default",
      });
      return;
    }

    const selectedData = productList.filter((item) =>
      selectedItems.includes(item.idsanpham)
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
            text: "THÔNG TIN DANH SÁCH SẢN PHẨM",
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
          "Mã SP",
          "Tên sản phẩm",
          "Loại SP",
          "Giá",
          "Giảm giá",
          "Màu sắc",
          "Giới tính",
          "Size",
          "Mô tả",
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
                    text: item.idsanpham.toString(),
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                children: [new Paragraph({ text: item.tensanpham || "" })],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: item.loaisanpham?.tenloai || "",
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: Number(item.gia).toLocaleString("vi-VN") + " VNĐ",
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: (item.giamgia || 0) + "%",
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: item.mausac || "",
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: item.gioitinh ? "Nam" : "Nữ",
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text:
                      item.ProductSizes && item.ProductSizes.length > 0
                        ? item.ProductSizes.map(
                            (ps) =>
                              `${ps.size?.tenSize || `Size ${ps.idSize}`}: ${
                                ps.soluong
                              }`
                          ).join(", ")
                        : "",
                  }),
                ],
              }),
              new TableCell({
                children: [new Paragraph({ text: item.mota || "" })],
              }),
            ],
          })
      ),
    ];

    // Product images section
    const productImagesSection = [];
    for (const item of selectedData) {
      productImagesSection.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Hình ảnh sản phẩm: ${item.tensanpham}`,
              bold: true,
              size: 24,
              break: 1,
            }),
          ],
        })
      );

      // Add image URL as text since we can't directly embed external images
      productImagesSection.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `URL hình ảnh: ${item.hinhanh || ""}`,
              size: 20,
            }),
          ],
        })
      );

      // Add size information
      productImagesSection.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Size: ${
                item.ProductSizes && item.ProductSizes.length > 0
                  ? item.ProductSizes.map(
                      (ps) =>
                        `${ps.size?.tenSize || `Size ${ps.idSize}`}: ${
                          ps.soluong
                        }`
                    ).join(", ")
                  : "Không có thông tin size"
              }`,
              size: 20,
            }),
          ],
        })
      );

      productImagesSection.push(new Paragraph({ text: "" }));
    }

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
            text: "1. Các sản phẩm được liệt kê theo đúng thông tin và mô tả như đã được nêu.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "2. Mọi thay đổi về thông tin sản phẩm cần được cập nhật và thông báo cho các bên liên quan.",
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "3. Giá sản phẩm có thể thay đổi theo chính sách của đơn vị.",
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
            ...productImagesSection,
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
    link.download = `danh-sach-san-pham-${day}${month}${year}.docx`;
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

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        defval: "",
      });

      const formattedData = jsonData.map((item: any) => {
        const tensanpham = (
          item["Tên sản phẩm"] ||
          item["TÊN SẢN PHẨM"] ||
          item["tensanpham"] ||
          item["TENSANPHAM"] ||
          ""
        ).trim();

        const gia = (
          item["Giá"] ||
          item["GIÁ"] ||
          item["gia"] ||
          item["GIA"] ||
          "0"
        )
          .toString()
          .replace(/[^\d]/g, "");

        const mota = (
          item["Mô tả"] ||
          item["MÔ TẢ"] ||
          item["mota"] ||
          item["MOTA"] ||
          ""
        ).trim();

        const idloaisanpham = (
          item["ID Loại sản phẩm"] ||
          item["idloaisanpham"] ||
          item["IDLOAISANPHAM"] ||
          "1"
        ).toString();

        const giamgia = parseInt(
          (
            item["Giảm giá"] ||
            item["GIẢM GIÁ"] ||
            item["giamgia"] ||
            item["GIAMGIA"] ||
            "0"
          )
            .toString()
            .replace(/[^\d]/g, "")
        );

        const mausac = (
          item["Màu sắc"] ||
          item["MÀU SẮC"] ||
          item["mausac"] ||
          item["MAUSAC"] ||
          ""
        ).trim();

        const gioitinh =
          (
            item["Giới tính"] ||
            item["GIỚI TÍNH"] ||
            item["gioitinh"] ||
            item["GIOITINH"] ||
            "Nam"
          )
            .trim()
            .toLowerCase() === "nam";

        const hinhanh = (
          item["Hình ảnh"] ||
          item["HÌNH ẢNH"] ||
          item["hinhanh"] ||
          item["HINHANH"] ||
          ""
        ).trim();

        return {
          tensanpham,
          gia,
          mota,
          idloaisanpham,
          giamgia,
          mausac,
          gioitinh,
          hinhanh,
        };
      });

      const validData = formattedData.filter(
        (item) => item.tensanpham !== "" && item.gia !== ""
      );

      if (validData.length === 0) {
        toast({
          title: "Thông báo",
          description: "Không tìm thấy dữ liệu hợp lệ trong file Excel",
          variant: "default",
        });
        return;
      }

      for (const item of validData) {
        try {
          const response = await fetch("/api/sanpham", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
          });

          if (!response.ok) {
            throw new Error(`Lỗi khi thêm "${item.tensanpham}"`);
          }
        } catch (error) {
          console.error(`Lỗi khi thêm "${item.tensanpham}":`, error);
        }
      }

      event.target.value = "";
      onDataImported();

      toast({
        title: "Thành công",
        description: `Đã nhập ${validData.length} sản phẩm từ file Excel`,
        variant: "success",
      });
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
      <Button onClick={exportSelectedToWord} variant="outline">
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

export default ExportProductOptions;
