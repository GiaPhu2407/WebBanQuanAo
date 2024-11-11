export interface UserAuth {
    idUsers: number;
    Tentaikhoan?: string;
    MatKhau?: string;
    Email?: string;
    Hoten?: string;
    Sdt?: string;
    DiaChi?: string;
    idRole?: number;
    role?: {
      Tennguoidung?: string;
    }
  }