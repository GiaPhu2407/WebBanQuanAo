// import React, { useState, useEffect } from "react";
// import { Category } from "@/app/component/type/product";

// interface FilterProps {
//   onFilterChange: (filters: {
//     categories: number[];
//     gender: string | null;
//     priceRange: number[];
//     sizes: string[];
//   }) => void;
// }

// const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
//   const [selectedGender, setSelectedGender] = useState<string | null>(null);
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
//   const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch("/api/loaisanpham");
//         const data = await response.json();
//         setCategories(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     const debouncedFilter = setTimeout(() => {
//       onFilterChange({
//         categories: selectedCategories,
//         gender: selectedGender,
//         priceRange,
//         sizes: selectedSizes,
//       });
//     }, 300);

//     return () => clearTimeout(debouncedFilter);
//   }, [selectedCategories, selectedGender, priceRange, selectedSizes]);

//   const handleReset = () => {
//     setSelectedCategories([]);
//     setSelectedGender(null);
//     setPriceRange([0, 10000000]);
//     setSelectedSizes([]);
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow">
//       <button
//         onClick={handleReset}
//         className="text-blue-600 hover:underline mb-4"
//       >
//         Reset Filters
//       </button>

//       <div className="space-y-6">
//         <div>
//           <h3 className="font-bold mb-2">Categories</h3>
//           {categories.map((category) => (
//             <label
//               key={category.idloaisanpham}
//               className="flex items-center gap-2"
//             >
//               <input
//                 type="checkbox"
//                 checked={selectedCategories.includes(category.idloaisanpham)}
//                 onChange={() =>
//                   setSelectedCategories((prev) =>
//                     prev.includes(category.idloaisanpham)
//                       ? prev.filter((id) => id !== category.idloaisanpham)
//                       : [...prev, category.idloaisanpham]
//                   )
//                 }
//               />
//               {category.tenloai}
//             </label>
//           ))}
//         </div>

//         <div>
//           <h3 className="font-bold mb-2">Gender</h3>
//           {["nam", "nu"].map((gender) => (
//             <label key={gender} className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 name="gender"
//                 checked={selectedGender === gender}
//                 onChange={() =>
//                   setSelectedGender((prev) => (prev === gender ? null : gender))
//                 }
//               />
//               {gender === "nam" ? "Male" : "Female"}
//             </label>
//           ))}
//         </div>

//         <div>
//           <h3 className="font-bold mb-2">Price Range</h3>
//           <div className="flex gap-2">
//             <input
//               type="number"
//               value={priceRange[0]}
//               onChange={(e) =>
//                 setPriceRange([Number(e.target.value), priceRange[1]])
//               }
//               className="border rounded p-1 w-24"
//             />
//             <span>-</span>
//             <input
//               type="number"
//               value={priceRange[1]}
//               onChange={(e) =>
//                 setPriceRange([priceRange[0], Number(e.target.value)])
//               }
//               className="border rounded p-1 w-24"
//             />
//           </div>
//         </div>

//         <div>
//           <h3 className="font-bold mb-2">Sizes</h3>
//           <div className="flex gap-2 flex-wrap">
//             {["S", "M", "L", "XL", "2XL"].map((size) => (
//               <button
//                 key={size}
//                 onClick={() =>
//                   setSelectedSizes((prev) =>
//                     prev.includes(size)
//                       ? prev.filter((s) => s !== size)
//                       : [...prev, size]
//                   )
//                 }
//                 className={`px-3 py-1 border rounded ${
//                   selectedSizes.includes(size) ? "bg-blue-600 text-white" : ""
//                 }`}
//               >
//                 {size}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Filter;

import React, { useState, useEffect } from "react";

interface FilterProps {
  onFilterChange: (filters: {
    categories: number[];
    gender: string | null;
    priceRange: [number, number];
    sizes: string[];
  }) => void;
}

interface Category {
  idloaisanpham: number;
  tenloai: string;
}

interface Size {
  id: number;
  tenSize: string;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Format price to VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Fetch categories và sizes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesResponse, sizesResponse] = await Promise.all([
          fetch("/api/loaisanpham"),
          fetch("/api/size"),
        ]);

        if (!categoriesResponse.ok || !sizesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const categoriesData = await categoriesResponse.json();
        const sizesData = await sizesResponse.json();

        setCategories(categoriesData);
        setSizes(sizesData.size);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Gọi hàm lọc mỗi khi có thay đổi trong bộ lọc
  useEffect(() => {
    onFilterChange({
      categories: selectedCategories,
      gender: selectedGender,
      priceRange: priceRange,
      sizes: selectedSizes,
    });
  }, [selectedCategories, selectedGender, priceRange, selectedSizes]);

  // Reset bộ lọc
  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedGender(null);
    setPriceRange([0, 10000000]);
    setSelectedSizes([]);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPriceRange([0, value]);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Bộ lọc</h2>
        <button
          onClick={handleReset}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          Đặt lại
        </button>
      </div>

      <div className="space-y-8">
        {/* Categories */}
        <section>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Danh mục</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category.idloaisanpham}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.idloaisanpham)}
                  onChange={() => {
                    setSelectedCategories((prev) =>
                      prev.includes(category.idloaisanpham)
                        ? prev.filter((id) => id !== category.idloaisanpham)
                        : [...prev, category.idloaisanpham]
                    );
                  }}
                  className="w-4 h-4"
                />
                <span>{category.tenloai}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Gender */}
        <section>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Giới tính
          </h3>
          <div className="flex gap-4">
            {[
              { value: "nam", label: "Nam" },
              { value: "nu", label: "Nữ" },
            ].map((gender) => (
              <label
                key={gender.value}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="gender"
                  checked={selectedGender === gender.value}
                  onChange={() => setSelectedGender(gender.value)}
                  className="w-4 h-4"
                />
                <span>{gender.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Price Range with Slider */}
        <section>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Giá</h3>
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="10000000"
              step="100000"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatPrice(0)}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </section>

        {/* Sizes */}
        <section>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Kích thước
          </h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => {
                  setSelectedSizes((prev) =>
                    prev.includes(size.tenSize)
                      ? prev.filter((s) => s !== size.tenSize)
                      : [...prev, size.tenSize]
                  );
                }}
                className={`px-4 py-2 rounded border ${
                  selectedSizes.includes(size.tenSize)
                    ? "bg-blue-600 text-white"
                    : "bg-white"
                }`}
              >
                {size.tenSize}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Filter;
