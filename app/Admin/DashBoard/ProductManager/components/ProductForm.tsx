import React from 'react';
import { FormData, LoaiSanPham } from '@/app/Admin/DashBoard/ProductManager/type';
import Fileupload from '@/components/ui/Fileupload';

const VALID_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

interface ProductFormProps {
  formData: FormData;
  isEditing: boolean;
  imageUrl: string;
  loaisanphamList: LoaiSanPham[];
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onGenderChange: (isMale: boolean) => void;
  onSizeChange: (size: string) => void;
  onImageChange: (url: string) => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  isEditing,
  imageUrl,
  loaisanphamList,
  onSubmit,
  onChange,
  onGenderChange,
  onSizeChange,
  onImageChange,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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

      <div className="form-control">
        <label className="label">
          <span className="label-text">Mô tả</span>
        </label>
        <textarea
          name="mota"
          value={formData.mota}
          onChange={onChange}
          className="textarea textarea-bordered h-24"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Hình ảnh</span>
        </label>
        <Fileupload
          endpoint="imageUploader"
          onChange={(url) => onImageChange(url || "")}
          showmodal={!imageUrl}
        />
        {imageUrl && (
          <div className="mt-2">
            <img
              src={imageUrl}
              alt="Preview"
              className="max-h-40 object-contain mx-auto"
            />
            <button
              type="button"
              onClick={() => onImageChange("")}
              className="btn btn-error btn-sm mt-2"
            >
              Xóa ảnh
            </button>
          </div>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Kích thước</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {VALID_SIZES.map((size) => (
            <label key={size} className="cursor-pointer flex items-center">
              <input
                type="checkbox"
                checked={formData.size.split(",").includes(size)}
                onChange={() => onSizeChange(size)}
                className="checkbox checkbox-primary mr-2"
              />
              <span>{size}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Giới tính</span>
        </label>
        <div className="flex gap-4">
          <label className="cursor-pointer flex items-center">
            <input
              type="radio"
              name="gioitinh"
              checked={formData.gioitinh === true}
              onChange={() => onGenderChange(true)}
              className="radio radio-primary mr-2"
            />
            <span>Nam</span>
          </label>
          <label className="cursor-pointer flex items-center">
            <input
              type="radio"
              name="gioitinh"
              checked={formData.gioitinh === false}
              onChange={() => onGenderChange(false)}
              className="radio radio-primary mr-2"
            />
            <span>Nữ</span>
          </label>
        </div>
      </div>

      <div className="modal-action">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Hủy
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>
    </form>
  );
};