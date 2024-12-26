export interface Product {
    [x: string]: any;
    idsanpham: number;
    tensanpham: string;
    hinhanh: string;
    gia: number;
    mota: string;
    mausac: string;
    idloaisanpham: number;
    giamgia: number;
    gioitinh: boolean;
    ProductSizes?: ProductSize[];
    loaisanpham?: Category;
  }
  
  export interface ProductSize {
    idProductSize: number;
    idSize: number;
    soluong: number;
    size: Size;
  }
  
  export interface Size {
    idSize: number;
    tenSize: string;
  }
  
  export interface Category {
    idloaisanpham: number;
    tenloai: string;
  }