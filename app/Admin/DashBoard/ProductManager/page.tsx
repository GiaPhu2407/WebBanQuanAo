"use client";
import React, { useState, useEffect } from "react";
import SalesDashboard from "../NvarbarAdmin";
import Tabledashboard from "../../TableProduct";
import Fileupload from "@/components/ui/Fileupload";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface LoaiSanPham {
  idloaisanpham: number;
  tenloai: string;
  mota: string;
}

interface FormData {
  tensanpham: string;
  mota: string;
  gia: string;
  hinhanh: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: boolean;
  size: string;
}

interface SanPham extends FormData {
  idsanpham: number;
}

const VALID_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

export default function ProductManagementPage() {
  const [formData, setFormData] = useState<FormData>({
    tensanpham: "",
    mota: "",
    gia: "",
    hinhanh: "",
    idloaisanpham: 0,
    giamgia: 0,
    gioitinh: true,
    size: "",
  });

  const [loaisanphamList, setLoaisanphamList] = useState<LoaiSanPham[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLoaiSanPham();
  }, []);

  const fetchLoaiSanPham = async () => {
    try {
      const response = await fetch("/api/loaisanpham");
      const data = await response.json();
      setLoaisanphamList(data);
    } catch (err) {
      console.error("Failed to fetch loai san pham:", err);
      toast({
        title: "Lỗi!",
        description: "Không thể tải danh sách loại sản phẩm",
        variant: "destructive",
      });
    }
  };

  const validateForm = (): string | null => {
    if (!formData.tensanpham.trim()) return "Vui lòng nhập tên sản phẩm";
    if (!formData.mota.trim()) return "Vui lòng nhập mô tả";
    if (!formData.gia || isNaN(Number(formData.gia)))
      return "Vui lòng nhập giá hợp lệ";
    if (!formData.idloaisanpham) return "Vui lòng chọn loại sản phẩm";
    if (!formData.size) return "Vui lòng chọn ít nhất một size";
    if (formData.giamgia < 0 || formData.giamgia > 100)
      return "Giảm giá phải từ 0 đến 100";
    if (!imageUrl) return "Vui lòng tải lên hình ảnh sản phẩm";
    return null;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "idloaisanpham"
          ? parseInt(value)
          : name === "giamgia"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleGenderChange = (isMale: boolean) => {
    setFormData((prev) => ({ ...prev, gioitinh: isMale }));
  };

  const handleSizeChange = (selectedSize: string) => {
    setFormData((prev: FormData) => {
      const sizeSet = new Set(
        prev.size
          .split(",")
          .filter(Boolean)
          .map((s) => s.trim())
      );
      if (sizeSet.has(selectedSize)) {
        sizeSet.delete(selectedSize);
      } else {
        sizeSet.add(selectedSize);
      }
      return { ...prev, size: Array.from(sizeSet).sort().join(",") };
    });
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

    const url = currentProductId
      ? `/api/sanpham/${currentProductId}`
      : "/api/sanpham";
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
        description: isEditing
          ? "Cập nhật sản phẩm thành công"
          : "Thêm sản phẩm thành công",
        variant: "success",
      });

      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      modal?.close();
      resetForm();
      setReloadKey((prev) => prev + 1);
      setImageUrl("");
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: "Lỗi!",
        description:
          err instanceof Error ? err.message : "Lỗi khi xử lý yêu cầu",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: SanPham) => {
    setFormData(product);
    setCurrentProductId(product.idsanpham);
    setIsEditing(true);
    setImageUrl(product.hinhanh);
    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    modal?.showModal();
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      try {
        const response = await fetch(`/api/sanpham/${deleteConfirmId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Không thể xóa sản phẩm.");
        }

        toast({
          title: "Thành Công!",
          description: "Sản phẩm đã được xóa thành công",
          variant: "success",
        });

        setReloadKey((prevKey) => prevKey + 1);
        setDeleteConfirmId(null);
      } catch (err) {
        console.error("Error deleting product:", err);
        toast({
          title: "Lỗi!",
          description:
            err instanceof Error ? err.message : "Lỗi khi xóa sản phẩm",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      tensanpham: "",
      mota: "",
      gia: "",
      hinhanh: "",
      idloaisanpham: 0,
      giamgia: 0,
      gioitinh: true,
      size: "",
    });
    setCurrentProductId(null);
    setIsEditing(false);
    setImageUrl("");
  };

  return (
    <div className="flex">
      <SalesDashboard />
      <div className="p-6 flex-1">
        <Toaster />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              const modal = document.getElementById(
                "my_modal_3"
              ) as HTMLDialogElement;
              modal?.showModal();
            }}
          >
            Thêm sản phẩm
          </button>
        </div>

        <Tabledashboard
          key={reloadKey}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteConfirmId(id)}
          reloadKey={0}
        />

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
              <p>Bạn có chắc chắn muốn xóa sản phẩm này?</p>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setDeleteConfirmId(null)}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleDeleteConfirm}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        <dialog id="my_modal_3" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box relative">
            <button
              onClick={() => {
                resetForm();
                const modal = document.getElementById(
                  "my_modal_3"
                ) as HTMLDialogElement;
                modal?.close();
              }}
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </button>

            <h3 className="font-bold text-lg mb-4">
              {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Tên sản phẩm</span>
                  </label>
                  <input
                    type="text"
                    name="tensanpham"
                    value={formData.tensanpham}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Chọn loại sản phẩm</option>
                    {loaisanphamList.map((loai) => (
                      <option
                        key={loai.idloaisanpham}
                        value={loai.idloaisanpham}
                      >
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
                    onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={(url) => setImageUrl(url || "")}
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
                      onClick={() => setImageUrl("")}
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
                    <label
                      key={size}
                      className="cursor-pointer flex items-center"
                    >
                      <input
                        type="checkbox"
                        checked={formData.size.split(",").includes(size)}
                        onChange={() => handleSizeChange(size)}
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
                      onChange={() => handleGenderChange(true)}
                      className="radio radio-primary mr-2"
                    />
                    <span>Nam</span>
                  </label>
                  <label className="cursor-pointer flex items-center">
                    <input
                      type="radio"
                      name="gioitinh"
                      checked={formData.gioitinh === false}
                      onChange={() => handleGenderChange(false)}
                      className="radio radio-primary mr-2"
                    />
                    <span>Nữ</span>
                  </label>
                </div>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    resetForm();
                    const modal = document.getElementById(
                      "my_modal_3"
                    ) as HTMLDialogElement;
                    modal?.close();
                  }}
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </div>
  );
}

// Updated Product Management Page with AlertDialog

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

//         <div className="flex justify-between items-center mb-6">
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
//                 Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
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
