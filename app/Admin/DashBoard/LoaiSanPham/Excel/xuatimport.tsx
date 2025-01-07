// utils/excelImport.ts
import * as XLSX from 'xlsx';
import { toast } from "@/components/ui/use-toast";

interface LoaiSanPham {
  idloaisanpham: number;
  tenloai: string;
  mota: string;
}

export const importLoaiSanPhamFromExcel = async (file: File) => {
  try {
    const fileReader = new FileReader();
    
    return new Promise((resolve, reject) => {
      fileReader.onload = async (e) => {
        try {
          const bufferArray = e.target?.result;
          const workbook = XLSX.read(bufferArray, { type: 'buffer' });
          
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          
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
          
          // Gọi API để import dữ liệu
          const response = await fetch('/api/loaisanpham/import', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedData),
          });
          
          if (!response.ok) {
            throw new Error('Import failed');
          }
          
          const result = await response.json();
          
          toast({
            title: 'Thành công',
            description: result.message,
            variant: 'success'
          });
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      fileReader.onerror = () => {
        reject(new Error('File reading failed'));
      };
      
      fileReader.readAsArrayBuffer(file);
    });
  } catch (error) {
    toast({
      title: 'Lỗi',
      description: error instanceof Error ? error.message : 'Lỗi nhập Excel',
      variant: 'destructive'
    });
    throw error;
  }
};