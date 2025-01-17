// Types for the product management system
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

export interface ProductColor {
  idProductColor: number;
  idsanpham: number;
  idmausac: number;
  hinhanh: string;
  color?: Color;
}

export interface Color {
  idmausac: number;
  tenmau: string;
  mamau: string;
}

export interface Product {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: number;
  mota: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: boolean;
  loaisanpham?: Category;
  ProductSizes?: ProductSize[];
  ProductColors?: ProductColor[];
}
