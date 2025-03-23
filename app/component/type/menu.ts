export interface User {
  id: number;
  email: string;
  name: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
  sizeId: number;
}

export interface Product {
  idsanpham: number;
  tensanpham: string;
  gia: number;
  giamgia: number;
  hinhanh: string;
  mota: string;
  idloaisanpham: number;
  gioitinh: boolean;
  size: string;
}
