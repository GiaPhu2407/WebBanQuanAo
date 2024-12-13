// import { FormData } from "@/app/Admin/DashBoard/ProductManager/include/Delete"; // Import kiểu dữ liệu của formData
// import { toast } from "@/components/ui/use-toast";

// export const handleUpdate = async (formData: FormData, imageUrl: string, productId: number) => {
//   const url = `/api/sanpham/${productId}`;
//   const method = "PUT";

//   try {
//     const response = await fetch(url, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ...formData, hinhanh: imageUrl }),
//     });

//     if (!response.ok) {
//       const data = await response.json();
//       throw new Error(data.error || "Lỗi khi cập nhật sản phẩm");
//     }

//     toast({
//       title: "Thành Công!",
//       description: "Cập nhật sản phẩm thành công",
//       variant: "success",
//     });

//     return true;
//   } catch (err) {
//     console.error("Error:", err);
//     toast({
//       title: "Lỗi!",
//       description: err instanceof Error ? err.message : "Lỗi khi xử lý yêu cầu",
//       variant: "destructive",
//     });

//     return false;
//   }
// };
