"use client";

import React, { useState } from 'react';
import Filter from '../component/Filter';
import ProductGrid from './ProductList';
  

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

interface FilterParams {
  categories: number[];
  gender: string | null;
  priceRange: number[];
  sizes: string[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (filters: FilterParams) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filters.categories.length) {
        filters.categories.forEach(cat => params.append('idloaisanpham', cat.toString()));
      }
      if (filters.gender) {
        params.append('gioitinh', filters.gender);
      }
      if (filters.priceRange.length === 2) {
        params.append('minPrice', filters.priceRange[0].toString());
        params.append('maxPrice', filters.priceRange[1].toString());
      }
      if (filters.sizes.length) {
        filters.sizes.forEach(size => params.append('size', size));
      }

      const response = await fetch(`/api/sanpham?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <Filter onFilterChange={fetchProducts} />
        </aside>
        <section className="w-full md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </section>
      </div>
    </main>
  );
}