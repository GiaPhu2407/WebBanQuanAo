import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface NhaCungCap {
  idnhacungcap: number;
  tennhacungcap: string;
  sodienthoai: string;
  diachi: string;
  email: string;
  trangthai: boolean;
}

export const exportToPDF = (data: NhaCungCap[]) => {
  const doc = new jsPDF();

  // Add title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Danh sách nhà cung cấp", 14, 15);

  // Configure and add table
  autoTable(doc, {
    head: [
      [
        "ID",
        "Tên nhà cung cấp",
        "Số điện thoại",
        "Địa chỉ",
        "Email",
        "Trạng thái",
      ],
    ],
    body: data.map((item) => [
      item.idnhacungcap,
      item.tennhacungcap,
      item.sodienthoai,
      item.diachi,
      item.email,
      item.trangthai ? "Đang cung cấp" : "Ngừng cung cấp",
    ]),
    startY: 25,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 40 },
      2: { cellWidth: 30 },
      3: { cellWidth: 40 },
      4: { cellWidth: 35 },
      5: { cellWidth: 25 },
    },
  });

  // Save PDF
  doc.save("danh-sach-nha-cung-cap.pdf");
};
