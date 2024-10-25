// "use client";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   horizontalListSortingStrategy,
//   useSortable,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// // import { Decimal } from "@prisma/client";
// import { Decimal } from "decimal.js";
// import hinh from "@/app/image/hinh.png";
// // Define interfaces
// interface Product {
//   idsanpham: number;
//   tensanpham: string;
//   mota: string;
//   gia: number;
//   hinhanh: string;
//   idloaisanpham: number;
//   giamgia: Decimal;
//   loaisanpham: {
//     tenloai: string;
//     mota: string;
//   };
// }

// interface SortableProductItemProps {
//   product: Product;
// }

// // SortableProductItem Component
// const SortableProductItem: React.FC<SortableProductItemProps> = ({
//   product,
// }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id: product.idsanpham });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       <div
//         className={`card bg-base-100 xl:w-72 xl:h-72 w-full md:w-72 md:h-72 ml-6 mb-5 shadow-xl relative 
//           ${isHovered ? "animate-borderrun" : ""}`}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         <div
//           className={` bg-gradient-to-bl from-blue-600 to-blue-400 w-[303px] h-[303px] z-[-1] 
//             -top-2 -left-2 rounded-2xl ${
//               isHovered ? "animate-spinrun" : "hidden"
//             }`}
//         />
//         <div className="w-[303px] h-[303px] ">
//           <figure className="px-10">
//             {/* {product.hinhanh && ( */}
//             <Image
//               src="https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn5042-vag-2.jpg"
//               // alt={product.tensanpham}
//               alt=""
//               width={256}
//               height={128}
//               className="rounded-xl w-64 h-32 object-cover"
//             />
//             {/* )} */}
//           </figure>
//           <div className="card-body items-center text-center">
//             <h2 className="card-title">{product.tensanpham}</h2>
//             <p>Giá: {product.gia?.toLocaleString()} VND</p>
//             <div className="card-actions">
//               <button className="btn bg-[#1464F4] text-white hover:bg-blue-600">
//                 Mua Ngay
//               </button>
//               <Link
//                 href={`/product/${product.idsanpham}`}
//                 className="btn btn-outline hover:bg-gray-100"
//               >
//                 Xem Chi Tiết
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </li>
//   );
// };

// // ProductList Component
// interface ProductListProps {
//   products: Product[];
// }

// const ProductList: React.FC<ProductListProps> = ({ products }) => {
//   const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
//   const productsPerPage = 4;

//   // Sensors for drag and drop
//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   useEffect(() => {
//     if (products?.length) {
//       setDisplayedProducts(products.slice(0, productsPerPage));
//     }
//   }, [products]);

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (active.id !== over?.id) {
//       setDisplayedProducts((items) => {
//         const oldIndex = items.findIndex(
//           (item) => item.idsanpham === active.id
//         );
//         const newIndex = items.findIndex((item) => item.idsanpham === over?.id);
//         return arrayMove(items, oldIndex, newIndex);
//       });
//     }
//   };

//   const loadMore = () => {
//     const currentLength = displayedProducts.length;
//     const nextProducts = products.slice(
//       currentLength,
//       currentLength + productsPerPage
//     );
//     setDisplayedProducts((prev) => [...prev, ...nextProducts]);
//   };

//   const showLess = () => {
//     setDisplayedProducts(products.slice(0, productsPerPage));
//   };

//   if (!products?.length) {
//     return (
//       <div className="w-full h-64 flex items-center justify-center">
//         <p className="text-gray-500 text-lg">Không có sản phẩm nào</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-full flex flex-col" data-theme="light">
//       <div className="xl:mx-28 md:mx-10 mt-24">
//         <h1 className="font-bold xl:text-5xl md:text-4xl text-3xl w-full text-slate-600 font-serif animate-appeartop">
//           Danh sách sản phẩm
//         </h1>
//         <div className="border-b-4 border-blue-500 mt-5" />

//         <DndContext
//           sensors={sensors}
//           collisionDetection={closestCenter}
//           onDragEnd={handleDragEnd}
//         >
//           <SortableContext
//             items={displayedProducts.map((p) => p.idsanpham)}
//             strategy={horizontalListSortingStrategy}
//           >
//             <ul className="flex w-full mt-12 flex-wrap list-none">
//               {displayedProducts.map((product) => (
//                 <SortableProductItem
//                   key={product.idsanpham}
//                   product={product}
//                 />
//               ))}
//             </ul>
//           </SortableContext>
//         </DndContext>

//         <div className="flex justify-center gap-5 mt-8">
//           {displayedProducts.length < products.length && (
//             <button
//               onClick={loadMore}
//               className="btn bg-blue-500 text-white hover:bg-blue-600"
//             >
//               Xem thêm
//             </button>
//           )}
//           {displayedProducts.length > productsPerPage && (
//             <button
//               onClick={showLess}
//               className="btn bg-blue-500 text-white hover:bg-blue-600"
//             >
//               Thu gọn
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductList;
