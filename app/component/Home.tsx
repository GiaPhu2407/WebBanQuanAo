// pages/Home.tsx
"use client";
import React, { useState, useEffect } from "react";
import Filter from "@/app/component/Filter"; // Đảm bảo đường dẫn đúng
import ProductCard from "@/app/component/ProductCard"; // Đảm bảo đường dẫn đúng

interface Product {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: number;
  mota: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: boolean;
  size: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/sanpham");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (filters: {
    categories: number[];
    gender: string | string[];
    priceRange: number[];
    sizes: string[];
  }) => {
    let filtered = [...products];

    // Apply filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.idloaisanpham)
      );
    }

    if (filters.gender.length > 0) {
      filtered = filtered.filter((product) =>
        filters.gender.includes(product.gioitinh ? "nam" : "nu")
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.gia >= filters.priceRange[0] &&
        product.gia <= filters.priceRange[1]
    );

    if (filters.sizes.length > 0) {
      filtered = filtered.filter((product) => {
        const productSizes = product.size.split(",").map((s) => s.trim());
        return filters.sizes.some((size: string) =>
          productSizes.includes(size)
        );
      });
    }

    setFilteredProducts(filtered);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <Filter onFilterChange={handleFilterChange} />
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.idsanpham} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  Không tìm thấy sản phẩm phù hợp
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
