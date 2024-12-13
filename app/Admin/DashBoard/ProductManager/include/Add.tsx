// import { FormData } from "@/app/Admin/DashBoard/ProductManager/page";  // Import kiểu dữ liệu của formData
// import { toast } from "@/components/ui/use-toast";

// export const handleAdd = async (formData: FormData, imageUrl: string) => {
//   const url = "/api/sanpham";
//   const method = "POST";
  
//   try {
//     const response = await fetch(url, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ...formData, hinhanh: imageUrl }),
//     });

//     if (!response.ok) {
//       const data = await response.json();
//       throw new Error(data.error || "Lỗi khi thêm sản phẩm");
//     }

//     toast({
//       title: "Thành Công!",
//       description: "Thêm sản phẩm thành công",
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
