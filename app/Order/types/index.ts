export interface OrderItem {
  iddonhang: number;
  ngaydat: string;
  trangthai: string;
  tongsotien: number;
  tongsoluong: number;
  chitietdonhang: Array<{
    soluong: number;
    dongia: number;
    idSize?: number;
    sanpham?: {
      tensanpham: string;
      hinhanh: string;
    };
  }>;
  thanhtoan?: Array<{
    phuongthucthanhtoan: string;
    ngaythanhtoan: string;
  }>;
  lichGiaoHang?: Array<{
    NgayGiao: string;
    TrangThai: string;
  }>;
  diaChiGiaoHang?: {
    tenNguoiNhan: string;
    soDienThoai: string;
    diaChiChiTiet: string;
    phuongXa: string;
    quanHuyen: string;
    thanhPho: string;
  };
}

export interface OrderDetail {
  idSize: any;
  idsanpham: number;
  soluong: number;
  dongia: number;
  sanpham: Product;
}

export interface Product {
  tensanpham: string;
  hinhanh: string;
  mota: string;
  kichthuoc: string;
  gioitinh?: boolean;
}

export interface DeliverySchedule {
  NgayGiao: string;
  TrangThai: string;
}

export interface Payment {
  phuongthucthanhtoan: string;
  ngaythanhtoan: string;
}
