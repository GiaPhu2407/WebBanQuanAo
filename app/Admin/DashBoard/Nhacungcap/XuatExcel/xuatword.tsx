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
  TabStopType,
  TabStop,
} from "docx";
import { saveAs } from "file-saver";

interface NhaCungCap {
  idnhacungcap: number;
  tennhacungcap: string;
  sodienthoai: string;
  diachi: string;
  email: string;
  trangthai: boolean;
}

export const exportToWord = async (data: NhaCungCap[]) => {
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
          text: "THÔNG TIN DANH SÁCH NHÀ CUNG CẤP",
          bold: true,
          size: 32,
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
            new TableCell({ children: [new Paragraph({ text: item.diachi })] }),
            new TableCell({ children: [new Paragraph({ text: item.email })] }),
            new TableCell({
              children: [
                new Paragraph({
                  text: item.trangthai ? "Đang cung cấp" : "Ngừng cung cấp",
                  alignment: AlignmentType.CENTER,
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
          text: "ĐẠI DIỆN ĐƠN VỊ QUẢN LÝ",
          bold: true,
          size: 24,
        }),
        new TextRun({ text: "\t\t\t\t\t\t\t\t" }),
        new TextRun({
          text: "ĐẠI DIỆN NHÀ CUNG CẤP",
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
  saveAs(blob, `danh-sach-nha-cung-cap-${day}${month}${year}.docx`);
};
