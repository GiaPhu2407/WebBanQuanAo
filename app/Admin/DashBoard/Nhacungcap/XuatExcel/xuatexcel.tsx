import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface NhaCungCap {
  idnhacungcap: number;
  tennhacungcap: string;
  sodienthoai: string;
  diachi: string;
  email: string;
  trangthai: boolean;
}

export const exportToExcel = (data: NhaCungCap[]) => {
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();

  // Add title row
  const titleRow = [["DANH SÁCH NHÀ CUNG CẤP"]];
  const ws = XLSX.utils.aoa_to_sheet(titleRow);

  // Merge cells for title
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];

  // Add header row
  const headers = [
    "STT",
    "Mã NCC",
    "Tên nhà cung cấp",
    "Số điện thoại",
    "Địa chỉ",
    "Email",
    "Trạng thái",
  ];
  XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A2" });

  // Add data
  const excelData = data.map((item, index) => [
    index + 1,
    item.idnhacungcap,
    item.tennhacungcap,
    item.sodienthoai,
    item.diachi,
    item.email,
    item.trangthai ? "Đang cung cấp" : "Ngừng cung cấp",
  ]);
  XLSX.utils.sheet_add_aoa(ws, excelData, { origin: "A3" });

  // Set column widths
  const colWidths = [
    { wch: 5 }, // STT
    { wch: 10 }, // Mã NCC
    { wch: 30 }, // Tên nhà cung cấp
    { wch: 15 }, // Số điện thoại
    { wch: 30 }, // Địa chỉ
    { wch: 25 }, // Email
    { wch: 15 }, // Trạng thái
  ];
  ws["!cols"] = colWidths;

  // Style the title
  ws.A1 = {
    v: "DANH SÁCH NHÀ CUNG CẤP",
    s: {
      font: { bold: true, sz: 14 },
      alignment: { horizontal: "center", vertical: "center" },
    },
  };

  // Style the headers
  const headerStyle = {
    font: { bold: true, sz: 11 },
    fill: { fgColor: { rgb: "4F81BD" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    },
  };

  // Apply header styles
  for (let i = 0; i < headers.length; i++) {
    const cell = XLSX.utils.encode_cell({ r: 1, c: i });
    ws[cell].s = headerStyle;
  }

  // Style data rows with alternating colors
  for (let i = 0; i < excelData.length; i++) {
    const rowStyle = {
      fill: {
        fgColor: { rgb: i % 2 === 0 ? "FFFFFF" : "F2F2F2" },
      },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };

    for (let j = 0; j < headers.length; j++) {
      const cell = XLSX.utils.encode_cell({ r: i + 2, c: j });
      if (!ws[cell]) ws[cell] = {};
      ws[cell].s = rowStyle;
    }
  }

  // Add to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Nhà cung cấp");

  // Generate and save file
  const currentDate = new Date();
  const fileName = `danh-sach-nha-cung-cap-${currentDate.getDate()}${
    currentDate.getMonth() + 1
  }${currentDate.getFullYear()}.xlsx`;
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, fileName);
};
