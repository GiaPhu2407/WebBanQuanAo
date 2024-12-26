export interface Size {
  idSize: number;
  tenSize: string;
}

export interface Category {
  idloaisanpham: number;
  tenloai: string;
  mota?: string;
}

export interface ProductSize {
  idProductSize: number;
  idsanpham: number;
  idSize: number;
  soluong: number;
  size?: Size;
}

export interface Product {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: number;
  mota: string;
  mausac: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: boolean;
  loaisanpham?: Category;
  ProductSizes?: {
    idProductSize: number;
    idSize: number;
    soluong: number;
    size: {
      idSize: number;
      tenSize: string;
    };
  }[];
}

export interface ProductFormData {
  tensanpham: string;
  gia: number;
  mota: string;
  idloaisanpham: number;
  giamgia: number;
  mausac: string;
  gioitinh: boolean;
  productSizes: { [key: number]: number };
}