import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  AlignmentType,
  TextRun,
  HeadingLevel,
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
  // Get current date
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  // Create header paragraphs
  const headerParagraphs = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Độc lập - Tự do - Hạnh phúc",
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "------------------------",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: `Ngày ${day} tháng ${month} năm ${year}`,
          italics: true,
        }),
      ],
    }),
    new Paragraph({
      text: "",
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: "DANH SÁCH NHÀ CUNG CẤP",
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      text: "",
    }),
  ];

  // Create table rows
  const rows = [
    // Header row
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
              fill: "2B579A",
              color: "2B579A",
            },
          })
      ),
    }),
    // Data rows
    ...data.map(
      (item, index) =>
        new TableRow({
          children: [
            (index + 1).toString(),
            item.idnhacungcap.toString(),
            item.tennhacungcap,
            item.sodienthoai,
            item.diachi,
            item.email,
            item.trangthai ? "Đang cung cấp" : "Ngừng cung cấp",
          ].map(
            (text, cellIndex) =>
              new TableCell({
                children: [
                  new Paragraph({
                    text,
                    alignment: cellIndex === 0 || cellIndex === 1 
                      ? AlignmentType.CENTER 
                      : AlignmentType.LEFT,
                  }),
                ],
              })
          ),
        })
    ),
  ];

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          ...headerParagraphs,
          new Table({
            rows,
            width: {
              size: 100,
              type: "pct",
            },
          }),
        ],
      },
    ],
  });

  // Generate and save document
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `danh-sach-nha-cung-cap-${day}${month}${year}.docx`);
};