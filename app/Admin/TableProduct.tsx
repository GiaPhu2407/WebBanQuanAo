import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
interface SanPham {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: string;
  mota: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: string;
  size: string;
  LoaiSanPham?: {
    tenloai: string;
    mota: string;
  };
}

interface LoaiSanPham {
  idloaisanpham: number;
  tenloai: string;
  mota: string;
}

interface TableDashboardProps {
  onEdit: (product: SanPham) => void;
  onDelete: (id: number) => void;
  reloadKey: number;
}

const Tabledashboard: React.FC<TableDashboardProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [isXeTable, setXeTable] = useState<SanPham[]>([]);
  const [isLoaiSanPhamTable, setLoaiSanPhamTable] = useState<LoaiSanPham[]>([]);

  useEffect(() => {
    fetch("/api/sanpham")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setXeTable(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [reloadKey]);

  useEffect(() => {
    fetch("/api/loaisanpham")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setLoaiSanPhamTable(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const getLoaiSanPhamName = (idloaisanpham: number) => {
    const loaiXe = isLoaiSanPhamTable.find(
      (loai) => loai.idloaisanpham === idloaisanpham
    );
    return loaiXe ? loaiXe.tenloai : "N/A";
  };

  return (
    <div>
      <table className="table mt-7 w-[900px]">
        <thead>
          <tr className="bg-blue-900 text-white text-center">
            <th>ID Sản Phẩm</th>
            <th>Tên Sản Phẩm</th>
            <th>Loại Sản Phẩm</th>
            <th>Giá</th>
            <th>Giảm Giá</th>
            <th>Giới Tính</th>
            <th>Size</th>
            <th>Hình Ảnh</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {isXeTable.map((sanpham) => (
            <tr key={sanpham.idsanpham} className="text-black text-center">
              <th>{sanpham.idsanpham}</th>
              <td>{sanpham.tensanpham}</td>
              <td>{getLoaiSanPhamName(sanpham.idloaisanpham)}</td>
              <td>{sanpham.gia}</td>
              <td>{sanpham.giamgia}</td>
              <td>{sanpham.gioitinh ? "Nam" : "Nữ"}</td>
              <td>{sanpham.size}</td>
              <td>
                <img
                  src={sanpham.hinhanh || "/default-image.png"}
                  alt={sanpham.tensanpham}
                  width="50"
                />
              </td>
              <td className="flex space-x-2">
                <button
                  onClick={() => onEdit(sanpham)}
                  className="px-3 py-1 text-blue-500  rounded hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <Pencil />
                </button>
                <button
                  onClick={() => onDelete(sanpham.idsanpham)}
                  className="px-3 py-1 text-red-500  rounded hover:bg-red-600 hover:text-white  transition-colors"
                >
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tabledashboard;
