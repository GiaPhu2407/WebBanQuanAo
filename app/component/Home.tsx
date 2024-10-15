"use client";
import { useState } from "react";
import Filter from "../component/Filter";
import ProductList from "../component/ProductList";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  gender: string;
  color: string;
  size: string;
}

interface Product {
  id: number;
  name: string;
  image: string;
  price: number; // Giá nên là kiểu `number`
  gender: string;
  color: string;
  size: string;
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Áo thun Mickey",
    image:
      "https://m.yodycdn.com/fit-in/filters:format(webp)/products/akn6012-dod-qjn60341-xnh-5.jpg",
    price: 249000, // Sử dụng số nguyên thay vì dấu chấm
    gender: "female",
    color: "red",
    size: "M",
  },
  {
    id: 3,
    name: "Áo hoodie xanh",
    image:
      "https://m.yodycdn.com/fit-in/filters:format(webp)/products/ao-khoac-nam-akm6017-nau-4.jpg",
    price: 499000, // Sử dụng số nguyên
    gender: "male",
    color: "blue",
    size: "L",
  },
  // Thêm nhiều sản phẩm khác...
];

const Home: React.FC = () => {
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(initialProducts);

  const handleFilterChange = (filters: {
    gender: string[];
    color: string; // Update color to a single string
    size: string[];
    priceRange: string;
  }) => {
    let filtered = initialProducts;

    // Filter by gender
    if (filters.gender.length) {
      filtered = filtered.filter((p) => filters.gender.includes(p.gender));
    }

    // Filter by color (single color string now)
    if (filters.color) {
      filtered = filtered.filter((p) => p.color === filters.color);
    }

    // Filter by size
    if (filters.size.length) {
      filtered = filtered.filter((p) => filters.size.includes(p.size));
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      filtered = filtered.filter((p) => p.price >= min && p.price <= max);
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="flex min-h-screen p-8 bg-gray-50 mt-10">
      <Filter onFilterChange={handleFilterChange} />
      <ProductList products={filteredProducts} />
    </div>
  );
};

export default Home;
