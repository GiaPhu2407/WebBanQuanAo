import React from 'react';
import { FormData, LoaiSanPham } from '@/app/Admin/type/product';

interface ProductBasicInfoProps {
  formData: FormData;
  loaisanphamList: LoaiSanPham[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  formData,
  loaisanphamList,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Tên sản phẩm</span>
        </label>
        <input
          type="text"
          name="tensanpham"
          value={formData.tensanpham}
          onChange={onChange}
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Giá</span>
        </label>
        <input
          type="number"
          name="gia"
          value={formData.gia}
          onChange={onChange}
          className="input input-bordered w-full"
          required
          min="0"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Loại sản phẩm</span>
        </label>
        <select
          name="idloaisanpham"
          value={formData.idloaisanpham}
          onChange={onChange}
          className="select select-bordered w-full"
          required
        >
          <option value="">Chọn loại sản phẩm</option>
          {loaisanphamList.map((loai) => (
            <option key={loai.idloaisanpham} value={loai.idloaisanpham}>
              {loai.tenloai}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Giảm giá (%)</span>
        </label>
        <input
          type="number"
          name="giamgia"
          value={formData.giamgia}
          onChange={onChange}
          className="input input-bordered w-full"
          min="0"
          max="100"
        />
      </div>
    </div>
  );
};