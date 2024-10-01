"use client";
import React, { useState } from "react";

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
          price: 59.99,
          imageUrl:
            "https://i.pinimg.com/736x/94/64/2e/94642e934045cbf7064d6a88e6964f8d.jpg",
        },
        {
          id: 2,
          name: "Men's Sports T-Shirt",
          description: "Breathable sports t-shirt for workouts.",
          price: 29.99,
          imageUrl:
            "https://i.pinimg.com/736x/a9/3d/b0/a93db05ee62cadb090a8853276987df3.jpg",
        },
        {
          id: 3,
          name: "Men's Sports T-Shirt",
          description: "Breathable sports t-shirt for workouts.",
          price: 29.99,
          imageUrl:
            "https://i.pinimg.com/736x/a9/3d/b0/a93db05ee62cadb090a8853276987df3.jpg",
        },
        {
          id: 4,
          name: "Men's Sports T-Shirt",
          description: "Breathable sports t-shirt for workouts.",
          price: 29.99,
          imageUrl:
            "https://i.pinimg.com/736x/c6/ea/d4/c6ead4e2eb5c66316e8b712f6f1ccc8a.jpg",
        },
        {
          id: 5,
          name: "Men's Sports T-Shirt",
          description: "Breathable sports t-shirt for workouts.",
          price: 29.99,
          imageUrl:
            "https://i.pinimg.com/736x/e8/4d/ca/e84dca1997af0e1c06255954ea033399.jpg",
        },
        {
          id: 6,
          name: "Men's Sports T-Shirt",
          description: "Breathable sports t-shirt for workouts.",
          price: 29.99,
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
            "https://i.pinimg.com/564x/c7/ab/90/c7ab900887398396d822d88b0a7b9b97.jpg",
        },
        {
          id: 8,
          name: "Women's Sports Bra",
          description: "Supportive sports bra for all activities.",
          price: 24.99,
          imageUrl:
            "https://i.pinimg.com/564x/9d/dd/07/9ddd0720fceef5bae31e2559800e581b.jpg",
        },
        {
          id: 9,
          name: "Women's Sports Bra",
          description: "Supportive sports bra for all activities.",
          price: 24.99,
          imageUrl:
            "https://i.pinimg.com/564x/9d/dd/07/9ddd0720fceef5bae31e2559800e581b.jpg",
        },
        {
          id: 10,
          name: "Women's Sports Bra",
          description: "Supportive sports bra for all activities.",
          price: 24.99,
          imageUrl:
            "https://i.pinimg.com/564x/9d/dd/07/9ddd0720fceef5bae31e2559800e581b.jpg",
        },
        {
          id: 11,
          name: "Women's Sports Bra",
          description: "Supportive sports bra for all activities.",
          price: 24.99,
          imageUrl:
            "https://i.pinimg.com/564x/9d/dd/07/9ddd0720fceef5bae31e2559800e581b.jpg",
        },
        {
          id: 12,
          name: "Women's Sports Bra",
          description: "Supportive sports bra for all activities.",
          price: 24.99,
          imageUrl:
            "https://i.pinimg.com/564x/9d/dd/07/9ddd0720fceef5bae31e2559800e581b.jpg",
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
            "https://i.pinimg.com/236x/f3/8e/fb/f38efba8f13c091acd3c002d1eb27924.jpg",
        },
        {
          id: 15,
          name: "Kids' T-Shirt",
          description: "Fun t-shirt for playful adventures.",
          price: 14.99,
          imageUrl:
            "https://i.pinimg.com/236x/f3/8e/fb/f38efba8f13c091acd3c002d1eb27924.jpg",
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
    <div className="container mx-auto p-4 mt-[950px]">
      <h1 className="text-2xl font-sans font-bold mb-4 text-center">
        MỘT SỐ MẪU QUẦN ÁO{" "}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                    <p className="font-bold ml-4 mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                    <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded transform transition-transform duration-400 hover:scale-105">
                      Buy Now
                    </button>
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
