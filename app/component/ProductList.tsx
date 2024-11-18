// import React, { useState, useEffect } from 'react';
// import { Product, FilterState } from '@/app/component/Type';
// import ProductCard from './ProductCard';

// const ProductList: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch('/api/sanpham');
//         if (!response.ok) throw new Error('Failed to fetch products');
//         const data = await response.json();
//         setProducts(data);
//         setFilteredProducts(data);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleFilterChange = (filters: FilterState) => {
//     const filtered = products.filter((product) => {
//       // Category filter
//       if (filters.categories.length > 0 &&
//           !filters.categories.includes(product.idloaisanpham)) {
//         return false;
//       }

//       // Gender filter
//       if (filters.gender.length > 0) {
//         const productGender = product.gioitinh ? 'nam' : 'nu';
//         if (!filters.gender.includes(productGender)) {
//           return false;
//         }
//       }

//       // Price filter
//       const discountedPrice = product.giamgia > 0
//         ? product.gia * (1 - product.giamgia / 100)
//         : product.gia;
//       if (discountedPrice < filters.priceRange[0] ||
//           discountedPrice > filters.priceRange[1]) {
//         return false;
//       }

//       // Size filter
//       if (filters.sizes.length > 0) {
//         const productSizes = product.size.split(',').map(s => s.trim());
//         if (!productSizes.some(size => filters.sizes.includes(size))) {
//           return false;
//         }
//       }

//       return true;
//     });

//     setFilteredProducts(filtered);
//   };

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {[...Array(6)].map((_, i) => (
//           <div key={i} className="animate-pulse">
//             <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
//             <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div>
//       {filteredProducts.length === 0 ? (
//         <div className="text-center py-8">
//           <h3 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h3>
//           <p className="text-gray-600">
//             Không có sản phẩm nào phù hợp với bộ lọc của bạn.
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredProducts.map((product) => (
//             <ProductCard key={product.idsanpham} products={product} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductList;
