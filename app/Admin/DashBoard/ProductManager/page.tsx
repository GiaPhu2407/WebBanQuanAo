// "use client";
// import React, { useState, useEffect } from "react";
// import SalesDashboard from "../NvarbarAdmin";
// import Tabledashboard from "../../TableProduct";
// import Fileupload from "@/components/ui/Fileupload";
// import { useToast } from "@/components/ui/use-toast";
// import { Toaster } from "@/components/ui/toaster";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// interface LoaiSanPham {
//   idloaisanpham: number;
//   tenloai: string;
//   mota: string;
// }

// interface FormData {
//   tensanpham: string;
//   mota: string;
//   gia: string;
//   hinhanh: string;
//   idloaisanpham: number;
//   giamgia: number;
//   mausac:string,
//   gioitinh: boolean;
//   size: string;
// }

// interface SanPham extends FormData {
//   idsanpham: number;
// }

// const VALID_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

// export default function ProductManagementPage() {
//   const [formData, setFormData] = useState<FormData>({
//     tensanpham: "",
//     mota: "",
//     gia: "",
//     hinhanh: "",
//     idloaisanpham: 0,
//     giamgia: 0,
//     mausac:"",
//     gioitinh: true,
//     size: "",
//   });

//   const [loaisanphamList, setLoaisanphamList] = useState<LoaiSanPham[]>([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [reloadKey, setReloadKey] = useState(0);
//   const [currentProductId, setCurrentProductId] = useState<number | null>(null);
//   const [imageUrl, setImageUrl] = useState("");
//   const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchLoaiSanPham();
//   }, []);

//   const fetchLoaiSanPham = async () => {
//     try {
//       const response = await fetch("/api/loaisanpham");
//       const data = await response.json();
//       setLoaisanphamList(data);
//     } catch (err) {
//       console.error("Failed to fetch loai san pham:", err);
//       toast({
//         title: "Lỗi!",
//         description: "Không thể tải danh sách loại sản phẩm",
//         variant: "destructive",
//       });
//     }
//   };

//   const validateForm = (): string | null => {
//     if (!formData.tensanpham.trim()) return "Vui lòng nhập tên sản phẩm";
//     if (!formData.mota.trim()) return "Vui lòng nhập mô tả";
//     if (!formData.gia || isNaN(Number(formData.gia)))
//       return "Vui lòng nhập giá hợp lệ";
//     if (!formData.idloaisanpham) return "Vui lòng chọn loại sản phẩm";
//     if (!formData.size) return "Vui lòng chọn ít nhất một size";
//     if (formData.giamgia < 0 || formData.giamgia > 100)
//       return "Giảm giá phải từ 0 đến 100";
//     if (!imageUrl) return "Vui lòng tải lên hình ảnh sản phẩm";
//     return null;
//   };

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         name === "idloaisanpham"
//           ? parseInt(value)
//           : name === "giamgia"
//           ? parseFloat(value)
//           : value,
//     }));
//   };

//   const handleGenderChange = (isMale: boolean) => {
//     setFormData((prev) => ({ ...prev, gioitinh: isMale }));
//   };

//   const handleSizeChange = (selectedSize: string) => {
//     setFormData((prev: FormData) => {
//       const sizeSet = new Set(
//         prev.size
//           .split(",")
//           .filter(Boolean)
//           .map((s) => s.trim())
//       );
//       if (sizeSet.has(selectedSize)) {
//         sizeSet.delete(selectedSize);
//       } else {
//         sizeSet.add(selectedSize);
//       }
//       return { ...prev, size: Array.from(sizeSet).sort().join(",") };
//     });
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

//     const url = currentProductId
//       ? `/api/sanpham/${currentProductId}`
//       : "/api/sanpham";
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
//         description: isEditing
//           ? "Cập nhật sản phẩm thành công"
//           : "Thêm sản phẩm thành công",
//         variant: "success",
//       });

//       const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
//       modal?.close();
//       resetForm();
//       setReloadKey((prev) => prev + 1);
//       setImageUrl("");
//     } catch (err) {
//       console.error("Error:", err);
//       toast({
//         title: "Lỗi!",
//         description:
//           err instanceof Error ? err.message : "Lỗi khi xử lý yêu cầu",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleEdit = (product: SanPham) => {
//     setFormData(product);
//     setCurrentProductId(product.idsanpham);
//     setIsEditing(true);
//     setImageUrl(product.hinhanh);
//     const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
//     modal?.showModal();
//   };

//   const handleDeleteConfirm = async () => {
//     if (deleteConfirmId) {
//       try {
//         const response = await fetch(`/api/sanpham/${deleteConfirmId}`, {
//           method: "DELETE",
//         });

//         if (!response.ok) {
//           throw new Error("Không thể xóa sản phẩm.");
//         }

//         toast({
//           title: "Thành Công!",
//           description: "Sản phẩm đã được xóa thành công",
//           variant: "success",
//         });

//         setReloadKey((prevKey) => prevKey + 1);
//         setDeleteConfirmId(null);
//       } catch (err) {
//         console.error("Error deleting product:", err);
//         toast({
//           title: "Lỗi!",
//           description:
//             err instanceof Error ? err.message : "Lỗi khi xóa sản phẩm",
//           variant: "destructive",
//         });
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       tensanpham: "",
//       mota: "",
//       gia: "",
//       hinhanh: "",
//       idloaisanpham: 0,
//       giamgia: 0,
//       mausac:"",
//       gioitinh: true,
//       size: "",
//     });
//     setCurrentProductId(null);
//     setIsEditing(false);
//     setImageUrl("");
//   };

//   return (
//     <div className="flex">
//       <SalesDashboard />
//       <div className="p-6 flex-1">
//         <Toaster />

//         <div className="flex justify-between items-center mb-6 mt-16">
//           <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
//           <button
//             className="btn btn-primary"
//             onClick={() => {
//               resetForm();
//               const modal = document.getElementById(
//                 "my_modal_3"
//               ) as HTMLDialogElement;
//               modal?.showModal();
//             }}
//           >
//             Thêm sản phẩm
//           </button>
//         </div>

//         <Tabledashboard
//           key={reloadKey}
//           onEdit={handleEdit}
//           onDelete={(id) => setDeleteConfirmId(id)}
//           reloadKey={0}
//         />

//         {/* Delete Confirmation Dialog */}
//         <AlertDialog
//           open={!!deleteConfirmId}
//           onOpenChange={() => setDeleteConfirmId(null)}
//         >
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
//               <AlertDialogDescription>
//                 Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể
//                 hoàn tác.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel onClick={() => setDeleteConfirmId(null)}>
//                 Hủy
//               </AlertDialogCancel>
//               <AlertDialogAction onClick={handleDeleteConfirm}>
//                 Xóa
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>

//         {/* Add/Edit Product Modal */}
//         <dialog id="my_modal_3" className="modal modal-bottom sm:modal-middle">
//           <div className="modal-box relative">
//             <button
//               onClick={() => {
//                 resetForm();
//                 const modal = document.getElementById(
//                   "my_modal_3"
//                 ) as HTMLDialogElement;
//                 modal?.close();
//               }}
//               className="btn btn-sm btn-circle absolute right-2 top-2"
//             >
//               ✕
//             </button>

//             <h3 className="font-bold text-lg mb-4">
//               {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
//             </h3>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Tên sản phẩm</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="tensanpham"
//                     value={formData.tensanpham}
//                     onChange={handleChange}
//                     className="input input-bordered w-full"
//                     required
//                   />
//                 </div>

//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Giá</span>
//                   </label>
//                   <input
//                     type="number"
//                     name="gia"
//                     value={formData.gia}
//                     onChange={handleChange}
//                     className="input input-bordered w-full"
//                     required
//                     min="0"
//                   />
//                 </div>

//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Loại sản phẩm</span>
//                   </label>
//                   <select
//                     name="idloaisanpham"
//                     value={formData.idloaisanpham}
//                     onChange={handleChange}
//                     className="select select-bordered w-full"
//                     required
//                   >
//                     <option value="">Chọn loại sản phẩm</option>
//                     {loaisanphamList.map((loai) => (
//                       <option
//                         key={loai.idloaisanpham}
//                         value={loai.idloaisanpham}
//                       >
//                         {loai.tenloai}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Giảm giá (%)</span>
//                   </label>
//                   <input
//                     type="number"
//                     name="giamgia"
//                     value={formData.giamgia}
//                     onChange={handleChange}
//                     className="input input-bordered w-full"
//                     min="0"
//                     max="100"
//                   />
//                 </div>
//                 <div className="form-control">
//                   <label className="label">
//                     <span className="label-text">Màu sắc</span>
//                   </label>
//                   <input
//                     type="string"
//                     name="mausac"
//                     value={formData.mausac}
//                     onChange={handleChange}
//                     className="input input-bordered w-full"
//                     min="0"
//                     max="100"
//                   />
//                 </div>
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text">Mô tả</span>
//                 </label>
//                 <textarea
//                   name="mota"
//                   value={formData.mota}
//                   onChange={handleChange}
//                   className="textarea textarea-bordered h-24"
//                   required
//                 />
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text">Hình ảnh</span>
//                 </label>
//                 <Fileupload
//                   endpoint="imageUploader"
//                   onChange={(url) => setImageUrl(url || "")}
//                   showmodal={!imageUrl}
//                 />
//                 {imageUrl && (
//                   <div className="mt-2">
//                     <img
//                       src={imageUrl}
//                       alt="Preview"
//                       className="max-h-40 object-contain mx-auto"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setImageUrl("")}
//                       className="btn btn-error btn-sm mt-2"
//                     >
//                       Xóa ảnh
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text">Kích thước</span>
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   {VALID_SIZES.map((size) => (
//                     <label
//                       key={size}
//                       className="cursor-pointer flex items-center"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={formData.size.split(",").includes(size)}
//                         onChange={() => handleSizeChange(size)}
//                         className="checkbox checkbox-primary mr-2"
//                       />
//                       <span>{size}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text">Giới tính</span>
//                 </label>
//                 <div className="flex gap-4">
//                   <label className="cursor-pointer flex items-center">
//                     <input
//                       type="radio"
//                       name="gioitinh"
//                       checked={formData.gioitinh === true}
//                       onChange={() => handleGenderChange(true)}
//                       className="radio radio-primary mr-2"
//                     />
//                     <span>Nam</span>
//                   </label>
//                   <label className="cursor-pointer flex items-center">
//                     <input
//                       type="radio"
//                       name="gioitinh"
//                       checked={formData.gioitinh === false}
//                       onChange={() => handleGenderChange(false)}
//                       className="radio radio-primary mr-2"
//                     />
//                     <span>Nữ</span>
//                   </label>
//                 </div>
//               </div>

//               <div className="modal-action">
//                 <button
//                   type="button"
//                   className="btn btn-ghost"
//                   onClick={() => {
//                     resetForm();
//                     const modal = document.getElementById(
//                       "my_modal_3"
//                     ) as HTMLDialogElement;
//                     modal?.close();
//                   }}
//                 >
//                   Hủy
//                 </button>
//                 <button type="submit" className="btn btn-primary">
//                   {isEditing ? "Cập nhật" : "Thêm mới"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </dialog>
//       </div>
//     </div>
//   );
// }







// //  React from "react";
//  "use client";
// import { useToast } from "@/components/ui/use-toast";
// import { Toaster } from "@/components/ui/toaster";
// import { LoaiSanPham, SizeQuantity } from "@/app/Admin/type/product";
// import SalesDashboard from "../NvarbarAdmin";
// import TableDashboard from "../../TableProduct";
// import { ProductForm } from "./components/ProductForm";
// import { DeleteConfirmDialog } from "./components/DeleteConfirm";
// import { useProductForm } from "./hooks/useProductForm";
// import React from "react";

// export default function ProductManagementPage() {
//   const { toast } = useToast();
//   const [reloadKey, setReloadKey] = React.useState(0);
//   const [deleteConfirmId, setDeleteConfirmId] = React.useState<number | null>(null);
//   const [loaisanphamList, setLoaisanphamList] = React.useState<LoaiSanPham[]>([]);

//   const {
//     formData,
//     setFormData,
//     isEditing,
//     imageUrl,
//     setImageUrl,
//     handleSubmit,
//     handleEdit,
//     resetForm,
//     handleSizeChange
//   } = useProductForm(() => {
//     setReloadKey((prev) => prev + 1);
//     const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
//     modal?.close();
//   });

//   React.useEffect(() => {
//     fetchLoaiSanPham();
//   }, []);

//   const fetchLoaiSanPham = async () => {
//     try {
//       const response = await fetch("/api/loaisanpham");
//       const data = await response.json();
//       setLoaisanphamList(data);
//     } catch (err) {
//       console.error("Failed to fetch loai san pham:", err);
//       toast({
//         title: "Lỗi!",
//         description: "Không thể tải danh sách loại sản phẩm",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         name === "idloaisanpham"
//           ? parseInt(value)
//           : name === "giamgia"
//           ? parseFloat(value)
//           : value,
//     }));
//   };

//   const handleGenderChange = (isMale: boolean) => {
//     setFormData((prev) => ({ ...prev, gioitinh: isMale }));
//   };

//   // Cập nhật hàm xử lý size để làm việc với SizeQuantity[]
//   const handleSizeUpdate = (updatedSize: SizeQuantity) => {
//     setFormData((prev) => {
//       const currentSizes = [...prev.sizes];
//       const existingIndex = currentSizes.findIndex(size => size.idSize === updatedSize.idSize);
      
//       if (existingIndex >= 0) {
//         // Cập nhật size hiện có
//         currentSizes[existingIndex] = updatedSize;
//       } else {
//         // Thêm size mới
//         currentSizes.push(updatedSize);
//       }
      
//       return {
//         ...prev,
//         sizes: currentSizes
//       };
//     });
//   };

//   const handleDeleteSize = (idSize: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       sizes: prev.sizes.filter(size => size.idSize !== idSize)
//     }));
//   };

//   const handleDeleteConfirm = async () => {
//     if (deleteConfirmId) {
//       try {
//         const response = await fetch(`/api/sanpham/${deleteConfirmId}`, {
//           method: "DELETE",
//         });

//         if (!response.ok) {
//           throw new Error("Không thể xóa sản phẩm.");
//         }

//         toast({
//           title: "Thành Công!",
//           description: "Sản phẩm đã được xóa thành công",
//           variant: "success",
//         });

//         setReloadKey((prevKey) => prevKey + 1);
//         setDeleteConfirmId(null);
//       } catch (err) {
//         console.error("Error deleting product:", err);
//         toast({
//           title: "Lỗi!",
//           description: err instanceof Error ? err.message : "Lỗi khi xóa sản phẩm",
//           variant: "destructive",
//         });
//       }
//     }
//   };

//   return (
//     <div className="flex">
//       <SalesDashboard />
//       <div className="p-6 flex-1">
//         <Toaster />

//         <div className="flex justify-between items-center mb-6 mt-16">
//           <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
//           <button
//             className="btn btn-primary"
//             onClick={() => {
//               resetForm();
//               const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
//               modal?.showModal();
//             }}
//           >
//             Thêm sản phẩm
//           </button>
//         </div>

//         <TableDashboard
//           key={reloadKey}
//           onEdit={handleEdit}
//           onDelete={(id) => setDeleteConfirmId(id)}
//           reloadKey={reloadKey}
//         />

//         <DeleteConfirmDialog
//           isOpen={!!deleteConfirmId}
//           onClose={() => setDeleteConfirmId(null)}
//           onConfirm={handleDeleteConfirm}
//         />

//         <dialog id="my_modal_3" className="modal modal-bottom sm:modal-middle">
//           <div className="modal-box relative">
//             <button
//               onClick={() => {
//                 resetForm();
//                 const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
//                 modal?.close();
//               }}
//               className="btn btn-sm btn-circle absolute right-2 top-2"
//             >
//               ✕
//             </button>

//             <h3 className="font-bold text-lg mb-4">
//               {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
//             </h3>

//             <ProductForm
//               formData={formData}
//               isEditing={isEditing}
//               imageUrl={imageUrl}
//               loaisanphamList={loaisanphamList}
//               onSubmit={handleSubmit}
//               onChange={handleChange}
//               onGenderChange={handleGenderChange}
//               onSizeUpdate={handleSizeUpdate}
//               onDeleteSize={handleDeleteSize}
//               onImageChange={setImageUrl}
//               onCancel={() => {
//                 resetForm();
//                 const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
//                 modal?.close();
//               }}
//             />
//           </div>
//         </dialog>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Product, Size } from "@/app/Admin/type/product";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import ProductFilters from "./ProductFilter/ProductFilters";
import ProductTable from "./ProductTable/ProductTables";
import { ProductDialog } from "./components/form/ProductDialog";
import SalesDashboard from "../NvarbarAdmin";

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [categories, setCategories] = useState<Array<{ idloaisanpham: number; tenloai: string }>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    tensanpham: '',
    gia: '',
    mota: '',
    idloaisanpham: '',
    giamgia: 0,
    mausac: '',
    gioitinh: true,
    productSizes: {},
  });
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchSizes();
    fetchCategories();
  }, [searchTerm, categoryFilter, genderFilter]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(genderFilter !== 'all' && { gender: genderFilter }),
      });

      const response = await fetch(`/api/phantrang?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách sản phẩm",
        variant: "destructive",
      });
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await fetch("/api/size");
      if (!response.ok) throw new Error('Failed to fetch sizes');
      const data = await response.json();
      setSizes(data.size || []);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách size",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/loaisanpham");
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách loại sản phẩm",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const url = selectedProduct
        ? `/api/sanpham/${selectedProduct.idsanpham}`
        : "/api/sanpham";
        
      const method = selectedProduct ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          hinhanh: imageUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save product');
      }

      toast({
        title: "Thành công",
        description: selectedProduct
          ? "Cập nhật sản phẩm thành công"
          : "Thêm sản phẩm thành công",
      });

      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
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
    setSelectedProduct(product);
    setFormData({
      tensanpham: product.tensanpham || '',
      gia: String(product.gia) || '',//+
      mota: product.mota || '',
      idloaisanpham: product.idloaisanpham?.toString() || '',//+
      giamgia: product.giamgia || 0,
      mausac: product.mausac || '',
      gioitinh: product.gioitinh,
      productSizes: product.ProductSizes?.reduce((acc, size) => {
        acc[size.idSize] = size.soluong;
        return acc;
      }, {} as { [key: number]: number }) || {},
    });
    setImageUrl(product.hinhanh || '');
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      const response = await fetch(`/api/sanpham/${deleteConfirmId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      toast({
        title: "Thành công",
        description: "Xóa sản phẩm thành công",
      });

      setDeleteConfirmId(null);
      fetchProducts();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa sản phẩm",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      tensanpham: '',
      gia: '',
      mota: '',
      idloaisanpham: '',
      giamgia: 0,
      mausac: '',
      gioitinh: true,
      productSizes: {},
    });
    setImageUrl('');
    setSelectedProduct(undefined);
  };

  return (
    <div className="flex">
       <SalesDashboard/>
    
    <div className="p-6 mt-16">
     
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6 ">
          <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
          <Button className="ml-[800px]" onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}>
            Thêm sản phẩm
          </Button>
        </div>

        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          genderFilter={genderFilter}
          onGenderChange={setGenderFilter}
          categories={categories}
        />
      </div>

      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={setDeleteConfirmId}
      />

      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          resetForm();
        }}
        product={selectedProduct}
        sizes={sizes}
        categories={categories}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        isSubmitting={isSubmitting}
      />

      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmId(null)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </div>
  );
}