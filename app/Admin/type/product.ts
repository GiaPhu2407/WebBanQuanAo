export interface SanPham {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: string;
  mota: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: boolean;
  sizes: SizeQuantity[];
  loaisanpham?: {
    tenloai: string;
    mota: string;
  };
  images?: Array<{ url: string }>;
}

export interface LoaiSanPham {
  idloaisanpham: number;
  tenloai: string;
  mota: string;
}

export interface Meta {
  page: number;
  limit_size: number;
  totalRecords: number;
  totalPages: number;
}

export interface SizeQuantity {
  idSize: number;
  tenSize: string;
  soluong: number;
}

export interface FormData {
  tensanpham: string;
  mota: string;
  gia: string;
  hinhanh: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: boolean;
  sizes: SizeQuantity[];
}