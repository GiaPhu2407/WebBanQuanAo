import * as XLSX from 'xlsx';
import { toast } from "@/components/ui/use-toast";

// Define the interface directly here
interface LoaiSanPham {
  idloaisanpham: number;
  tenloai: string;
  mota: string;
}

export const importLoaiSanPhamFromExcel = async (
  file: File, 
  handleImport: (data: Omit<LoaiSanPham, 'idloaisanpham'>[]) => Promise<void>
) => {
  try {
    // Read file
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const bufferArray = e.target?.result;
      const workbook = XLSX.read(bufferArray, { type: 'buffer' });
      
      // Get first sheet
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      
      // Convert to JSON
      const data: any[] = XLSX.utils.sheet_to_json(worksheet);
      
      // Validate data structure
      const validatedData = data.map(row => {
        if (!row['Tên Loại'] || !row['Mô Tả']) {
          throw new Error('Invalid Excel format. Ensure columns "Tên Loại" and "Mô Tả" exist.');
        }
        
        return {
          tenloai: row['Tên Loại'],
          mota: row['Mô Tả']
        };
      });
      
      // Call import handler
      await handleImport(validatedData);
      
      toast({
        title: 'Thành công',
        description: `Đã nhập ${validatedData.length} loại sản phẩm`,
        variant: 'success'
      });
    };
    
    fileReader.readAsArrayBuffer(file);
  } catch (error) {
    toast({
      title: 'Lỗi',
      description: error instanceof Error ? error.message : 'Lỗi nhập Excel',
      variant: 'destructive'
    });
  }
};