export interface LoaiSanPham {
    idloaisanpham: number;
    tenloai: string;
    mota: string;
  }
  
  export interface FormData {
    tensanpham: string;
    mota: string;
    gia: string;
    hinhanh: string;
    idloaisanpham: number;
    giamgia: number;
    gioitinh: boolean;
    size: string;
  }
  
  export interface SanPham extends FormData {
    idsanpham: number;
  }
  
  export const VALID_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];