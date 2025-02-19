export interface OrderItem {
    iddonhang: number;
    ngaydat: string;
    trangthai: string;
    tongsotien: number;
    chitietdonhang: OrderDetail[];
    lichGiaoHang?: DeliverySchedule[];
    thanhtoan: Payment[];
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