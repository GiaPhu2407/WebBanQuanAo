// Shared types for menu components
export interface User {
  id: number;
  Hoten: string;
  Email: string;
  role?: {
    Tennguoidung: string;
  };
}

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

export interface CartItem {
  idgiohang: number;
  idsanpham: number;
  soluong: number;
  sanpham: {
    tensanpham: string;
    mota: string;
    gia: number;
    hinhanh: string | string[];
    giamgia: number;
    gioitinh: boolean;
    size: string;
  };
}

export interface MenuProps {
  userData: User | null;
  orderCount: number;
  cartItems: CartItem[];
  handleLogout: () => Promise<void>;
  showMaleDropdown: boolean;
  setShowMaleDropdown: (show: boolean) => void;
  showFemaleDropdown: boolean;
  setShowFemaleDropdown: (show: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}
