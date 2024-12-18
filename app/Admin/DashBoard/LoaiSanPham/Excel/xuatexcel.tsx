import * as XLSX from 'xlsx';

// Define the interface directly here
interface LoaiSanPham {
  idloaisanpham: number;
  tenloai: string;
  mota: string;
}

export const exportLoaiSanPhamToExcel = (data: LoaiSanPham[]) => {
  // Transform data into Excel-friendly format
  const exportData = data.map(item => ({
    'Mã Loại': item.idloaisanpham,
    'Tên Loại': item.tenloai,
    'Mô Tả': item.mota
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Create workbook and add worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Loại Sản Phẩm');

  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  // Create and trigger download
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `loai_san_pham_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
};