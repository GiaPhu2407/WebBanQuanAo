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
      <div className="loader">
        <div className="truckWrapper">
          <div className="truckBody">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 198 93"
              className="trucksvg"
            >
              <path
                stroke-width="3"
                stroke="#282828"
                fill="#F83D3D"
                d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z"
              ></path>
              <path
                stroke-width="3"
                stroke="#282828"
                fill="#7D7C7C"
                d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z"
              ></path>
              <path
                stroke-width="2"
                stroke="#282828"
                fill="#282828"
                d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z"
              ></path>
              <rect
                stroke-width="2"
                stroke="#282828"
                fill="#FFFCAB"
                rx="1"
                height="7"
                width="5"
                y="63"
                x="187"
              ></rect>
              <rect
                stroke-width="2"
                stroke="#282828"
                fill="#282828"
                rx="1"
                height="11"
                width="4"
                y="81"
                x="193"
              ></rect>
              <rect
                stroke-width="3"
                stroke="#282828"
                fill="#DFDFDF"
                rx="2.5"
                height="90"
                width="121"
                y="1.5"
                x="6.5"
              ></rect>
              <rect
                stroke-width="2"
                stroke="#282828"
                fill="#DFDFDF"
                rx="2"
                height="4"
                width="6"
                y="84"
                x="1"
              ></rect>
            </svg>
          </div>
          <div className="truckTires">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 30 30"
              className="tiresvg"
            >
              <circle
                stroke-width="3"
                stroke="#282828"
                fill="#282828"
                r="13.5"
                cy="15"
                cx="15"
              ></circle>
              <circle fill="#DFDFDF" r="7" cy="15" cx="15"></circle>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 30 30"
              className="tiresvg"
            >
              <circle
                stroke-width="3"
                stroke="#282828"
                fill="#282828"
                r="13.5"
                cy="15"
                cx="15"
              ></circle>
              <circle fill="#DFDFDF" r="7" cy="15" cx="15"></circle>
            </svg>
          </div>
          <div className="road"></div>

          <svg
            // xml:space="preserve"
            viewBox="0 0 453.459 453.459"
            // xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns="http://www.w3.org/2000/svg"
            id="Capa_1"
            version="1.1"
            fill="#000000"
            className="lampPost"
          >
            <path
              d="M252.882,0c-37.781,0-68.686,29.953-70.245,67.358h-6.917v8.954c-26.109,2.163-45.463,10.011-45.463,19.366h9.993
  c-1.65,5.146-2.507,10.54-2.507,16.017c0,28.956,23.558,52.514,52.514,52.514c28.956,0,52.514-23.558,52.514-52.514
  c0-5.478-0.856-10.872-2.506-16.017h9.992c0-9.354-19.352-17.204-45.463-19.366v-8.954h-6.149C200.189,38.779,223.924,16,252.882,16
  c29.952,0,54.32,24.368,54.32,54.32c0,28.774-11.078,37.009-25.105,47.437c-17.444,12.968-37.216,27.667-37.216,78.884v113.914
  h-0.797c-5.068,0-9.174,4.108-9.174,9.177c0,2.844,1.293,5.383,3.321,7.066c-3.432,27.933-26.851,95.744-8.226,115.459v11.202h45.75
  v-11.202c18.625-19.715-4.794-87.527-8.227-115.459c2.029-1.683,3.322-4.223,3.322-7.066c0-5.068-4.107-9.177-9.176-9.177h-0.795
  V196.641c0-43.174,14.942-54.283,30.762-66.043c14.793-10.997,31.559-23.461,31.559-60.277C323.202,31.545,291.656,0,252.882,0z
  M232.77,111.694c0,23.442-19.071,42.514-42.514,42.514c-23.442,0-42.514-19.072-42.514-42.514c0-5.531,1.078-10.957,3.141-16.017
  h78.747C231.693,100.736,232.77,106.162,232.77,111.694z"
            ></path>
          </svg>
        </div>
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
              {/* <h2 className="font-semibold text-lg line-clamp-1">
                {product.tensanpham}
              </h2> */}
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
