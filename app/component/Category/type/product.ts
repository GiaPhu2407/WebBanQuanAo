export interface ProductWithImages {
    idsanpham: number;
    tensanpham: string;
    hinhanh: string;
    gia: number;
    mota: string;
    idloaisanpham: number;
    giamgia: number;
    gioitinh: boolean;
    size: string;
    images: ProductImage[];
  }
  
  export interface ProductImage {
    idImage: number;
    url: string;
    altText: string | null;
  }