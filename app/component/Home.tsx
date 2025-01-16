// "use client";

// import React, { useState } from "react";
// import Filter from "../component/Filter";
// import ProductGrid from "./ProductList";
// import FeaturedCollection from "./Bosutap";
// import Carousel from "./CarouselAfterLogin";

// interface Product {
//   idsanpham: number;
//   tensanpham: string;
//   hinhanh: string;
//   gia: number;
//   mota: string;
//   idloaisanpham: number;
//   giamgia: number;
//   mausac: string;
//   gioitinh: boolean;
//   size: string;
// }

// interface FilterParams {
//   categories: number[];
//   gender: string | null;
//   priceRange: number[];
//   sizes: string[];
// }

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchProducts = async (filters: FilterParams) => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();

//       if (filters.categories.length) {
//         filters.categories.forEach((cat) =>
//           params.append("idloaisanpham", cat.toString())
//         );
//       }
//       if (filters.gender) {
//         params.append("gioitinh", filters.gender);
//       }
//       if (filters.priceRange.length === 2) {
//         params.append("minPrice", filters.priceRange[0].toString());
//         params.append("maxPrice", filters.priceRange[1].toString());
//       }
//       if (filters.sizes.length) {
//         filters.sizes.forEach((size) => params.append("size", size));
//       }

//       const response = await fetch(`/api/sanpham?${params.toString()}`);
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       const data = await response.json();
//       setProducts(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="container mx-auto px-4 py-8">
//       <div className="flex flex-col md:flex-row gap-8">
//         <aside className="w-full md:w-1/4">
//           <Filter onFilterChange={fetchProducts} />
//         </aside>
//         <section className="w-full md:w-3/4">
//           {loading ? (
//             <div className="flex justify-center items-center min-h-[200px]">
//               <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
//             </div>
//           ) : (
//             <ProductGrid products={products} />
//           )}
//         </section>
//       </div>
//       <div className="flex justify-center items-center gap-24 mt-10">
//         <img
//           src="https://m.yodycdn.com/fit-in/filters:format(webp)//products/tet-2025-2512-05.jpg"
//           alt=""
//           className="w-96"
//         />
//         <img
//           src="https://m.yodycdn.com/fit-in/filters:format(webp)//products/tet-2025-2512-03.jpg"
//           alt=""
//           className="w-96"
//         />
//         <img
//           src="https://m.yodycdn.com/fit-in/filters:format(webp)//products/tet-2025-2512-03.jpg"
//           alt=""
//           className="w-96"
//         />
//       </div>
//       <FeaturedCollection />
//       <Carousel />
//     </main>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";

import FeaturedCollection from "./Bosutap";
import Carousel from "./CarouselAfterLogin";
import Filter from "./Filter";
import ProductGrid from "./ProductCard";

interface Product {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: number;
  mota: string;
  idloaisanpham: number;
  mausac: string;
  giamgia: number;
  gioitinh: boolean;
  size: string;
}

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Lưu trữ tất cả sản phẩm
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Lưu trữ sản phẩm đã lọc
  const [loading, setLoading] = useState(true);

  // Fetch tất cả sản phẩm khi component mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/sanpham");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setAllProducts(data);
        setFilteredProducts(data); // Ban đầu hiện tất cả sản phẩm
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Hàm xử lý lọc sản phẩm
  const handleFilterChange = (filters: {
    categories: number[];
    gender: string | null;
    priceRange: [number, number];
    sizes: string[];
  }) => {
    setLoading(true);

    let filtered = [...allProducts];

    // Lọc theo danh mục
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.idloaisanpham)
      );
    }

    // Lọc theo giới tính
    if (filters.gender) {
      filtered = filtered.filter(
        (product) =>
          (filters.gender === "nam" && product.gioitinh) ||
          (filters.gender === "nu" && !product.gioitinh)
      );
    }

    // Lọc theo giá
    filtered = filtered.filter(
      (product) =>
        product.gia >= filters.priceRange[0] &&
        product.gia <= filters.priceRange[1]
    );

    // Lọc theo size
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((product) => {
        const productSizes = product.size.split(",").map((s) => s.trim());
        return filters.sizes.some((size) => productSizes.includes(size));
      });
    }

    setFilteredProducts(filtered);
    setLoading(false);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <Filter onFilterChange={handleFilterChange} />
        </aside>
        <section className="w-full md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </section>
      </div>

      <div className="flex justify-center items-center gap-24 mt-10">
        <img
          src="https://m.yodycdn.com/fit-in/filters:format(webp)//products/tet-2025-2512-05.jpg"
          alt=""
          className="w-96"
        />
        <img
          src="https://m.yodycdn.com/fit-in/filters:format(webp)//products/tet-2025-2512-03.jpg"
          alt=""
          className="w-96"
        />
        <img
          src="https://m.yodycdn.com/fit-in/filters:format(webp)//products/tet-2025-2512-03.jpg"
          alt=""
          className="w-96"
        />
      </div>

      <FeaturedCollection />
      <Carousel />
    </main>
  );
}
