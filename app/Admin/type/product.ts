export interface Size {
  idSize: number;
  tenSize: string;
}

export interface ProductSize {
  idProductSize: number;
  idsanpham: number;
  idSize: number;
  soluong: number;
  size?: Size;
}

export interface Product {
  [x: string]: any;
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: string;
  mota: string;
  mausac: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: boolean;
  loaisanpham?: {
    tenloai: string;
    mota: string;
  };
  ProductSizes?: ProductSize[];
}