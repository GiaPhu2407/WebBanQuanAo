// exportToWord.ts
import { Document, Packer, Paragraph, Table, TableRow, TableCell, HeadingLevel, BorderStyle } from 'docx';
import { LoaiSanPham } from '@/app/Admin/DashBoard/LoaiSanPham/Excel/type';

export const exportLoaiSanPhamToWord = async (data: LoaiSanPham[]) => {
  // Create new document
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: 'Danh Sách Loại Sản Phẩm',
          heading: HeadingLevel.HEADING_1,
          spacing: {
            after: 200
          }
        }),
        new Table({
          width: {
            size: 100,
            type: 'pct',
          },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  children: [new Paragraph('Mã Loại')],
                  width: {
                    size: 20,
                    type: 'pct',
                  },
                }),
                new TableCell({
                  children: [new Paragraph('Tên Loại')],
                  width: {
                    size: 40,
                    type: 'pct',
                  },
                }),
                new TableCell({
                  children: [new Paragraph('Mô Tả')],
                  width: {
                    size: 40,
                    type: 'pct',
                  },
                })
              ]
            }),
            ...data.map(item => 
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph(item.idloaisanpham.toString())],
                    width: {
                      size: 20,
                      type: 'pct',
                    },
                  }),
                  new TableCell({
                    children: [new Paragraph(item.tenloai)],
                    width: {
                      size: 40,
                      type: 'pct',
                    },
                  }),
                  new TableCell({
                    children: [new Paragraph(item.mota)],
                    width: {
                      size: 40,
                      type: 'pct',
                    },
                  })
                ]
              })
            )
          ]
        })
      ]
    }]
  });

  // Generate and save document
  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `loai_san_pham_${new Date().toISOString().split('T')[0]}.docx`;
  link.click();
};