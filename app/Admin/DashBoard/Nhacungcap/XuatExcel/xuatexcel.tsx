import * as XLSX from "xlsx";

interface NhaCungCap {
  idnhacungcap: number;
  tennhacungcap: string;
  sodienthoai: string;
  diachi: string;
  email: string;
  trangthai: boolean;
}

export const exportToExcel = (data: NhaCungCap[]) => {
  // Kiểm tra dữ liệu đầu vào
  console.log("Dữ liệu cần xuất:", data);

  if (!data || data.length === 0) {
    console.error("Không có dữ liệu để xuất");
    return;
  }

  // Transform data into Excel-friendly format
  const exportData = data.map((item) => ({
    "ID Nhà Cung Cấp": item.idnhacungcap,
    "Tên Nhà Cung Cấp": item.tennhacungcap,
    "Số Điện Thoại": item.sodienthoai,
    "Địa Chỉ": item.diachi,
    Email: item.email,
    "Trạng Thái": item.trangthai ? "Đang Cung Cấp" : "Ngừng Cung Cấp",
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Kiểm tra dữ liệu trong worksheet
  console.log("Worksheet xuất ra:", XLSX.utils.sheet_to_json(worksheet));

  // Set column widths (optional, for better formatting)
  const colWidths = [
    { wch: 15 }, // ID
    { wch: 30 }, // Tên Nhà Cung Cấp
    { wch: 20 }, // Số Điện Thoại
    { wch: 40 }, // Địa Chỉ
    { wch: 30 }, // Email
    { wch: 20 }, // Trạng Thái
  ];
  worksheet["!cols"] = colWidths;

  // Create workbook and add worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Nhà Cung Cấp");

  // Generate buffer for Excel
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Create and trigger file download
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `nha_cung_cap_${new Date().toISOString().split("T")[0]}.xlsx`;
  link.click();
};
