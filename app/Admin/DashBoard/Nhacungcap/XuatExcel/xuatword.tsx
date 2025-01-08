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
          text: "DANH SÁCH NHÀ CUNG CẤP",
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
              fill: "CCCCCC",
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

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          ...headerParagraphs,
          new Table({
            rows: tableRows,
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
