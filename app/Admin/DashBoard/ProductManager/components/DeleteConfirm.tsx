// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//   } from "@/components/ui/alert-dialog";
  
//   interface DeleteConfirmDialogProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onConfirm: () => void;
//   }
  
//   export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
//     isOpen,
//     onClose,
//     onConfirm,
//   }) => {
//     return (
//       <AlertDialog open={isOpen} onOpenChange={onClose}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
//             <AlertDialogDescription>
//               Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={onClose}>Hủy</AlertDialogCancel>
//             <AlertDialogAction onClick={onConfirm}>Xóa</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     );
//   };