"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import hinh from "@/app/image/hinh.png";
import { Heart } from "lucide-react";

interface Product {
  idsanpham: number;
  tensanpham: string;
  hinhanh: string;
  gia: number;
  mota: string;
  idloaisanpham: number;
  giamgia: number;
  gioitinh: Boolean;
  size: string;
  loaisanpham: {
    tenloai: string;
    mota: string;
  };
}

interface Filters {
  gender: string[];
  size: string[];
  priceRange: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sanpham")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Có lỗi khi tải dữ liệu sản phẩm:", e);
        setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (filters: Filters) => {
    let filtered = [...products];

    // Filter by gender
    if (filters.gender.length > 0 && !filters.gender.includes("all")) {
      filtered = filtered.filter((product) =>
        filters.gender.includes(product.gioitinh ? "male" : "female")
      );
    }

    // Filter by size
    if (filters.size.length > 0) {
      filtered = filtered.filter((product) => {
        const productSizes = product.size ? product.size.split(",") : [];
        return filters.size.some((size) => productSizes.includes(size));
      });
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      filtered = filtered.filter(
        (product) => product.gia >= min && product.gia <= max
      );
    }

    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="light"
      >
        <div className="loading loading-spinner text-blue-600 loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="light"
      >
        <div className="text-2xl font-bold text-red-600">{error}</div>
      </div>
    );
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const sizes = product.size
      ? product.size.split(",").map((s) => s.trim())
      : [];

    return (
      <div
        className="w-full group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
        onMouseEnter={() => setHoveredId(product.idsanpham)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <div className="relative aspect-square overflow-hidden rounded-t-xl">
          <img
            src={product.hinhanh || hinh.src}
            alt={product.tensanpham}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <button className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
              <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
            </button>
          </div>
          {product.giamgia > 0 && (
            <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
              -{product.giamgia}%
            </span>
          )}
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-lg line-clamp-1">
                {product.tensanpham}
              </h2>
              <span className="px-2 py-1 text-xs border border-gray-300 rounded-full">
                {product.gioitinh ? "Nam" : "Nữ"}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{product.mota}</p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-blue-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.gia)}
              </p>
              {product.giamgia > 0 && (
                <p className="text-sm text-gray-500 line-through">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.gia * (1 + product.giamgia / 100))}
                </p>
              )}
            </div>

            {/* Size Display */}
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="px-2 py-1 text-xs border border-gray-300 rounded-full whitespace-nowrap"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button className="py-[2px] px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Mua
            </button>
            <Link
              href={`/component/Category?id=${product.idsanpham}`}
              className="py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Xem Chi Tiết
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Filter onFilterChange={handleFilterChange} />
      <div className="flex-1 p-8 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.idsanpham} product={product} />
            ))
          ) : (
            <div className="w-full col-span-full text-center text-gray-500">
              Không có sản phẩm nào để hiển thị
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Filter: React.FC<{ onFilterChange: (filters: Filters) => void }> = ({
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<Filters>({
    gender: [],
    size: [],
    priceRange: "",
  });

  const [selectedGender, setSelectedGender] = useState<string | null>("all");

  const handleCheckboxChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newSelectedGender = selectedGender === value ? null : value;
    setSelectedGender(newSelectedGender);

    const updatedFilters = {
      ...filters,
      gender: newSelectedGender ? [newSelectedGender] : [],
    };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSizeChange = (size: string) => {
    setFilters((prev) => {
      const newSizes = prev.size.includes(size)
        ? prev.size.filter((s) => s !== size)
        : [...prev.size, size];
      const updatedFilters = { ...prev, size: newSizes };
      onFilterChange(updatedFilters);
      return updatedFilters;
    });
  };

  const handleRadioChange = (name: string, value: string) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev, [name]: value };
      onFilterChange(updatedFilters);
      return updatedFilters;
    });
  };

  return (
    <div className="w-full md:w-1/4 p-4 border rounded ">
      <h2 className="text-xl font-semibold mb-4">Bộ lọc</h2>

      {/* Giới tính */}
      <div className="mb-6 space-y-2">
        <label className="block mb-1 font-medium">Giới tính</label>
        <div className="flex flex-col space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="gender"
              value="all"
              checked={selectedGender === "all"}
              onChange={handleCheckboxChange1}
              className="mr-2"
            />
            Tất cả
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="gender"
              value="male"
              checked={selectedGender === "male"}
              onChange={handleCheckboxChange1}
              className="mr-2"
            />
            Nam
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="gender"
              value="female"
              checked={selectedGender === "female"}
              onChange={handleCheckboxChange1}
              className="mr-2"
            />
            Nữ
          </label>
        </div>
      </div>

      {/* Size */}
      <div className="mb-6 space-y-2">
        <label className="block mb-1 font-medium">Kích thước</label>
        <div className="flex flex-wrap gap-2">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <label key={size} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={filters.size.includes(size)}
                onChange={() => handleSizeChange(size)}
                className="mr-1"
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      {/* Giá */}
      <div className="space-y-2">
        <label className="block mb-1 font-medium">Theo giá</label>
        <div className="flex flex-col space-y-2">
          {[
            "0-250000",
            "250000-500000",
            "500000-1000000",
            "1000000-2000000",
          ].map((range) => (
            <label key={range} className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                value={range}
                checked={filters.priceRange === range}
                onChange={(e) =>
                  handleRadioChange(e.target.name, e.target.value)
                }
                className="mr-2"
              />
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(range.split("-")[0]))}
              {" - "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(range.split("-")[1]))}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
