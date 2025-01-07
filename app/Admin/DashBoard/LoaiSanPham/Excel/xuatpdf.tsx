// exportToPDF.ts
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { LoaiSanPham } from '@/app/Admin/DashBoard/LoaiSanPham/Excel/type';

export const exportLoaiSanPhamToPDF = (data: LoaiSanPham[]) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text('Danh Sách Loại Sản Phẩm', 14, 20);

  // Create table
  (doc as any).autoTable({
    startY: 30,
    head: [['Mã Loại', 'Tên Loại', 'Mô Tả']],
    body: data.map(item => [
      item.idloaisanpham,
      item.tenloai,
      item.mota
    ]),
    styles: { 
      fontSize: 10, 
      cellPadding: 5 
    },
    headStyles: { 
      fillColor: [41, 128, 185], 
      textColor: 255 
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 30 }
  });

  // Save the PDF
  doc.save(`loai_san_pham_${new Date().toISOString().split('T')[0]}.pdf`);
};

export default exportLoaiSanPhamToPDF;