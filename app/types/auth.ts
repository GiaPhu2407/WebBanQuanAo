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
  Tentaikhoan?: string;
  MatKhau?: string;
  Email?: string;
  Hoten?: string;
  Sdt?: string;
  Diachi?: string;
  idRole?: number;
  // Ngaydangky?: string;
  role?: {
    Tennguoidung?: string;
  };
}

// export interface UpdateUserData extends Omit<User, "MatKhau"> {
//   MatKhau?: string;
// }
