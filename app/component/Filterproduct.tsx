// // components/FilteredProducts.tsx
// import React, { useState, useEffect } from "react";
// import ProductCard from "./ProductCard";
// import { Filter } from "@/app/component/FilterPage";

// // Types
// interface Product {
//   idsanpham: number;
//   tensanpham: string;
//   hinhanh: string;
//   gia: number;
//   mota: string;
//   idloaisanpham: number;
//   giamgia: number;
//   gioitinh: boolean;
//   size: string;
// }

// interface FilterState {
//   categories: number[];
//   gender: string[];
//   priceRange: [number, number];
//   sizes: string[];
// }

// const FilteredProducts: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("/api/sanpham");
//         if (!response.ok) throw new Error("Failed to fetch products");
//         const data = await response.json();
//         setProducts(data);
//         setFilteredProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleFilterChange = (filters: FilterState) => {
//     const filtered = products.filter((product) => {
//       // Category filter
//       if (
//         filters.categories.length > 0 &&
//         !filters.categories.includes(product.idloaisanpham)
//       ) {
//         return false;
//       }

//       // Gender filter
//       if (filters.gender.length > 0) {
//         const productGender = product.gioitinh ? "nam" : "nu";
//         if (!filters.gender.includes(productGender)) {
//           return false;
//         }
//       }

//       // Price filter
//       const discountedPrice =
//         product.giamgia > 0
//           ? product.gia * (1 - product.giamgia / 100)
//           : product.gia;
//       if (
//         discountedPrice < filters.priceRange[0] ||
//         discountedPrice > filters.priceRange[1]
//       ) {
//         return false;
//       }

//       // Size filter
//       if (filters.sizes.length > 0) {
//         const productSizes = product.size.split(",").map((s) => s.trim());
//         if (!productSizes.some((size) => filters.sizes.includes(size))) {
//           return false;
//         }
//       }

//       return true;
//     });

//     setFilteredProducts(filtered);
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         Loading...
//       </div>
//     );

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex gap-8">
//         <aside className="w-64 flex-shrink-0">
//           <Filter onFilterChange={handleFilterChange} />
//         </aside>
//         <main className="flex-1">
//           {filteredProducts.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">
//                 Không tìm thấy sản phẩm phù hợp với bộ lọc.
//               </p>
//             </div>
//           ) : (
//             <ProductCard products={filteredProducts} />
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default FilteredProducts;
