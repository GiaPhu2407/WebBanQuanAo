import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface LoaiSanPham {
  idloaisanpham: number;
  tenloai: string;
  mota: string;
}

export const exportLoaiSanPhamToExcel = (data: LoaiSanPham[]) => {
  // Tạo workbook và worksheet
  const wb = XLSX.utils.book_new();
  const titleRow = [["DANH SÁCH LOẠI SẢN PHẨM"]];
  const ws = XLSX.utils.aoa_to_sheet(titleRow);

  // Gộp ô cho tiêu đề
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];

  // Thêm tiêu đề cột
  const headers = ["STT", "Mã Loại", "Tên Loại", "Mô Tả"];
  XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A2" });

  // Thêm dữ liệu
  const excelData = data.map((item, index) => [
    index + 1,
    item.idloaisanpham,
    item.tenloai,
    item.mota || "Không có mô tả",
  ]);
  XLSX.utils.sheet_add_aoa(ws, excelData, { origin: "A3" });

  // Định dạng cột
  ws["!cols"] = [
    { wch: 5 }, // STT
    { wch: 10 }, // Mã Loại
    { wch: 30 }, // Tên Loại
    { wch: 50 }, // Mô Tả
  ];

  // Style tiêu đề
  ws.A1 = {
    v: "DANH SÁCH LOẠI SẢN PHẨM",
    s: {
      font: { bold: true, sz: 14 },
      alignment: { horizontal: "center", vertical: "center" },
    },
  };

  // Style header
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

  for (let i = 0; i < headers.length; i++) {
    const cell = XLSX.utils.encode_cell({ r: 1, c: i });
    ws[cell].s = headerStyle;
  }

  // Style dữ liệu xen kẽ màu
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

  // Thêm vào workbook
  XLSX.utils.book_append_sheet(wb, ws, "Loại Sản Phẩm");

  // Xuất file
  const currentDate = new Date();
  const fileName = `danh-sach-loai-san-pham-${currentDate.getDate()}${
    currentDate.getMonth() + 1
  }${currentDate.getFullYear()}.xlsx`;
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, fileName);
};
