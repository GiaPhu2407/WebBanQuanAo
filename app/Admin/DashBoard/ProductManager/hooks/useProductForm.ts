import { useState } from 'react';
import { FormData, SanPham, SizeQuantity } from '@/app/Admin/type/product';
import { useToast } from '@/components/ui/use-toast';

const initialFormData: FormData = {
  tensanpham: "",
  mota: "",
  gia: "",
  hinhanh: "",
  idloaisanpham: 0,
  giamgia: 0,
  gioitinh: true,
  sizes: []
};

export const useProductForm = (onSuccess: () => void) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const { toast } = useToast();

  const validateForm = (): string | null => {
    if (!formData.tensanpham.trim()) return "Vui lòng nhập tên sản phẩm";
    if (!formData.mota.trim()) return "Vui lòng nhập mô tả";
    if (!formData.gia || isNaN(Number(formData.gia))) return "Vui lòng nhập giá hợp lệ";
    if (!formData.idloaisanpham) return "Vui lòng chọn loại sản phẩm";
    if (formData.sizes.length === 0) return "Vui lòng chọn ít nhất một size";
    if (formData.giamgia < 0 || formData.giamgia > 100) return "Giảm giá phải từ 0 đến 100";
    if (!imageUrl) return "Vui lòng tải lên hình ảnh sản phẩm";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Lỗi Xác Thực!",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    const url = currentProductId ? `/api/sanpham/${currentProductId}` : "/api/sanpham";
    const method = currentProductId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, hinhanh: imageUrl }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Lỗi khi cập nhật sản phẩm");
      }

      toast({
        title: "Thành Công!",
        description: isEditing ? "Cập nhật sản phẩm thành công" : "Thêm sản phẩm thành công",
        variant: "success",
      });

      resetForm();
      onSuccess();
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: "Lỗi!",
        description: err instanceof Error ? err.message : "Lỗi khi xử lý yêu cầu",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: SanPham) => {
    setFormData({
      tensanpham: product.tensanpham,
      mota: product.mota,
      gia: product.gia,
      hinhanh: product.hinhanh,
      idloaisanpham: product.idloaisanpham,
      giamgia: product.giamgia,
      gioitinh: product.gioitinh,
      sizes: product.sizes || []
    });
    setCurrentProductId(product.idsanpham);
    setIsEditing(true);
    setImageUrl(product.hinhanh);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentProductId(null);
    setIsEditing(false);
    setImageUrl("");
  };

  // Thêm hàm để xử lý cập nhật sizes
  const handleSizeChange = (sizes: SizeQuantity[]) => {
    setFormData(prev => ({
      ...prev,
      sizes
    }));
  };

  return {
    formData,
    setFormData,
    isEditing,
    imageUrl,
    setImageUrl,
    handleSubmit,
    handleEdit,
    resetForm,
    handleSizeChange
  };
};