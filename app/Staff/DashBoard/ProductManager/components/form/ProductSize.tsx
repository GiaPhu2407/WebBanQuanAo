// import React from 'react';
// import { useSize } from '@/app/Admin/DashBoard/ProductManager/hooks/useSize';
// import { FormData, SizeQuantity } from'@/app/Admin/type/product';


// interface ProductSizesProps {
//   formData: FormData;
//   onSizeQuantityChange: (sizes: SizeQuantity[]) => void;
// }

// export const ProductSizes: React.FC<ProductSizesProps> = ({
//   formData,
//   onSizeQuantityChange,
// }) => {
//   const { sizes, loading } = useSize();

//   const handleSizeToggle = (size: { idSize: number; tenSize: string }) => {
//     const currentSizes = [...formData.sizes];
//     const existingIndex = currentSizes.findIndex(s => s.idSize === size.idSize);
    
//     if (existingIndex >= 0) {
//       currentSizes.splice(existingIndex, 1);
//     } else {
//       currentSizes.push({ ...size, soluong: 0 });
//     }
    
//     onSizeQuantityChange(currentSizes);
//   };

//   const handleQuantityChange = (idSize: number, quantity: number) => {
//     const currentSizes = formData.sizes.map(size => 
//       size.idSize === idSize ? { ...size, soluong: quantity } : size
//     );
//     onSizeQuantityChange(currentSizes);
//   };

//   return (
//     <div className="form-control">
//       <label className="label">
//         <span className="label-text">Kích thước và số lượng</span>
//       </label>
//       <div className="space-y-2">
//         {loading ? (
//           <div className="text-sm text-gray-500">Đang tải kích thước...</div>
//         ) : sizes.length > 0 ? (
//           sizes.map((size) => {
//             const selectedSize = formData.sizes.find(s => s.idSize === size.idSize);
//             return (
//               <div key={size.idSize} className="flex items-center gap-4">
//                 <label className="cursor-pointer flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={!!selectedSize}
//                     onChange={() => handleSizeToggle(size)}
//                     className="checkbox checkbox-primary mr-2"
//                   />
//                   <span>{size.tenSize}</span>
//                 </label>
//                 {selectedSize && (
//                   <div className="form-control w-24">
//                     <input
//                       type="number"
//                       value={selectedSize.soluong}
//                       onChange={(e) => handleQuantityChange(size.idSize, parseInt(e.target.value) || 0)}
//                       className="input input-bordered input-sm"
//                       min="0"
//                       placeholder="Số lượng"
//                     />
//                   </div>
//                 )}
//               </div>
//             );
//           })
//         ) : (
//           <div className="text-sm text-gray-500">Không có kích thước</div>
//         )}
//       </div>
//     </div>
//   );
// };
