export interface Product {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: number;
  mota: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: boolean;
  size: string;
}

export interface FilterState {
  categories: number[];
  gender: string[];
  priceRange: [number, number];
  sizes: string[];
}
