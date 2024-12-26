export interface CartItem {
    idgiohang: number;
    idsanpham: number;
    soluong: number;
    isSelected: boolean;
    size: {
      idSize: number;
      tenSize: string;
    } | null;
    sanpham: {
      tensanpham: string;
      mota: string;
      gia: number;
      hinhanh: string;
      giamgia: number;
      gioitinh: boolean;
    } | null;
  }
  
  export type CartItemType = CartItem;