"use client";
import React, { useEffect, useState } from "react";
import FeaturedCollection from "./Bosutap";
import Carousel from "./CarouselAfterLogin";
import Filter from "./Filter";
import DailyNewsModal from "./Daily";
import { ProductGrid } from "./ProductCard";

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
  popularity: number;
  totalViews: number;
  trangthai: "ACTIVE" | "SCHEDULED";
  releaseDate: string | null;
  ProductColors?: {
    idmausac: number;
    hinhanh: string;
  }[];
}

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewsModal, setShowNewsModal] = useState(false);

  useEffect(() => {
    setShowNewsModal(true);
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/sanpham");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        // The API now handles the filtering of scheduled products
        // We only need to set the products as they come from the API
        setAllProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();

    // Set up an interval to refresh the products every minute
    // This ensures scheduled products appear when their time comes
    const intervalId = setInterval(fetchAllProducts, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleFilterChange = (filters: {
    categories: number[];
    gender: string | null;
    priceRange: [number, number];
    sizes: string[];
  }) => {
    setLoading(true);

    let filtered = [...allProducts];

    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.idloaisanpham)
      );
    }

    if (filters.gender) {
      filtered = filtered.filter(
        (product) =>
          (filters.gender === "nam" && product.gioitinh) ||
          (filters.gender === "nu" && !product.gioitinh)
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.gia >= filters.priceRange[0] &&
        product.gia <= filters.priceRange[1]
    );

    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter((product) => {
        if (!product.size) return false;
        const productSizes = product.size.split(",").map((s) => s.trim());
        return filters.sizes.some((selectedSize) =>
          productSizes.includes(selectedSize)
        );
      });
    }

    setFilteredProducts(filtered);
    setLoading(false);
  };

  return (
    <>
      <DailyNewsModal
        isOpen={showNewsModal}
        onClose={() => setShowNewsModal(false)}
      />

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
              <ProductGrid
                products={filteredProducts}
                userId={0}
                onAddToCart={function (product: Product): void {
                  throw new Error("Function not implemented.");
                }}
              />
            )}
          </section>
        </div>

        <div className="flex justify-center items-center gap-24 mt-10">
          <img
            src="https://m.yodycdn.com/fit-in/filters:format(webp)//products/tet-2025-2512-05.jpg"
            alt="Promotion banner 1"
            className="w-96"
          />
          <img
            src="https://m.yodycdn.com/fit-in/filters:format(webp)//products/tet-2025-2512-03.jpg"
            alt="Promotion banner 2"
            className="w-96"
          />
          <img
            src="https://m.yodycdn.com/fit-in/filters:format(webp)//products/tet-2025-2512-03.jpg"
            alt="Promotion banner 3"
            className="w-96"
          />
        </div>

        <FeaturedCollection />
        <Carousel />
      </main>
    </>
  );
}
