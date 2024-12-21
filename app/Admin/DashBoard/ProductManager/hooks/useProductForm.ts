// import { useState } from 'react';
// import { FormData, SanPham } from '../type';
// import { useToast } from "@/components/ui/use-toast";

// const initialFormData: FormData = {
//   tensanpham: "",
//   mota: "",
//   gia: "",
//   hinhanh: "",
//   idloaisanpham: 0,
//   giamgia: 0,
//   gioitinh: true,
//   size: "",
// };

// export const useProductForm = (onSuccess: () => void) => {
//   const [formData, setFormData] = useState<FormData>(initialFormData);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentProductId, setCurrentProductId] = useState<number | null>(null);
//   const [imageUrl, setImageUrl] = useState("");
//   const { toast } = useToast();

//   const validateForm = (): string | null => {
//     if (!formData.tensanpham.trim()) return "Vui lòng nhập tên sản phẩm";
//     if (!formData.mota.trim()) return "Vui lòng nhập mô tả";
//     if (!formData.gia || isNaN(Number(formData.gia))) return "Vui lòng nhập giá hợp lệ";
//     if (!formData.idloaisanpham) return "Vui lòng chọn loại sản phẩm";
//     if (!formData.size) return "Vui lòng chọn ít nhất một size";
//     if (formData.giamgia < 0 || formData.giamgia > 100) return "Giảm giá phải từ 0 đến 100";
//     if (!imageUrl) return "Vui lòng tải lên hình ảnh sản phẩm";
//     return null;
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const validationError = validateForm();
//     if (validationError) {
//       toast({
//         title: "Lỗi Xác Thực!",
//         description: validationError,
//         variant: "destructive",
//       });
//       return;
//     }

//     const url = currentProductId ? `/api/sanpham/${currentProductId}` : "/api/sanpham";
//     const method = currentProductId ? "PUT" : "POST";

//     try {
//       const response = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...formData, hinhanh: imageUrl }),
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.error || "Lỗi khi cập nhật sản phẩm");
//       }

//       toast({
//         title: "Thành Công!",
//         description: isEditing ? "Cập nhật sản phẩm thành công" : "Thêm sản phẩm thành công",
//         variant: "success",
//       });

//       resetForm();
//       onSuccess();
//     } catch (err) {
//       console.error("Error:", err);
//       toast({
//         title: "Lỗi!",
//         description: err instanceof Error ? err.message : "Lỗi khi xử lý yêu cầu",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleEdit = (product: SanPham) => {
//     setFormData(product);
//     setCurrentProductId(product.idsanpham);
//     setIsEditing(true);
//     setImageUrl(product.hinhanh);
//   };

//   const resetForm = () => {
//     setFormData(initialFormData);
//     setCurrentProductId(null);
//     setIsEditing(false);
//     setImageUrl("");
//   };

//   return {
//     formData,
//     setFormData,
//     isEditing,
//     imageUrl,
//     setImageUrl,
//     handleSubmit,
//     handleEdit,
//     resetForm,
//   };
// };