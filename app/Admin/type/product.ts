export interface Product {
  idsanpham: number;
  tensanpham: string;
  mota: string;
  gia: string;
  hinhanh: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: boolean;
  trangthai?: boolean;
  loaisanpham?: {
    idloaisanpham: number;
    tenloai: string;
  };
  ProductSizes?: Array<{
    idProductSize: number;
    idSize: number;
    soluong: number;
    size?: Size;
  }>;
  ProductColors?: Array<{
    idProductColor: number;
    idmausac: number;
    hinhanh: string;
    color?: Color;
  }>;
}

export interface Size {
  idSize: number;
  tenSize: string;
}

export interface Color {
  idmausac: number;
  tenmau: string;
  mamau: string;
}

export interface ProductColor {
  idProductColor: number;
  idsanpham: number;
  idmausac: number;
  hinhanh: string;
  color?: Color;
}