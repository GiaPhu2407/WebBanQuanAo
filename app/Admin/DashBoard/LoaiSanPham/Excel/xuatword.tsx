import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  TextRun,
  HeadingLevel,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";

interface LoaiSanPham {
  idloaisanpham: number;
  tenloai: string;
  mota: string;
}

export const exportLoaiSanPhamToWord = async (data: LoaiSanPham[]) => {
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
          color: "000000", // Màu đen
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
    ...data.map(
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

  // Create document
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

  // Generate and save document
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `danh-sach-loai-san-pham-${day}${month}${year}.docx`);
};
