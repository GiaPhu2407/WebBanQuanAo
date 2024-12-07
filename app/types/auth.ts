// export interface UserAuth {
//     idUsers: number;
//     Tentaikhoan?: string;
//     MatKhau?: string;
//     Email?: string;
//     Hoten?: string;
//     Sdt?: string;
//     DiaChi?: string;
//     idRole?: number;
//     role?: {
//       Tennguoidung?: string;
//     }
//   }
export interface User {
  idUsers: number;
  Tentaikhoan: string;
  MatKhau?: string;
  Email: string;
  Hoten: string;
  Sdt: string;
  Diachi: string;
  idRole: number;
  Ngaydangky: string;
  role?: {
    Tennguoidung?: string;
  };
}

export interface UpdateUserData extends Omit<User, "MatKhau"> {
  MatKhau?: string;
}
// types/cart.ts
export interface SanPham {
  idsanpham: number;
  tensanpham: string;
  mota: string;
  gia: number;
  hinhanh: string | string[];
  giamgia?: number;
  gioitinh?: boolean;
  size?: string;
  trangthai?: string;
}

export interface CartItem {
  idgiohang?: number;
  idsanpham: number;
  soluong: number;
  sanpham: SanPham;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}