"use client";
import React, { useState, useEffect } from "react";
import Filter from "@/app/component/Filter";
import ProductGrid from "@/app/component/ProductCard";

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

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.idloaisanpham)
      );
    }

    // Apply gender filter
    if (filters.gender.length > 0) {
      filtered = filtered.filter((product) =>
        filters.gender.includes(product.gioitinh ? "nam" : "nu")
      );
    }

    // Apply price range filter
    filtered = filtered.filter(
      (product) =>
        product.gia >= filters.priceRange[0] &&
        product.gia <= filters.priceRange[1]
    );

    // Apply size filter
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

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-center py-8">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filter Section */}
          <aside className="w-64 flex-shrink-0">
            <Filter onFilterChange={handleFilterChange} />
          </aside>

          {/* Main Content Section */}
          <main className="flex-1">
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg">
                  Không tìm thấy sản phẩm phù hợp
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
