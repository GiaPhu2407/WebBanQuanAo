import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface NhaCungCap {
  idnhacungcap: number;
  tennhacungcap: string;
  sodienthoai: string;
  diachi: string;
  email: string;
  trangthai: boolean;
}

export const exportToPDF = (data: NhaCungCap[]) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Add Times New Roman font for better Vietnamese support
  doc.setFont('times', 'bold');
  
  // Header
  doc.setFontSize(18);
  doc.text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', doc.internal.pageSize.width / 2, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text('Độc lập - Tự do - Hạnh phúc', doc.internal.pageSize.width / 2, 30, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.line(70, 35, doc.internal.pageSize.width - 70, 35);

  // Date
  const currentDate = new Date();
  const dateStr = `Ngày ${currentDate.getDate()} tháng ${currentDate.getMonth() + 1} năm ${currentDate.getFullYear()}`;
  doc.setFont('times', 'italic');
  doc.setFontSize(12);
  doc.text(dateStr, doc.internal.pageSize.width - 20, 45, { align: 'right' });

  // Title
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.text('DANH SÁCH NHÀ CUNG CẤP', doc.internal.pageSize.width / 2, 60, { align: 'center' });

  // Table data
  const tableData = data.map((item, index) => [
    index + 1,
    item.idnhacungcap,
    item.tennhacungcap,
    item.sodienthoai,
    item.diachi,
    item.email,
    item.trangthai ? 'Đang cung cấp' : 'Ngừng cung cấp'
  ]);

  // Table
  autoTable(doc, {
    head: [['STT', 'Mã NCC', 'Tên nhà cung cấp', 'Số điện thoại', 'Địa chỉ', 'Email', 'Trạng thái']],
    body: tableData,
    startY: 70,
    headStyles: {
      fillColor: [48, 77, 109],
      textColor: 255,
      fontSize: 12,
      halign: 'center',
      font: 'times',
      fontStyle: 'bold',
      cellPadding: 3
    },
    bodyStyles: {
      fontSize: 11,
      font: 'times',
      lineWidth: 0.5,
      cellPadding: 3,
      valign: 'middle'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { halign: 'center', cellWidth: 20 },
      2: { cellWidth: 45 },
      3: { cellWidth: 25 },
      4: { cellWidth: 35 },
      5: { cellWidth: 35 },
      6: { halign: 'center', cellWidth: 25 }
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 10, left: 10, right: 10, bottom: 10 },
    theme: 'grid',
    tableWidth: 'auto',
    styles: {
      overflow: 'linebreak',
      cellWidth: 'wrap',
      fontSize: 11,
      cellPadding: 3,
      halign: 'left',
      valign: 'middle',
      lineWidth: 0.5
    },
    didDrawPage: function(data) {
      // Add page number at the bottom
      doc.setFontSize(10);
      doc.text(
        `Trang ${doc.getCurrentPageInfo().pageNumber}/${doc.getNumberOfPages()}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
  });

  // Save
  const fileName = `danh-sach-nha-cung-cap-${currentDate.getDate()}${currentDate.getMonth() + 1}${currentDate.getFullYear()}.pdf`;
  doc.save(fileName);
};