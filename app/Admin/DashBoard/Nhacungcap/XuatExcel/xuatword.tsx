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
          text: "HỢP ĐỒNG CUNG CẤP SẢN PHẨM",
          bold: true,
          size: 32,
        }),
      ],
    }),
    new Paragraph({ text: "" }),
  ];

  // Contract content
  const contractContent = [
    new Paragraph({
      children: [
        new TextRun({
          text: "Hợp đồng này được ký kết giữa Công ty chúng tôi và các Nhà cung cấp dưới đây. Hai bên cam kết thực hiện đúng các điều khoản của hợp đồng, tuân thủ các quy định của pháp luật hiện hành.",
          size: 24,
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
              children: [new Paragraph({ text: item.idnhacungcap.toString() })],
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
                }),
              ],
            }),
          ],
        })
    ),
  ];

  // Signature section
  const signatureSection = [
    new Paragraph({ text: "" }),
    new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "ĐẠI DIỆN NGƯỜI MUA",
                      bold: true,
                      size: 24,
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "(Ký và ghi rõ họ tên)",
                      italics: true,
                      size: 20,
                    }),
                  ],
                }),
              ],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "ĐẠI DIỆN CÔNG TY",
                      bold: true,
                      size: 24,
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "(Ký và ghi rõ họ tên)",
                      italics: true,
                      size: 20,
                    }),
                  ],
                }),
              ],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
      ],
      width: { size: 100, type: WidthType.PERCENTAGE },
    }),
  ];

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          ...headerParagraphs,
          ...contractContent,
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
          ...signatureSection,
        ],
      },
    ],
  });

  // Generate and save document
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `hop-dong-nha-cung-cap-${day}${month}${year}.docx`);
};
