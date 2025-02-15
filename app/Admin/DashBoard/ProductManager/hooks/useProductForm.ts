import { useState } from 'react';
import { Product } from '@/app/Admin/type/product';
import { useToast } from "@/components/ui/use-toast";
import type { FormEvent } from 'react';

interface FormData {
  tensanpham: string;
  gia: string | number;
  mota: string;
  hinhanh: string;
  idloaisanpham: number | string;
  giamgia: number;
  gioitinh: boolean;
  productSizes: { [key: number]: number };
  productColors: Array<{ idmausac: number; hinhanh: string }>;
}

export function useProductForm(onSuccess: () => void) {
  const [formData, setFormData] = useState<FormData>({
    tensanpham: '',
    gia: '',
    mota: '',
    hinhanh: '',
    idloaisanpham: '',
    giamgia: 0,
    gioitinh: true,
    productSizes: {},
    productColors: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      tensanpham: '',
      gia: '',
      mota: '',
      hinhanh: '',
      idloaisanpham: '',
      giamgia: 0,
      gioitinh: true,
      productSizes: {},
      productColors: [],
    });
    setCurrentProductId(null);
    setIsEditing(false);
    setImageUrl("");
  };

  const validateForm = () => {
    if (!formData.tensanpham.trim()) return "Vui lòng nhập tên sản phẩm";
    if (!formData.gia || isNaN(Number(formData.gia))) return "Vui lòng nhập giá hợp lệ";
    if (!formData.idloaisanpham) return "Vui lòng chọn loại sản phẩm";
    if (Object.keys(formData.productSizes).length === 0) return "Vui lòng chọn ít nhất một size";
    if (formData.productColors.length === 0) return "Vui lòng chọn ít nhất một màu";
    if (!imageUrl) return "Vui lòng tải lên hình ảnh sản phẩm";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Lỗi",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const url = currentProductId 
        ? `/api/sanphammoi/${currentProductId}` 
        : "/api/sanphammoi";
        
      const method = currentProductId ? "PUT" : "POST";
      const formDataToSubmit = {
        ...formData,
        gia: Number(formData.gia),
        idloaisanpham: Number(formData.idloaisanpham),
        giamgia: Number(formData.giamgia),
        hinhanh: imageUrl,
        productColors: formData.productColors.map(color => ({
          idmausac: Number(color.idmausac),
          hinhanh: color.hinhanh || imageUrl // Use main image if no specific color image
        }))
      };

      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSubmit),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Lỗi khi lưu sản phẩm");
      }

      toast({
        title: "Thành công",
        description: isEditing ? "Cập nhật sản phẩm thành công" : "Thêm sản phẩm thành công",
      });

      resetForm();
      onSuccess();
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Lỗi không xác định",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      tensanpham: product.tensanpham || '',
      gia: product.gia || '',
      mota: product.mota || '',
      hinhanh: product.hinhanh || '',
      idloaisanpham: product.idloaisanpham || '',
      giamgia: product.giamgia || 0,
      gioitinh: product.gioitinh,
      productSizes: product.ProductSizes?.reduce((acc, size) => {
        acc[size.idSize] = size.soluong;
        return acc;
      }, {} as { [key: number]: number }) || {},
      productColors: product.ProductColors?.map(pc => ({
        idmausac: pc.idmausac,
        hinhanh: pc.hinhanh || ''
      })) || [],
    });
    setCurrentProductId(product.idsanpham);
    setIsEditing(true);
    setImageUrl(product.hinhanh || '');
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
    isSubmitting,
  };
}