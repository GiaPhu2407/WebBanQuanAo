export interface CartItem {
    idgiohang: number;
    idsanpham: number;
    idSize: number;
    soluong: number;
    sanpham: {
      tensanpham: string;
      hinhanh: string;
      gia: number;
    };
  }