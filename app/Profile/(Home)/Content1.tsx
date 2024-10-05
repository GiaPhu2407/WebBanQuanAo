"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
// Define the Product interface for TypeScript
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface Category {
  id: number;
  name: string;
  items: Product[];
}

const Categories = () => {
  useEffect(() => {
    AOS.init({ duration: 2500 });
  }, []);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // Define categories with products
  const categories: Category[] = [
    {
      id: 1,
      name: "Men's Sportswear",
      items: [
        {
          id: 1,
          name: "Men's Running Shoes",
          description: "Comfortable running shoes for men.",
          price: 200000,
          imageUrl:
            "https://i.pinimg.com/736x/94/64/2e/94642e934045cbf7064d6a88e6964f8d.jpg",
        },
        {
          id: 2,
          name: "Men's Sports T-Shirt",
          description: "Breathable sports t-shirt for workouts.",
          price: 400000,
          imageUrl:
            "https://i.pinimg.com/736x/a9/3d/b0/a93db05ee62cadb090a8853276987df3.jpg",
        },
        {
          id: 3,
          name: "Men's Sports T-Shirt",
          description: "Breathable sports t-shirt for workouts.",
          price: 1000000,
          imageUrl:
            "https://i.pinimg.com/736x/a9/3d/b0/a93db05ee62cadb090a8853276987df3.jpg",
        },
        {
          id: 4,
          name: "Men's Sports T-Shirt",
          description: "Breathable sports t-shirt for workouts.",
          price: 2000000,
          imageUrl:
            "https://i.pinimg.com/736x/c6/ea/d4/c6ead4e2eb5c66316e8b712f6f1ccc8a.jpg",
        },
        {
          id: 5,
          name: "Men's Sports T-Shirt",
          description: "Breathable sports t-shirt for workouts.",
          price: 4000000,
          imageUrl:
            "https://i.pinimg.com/736x/e8/4d/ca/e84dca1997af0e1c06255954ea033399.jpg",
        },
        {
          id: 6,
          name: "Men's Sports T-Shirt",
          description: "Breathable sports t-shirt for workouts.",
          price: 5000000,
          imageUrl:
            "https://i.pinimg.com/736x/e8/4d/ca/e84dca1997af0e1c06255954ea033399.jpg",
        },
      ],
    },
    {
      id: 2,
      name: "Women's Sportswear",
      items: [
        {
          id: 7,
          name: "Women's Yoga Pants",
          description: "Flexible yoga pants for ultimate comfort.",
          price: 39.99,
          imageUrl:
            "https://i.pinimg.com/564x/79/0d/35/790d359d0f6ba16bd24fd74bef3e93da.jpg",
        },
        {
          id: 8,
          name: "Women's Sports Bra",
          description: "Supportive sports bra for all activities.",
          price: 24.99,
          imageUrl:
            "https://i.pinimg.com/564x/b1/f1/b5/b1f1b541720235808e8643a7c2cd656d.jpg",
        },
        {
          id: 9,
          name: "Women's Sports Bra",
          description: "Supportive sports bra for all activities.",
          price: 24.99,
          imageUrl:
            "https://i.pinimg.com/564x/fc/64/13/fc64131c58a806b21c46c09d16328cf8.jpg",
        },
        {
          id: 10,
          name: "Women's Sports Bra",
          description: "Supportive sports bra for all activities.",
          price: 24.99,
          imageUrl:
            "https://i.pinimg.com/564x/ef/22/73/ef22731a82b1d02d52887e12435be513.jpg",
        },
        {
          id: 11,
          name: "Women's Sports Bra",
          description: "Supportive sports bra for all activities.",
          price: 24.99,
          imageUrl:
            "https://i.pinimg.com/564x/f0/57/db/f057db11b27c82a8fc2bb0767b3e0f9b.jpg",
        },
        {
          id: 12,
          name: "Women's Sports Bra",
          description: "Supportive sports bra for all activities.",
          price: 24.99,
          imageUrl:
            "https://i.pinimg.com/736x/22/b3/cd/22b3cde45f47b614ee7593866d89c3d5.jpg",
        },
      ],
    },
    {
      id: 3,
      name: "Kids' Sportswear",
      items: [
        {
          id: 13,
          name: "Kids' Sports Shorts",
          description: "Lightweight shorts for active kids.",
          price: 19.99,
          imageUrl:
            "https://i.pinimg.com/236x/ba/cd/80/bacd80f45cfaeb5d8455cebcc503498d.jpg",
        },
        {
          id: 14,
          name: "Kids' T-Shirt",
          description: "Fun t-shirt for playful adventures.",
          price: 14.99,
          imageUrl:
            "https://i.pinimg.com/564x/aa/ad/b5/aaadb5883365433912a3abcd1b9c862d.jpg",
        },
        {
          id: 15,
          name: "Kids' T-Shirt",
          description: "Fun t-shirt for playful adventures.",
          price: 14.99,
          imageUrl:
            "https://i.pinimg.com/564x/82/ff/34/82ff34c6e472b12bfa4d2f9308a00701.jpg",
        },
        {
          id: 16,
          name: "Kids' T-Shirt",
          description: "Fun t-shirt for playful adventures.",
          price: 14.99,
          imageUrl:
            "https://i.pinimg.com/236x/f3/8e/fb/f38efba8f13c091acd3c002d1eb27924.jpg",
        },
        {
          id: 17,
          name: "Kids' T-Shirt",
          description: "Fun t-shirt for playful adventures.",
          price: 14.99,
          imageUrl:
            "https://i.pinimg.com/236x/f3/8e/fb/f38efba8f13c091acd3c002d1eb27924.jpg",
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-sans font-bold mb-4 text-center" data-aos ="fade-down">
        MỘT SỐ MẪU QUẦN ÁO{" "}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" data-aos ="fade-down">
        {categories.map((category) => (
          <button
            key={category.id}
            className="border border-gray-300 p-3 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setSelectedCategory(category)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {selectedCategory.name}
          </h2>
          <ul className=" list-inside flex flex-wrap justify-center items-center gap-10 list-none ">
            {selectedCategory.items.map((item) => (
              <li key={item.id} className="card bg-base-100 w-96 shadow-xl">
                <div className="w-full flex flex-col items-center">
                  <div className="w-full h-52 overflow-hidden rounded-t-lg">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mt-3 ml-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 ml-2 mt-2">
                      {item.description}
                    </p>
                    <div className="flex gap-4">
                      <a className="mt-4 cursor-pointer  bg-blue-500 text-white px-4 py-2 rounded-xl transform transition-transform duration-400 hover:scale-105">
                        Buy Now
                      </a>
                      <p className="font-bold ml-4 mt-4 pt-2 inline-block  px-5 rounded-xl relative border-none outline-none z-10 before:rounded-xl before:absolute before:top-0 before:left-0 before:h-full before:w-0 before:shadow-2xl before:bg-gradient-to-r from-red-500 to-pink-500  before:-z-10 before:transition-all before:duration-500 before:ease-in hover:before:w-full hover:scale-125">
                        {item.price.toLocaleString("vi-VN")} VND
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Categories;
