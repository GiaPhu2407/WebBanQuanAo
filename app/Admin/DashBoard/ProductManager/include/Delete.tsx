// import { toast } from "@/components/ui/use-toast";

// export const handleDelete = async (deleteConfirmId: number) => {
//   try {
//     const response = await fetch(`/api/sanpham/${deleteConfirmId}`, {
//       method: "DELETE",
//     });

//     if (!response.ok) {
//       throw new Error("Không thể xóa sản phẩm.");
//     }

//     toast({
//       title: "Thành Công!",
//       description: "Sản phẩm đã được xóa thành công",
//       variant: "success",
//     });

//     return true;
//   } catch (err) {
//     console.error("Error deleting product:", err);
//     toast({
//       title: "Lỗi!",
//       description: err instanceof Error ? err.message : "Lỗi khi xóa sản phẩm",
//       variant: "destructive",
//     });

//     return false;
//   }
// };
