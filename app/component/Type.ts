// types.ts
interface Product {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: number;
  mota: string;
  idloaisanpham: number;
  mausac: string;
  giamgia: number;
  gioitinh: boolean;
  size: string;
}

interface Category {
  idloaisanpham: number;
  tenloai: string;
}

interface Size {
  id: number;
  tenSize: string;
}

interface FilterParams {
  categories: number[];
  gender: string | null;
  priceRange: number[];
  sizes: string[];
}
