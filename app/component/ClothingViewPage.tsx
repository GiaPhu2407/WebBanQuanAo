"use client";
import React, { useState } from "react";
import ClothingViewer360 from "./ClothingView360";

export default function Home() {
  // State for current clothing item and color
  const [currentItem, setCurrentItem] = useState("dress");
  const [currentColor, setCurrentColor] = useState("blue");
  const [isDebugMode, setIsDebugMode] = useState(false);

  // Available clothing items
  const clothingItems = [
    { id: "tshirt", name: "T-Shirt" },
    { id: "jacket", name: "Jacket" },
    { id: "pants", name: "Pants" },
    { id: "dress", name: "dress" },
  ];

  // Available colors
  const clothingColors = [
    { id: "red", name: "Red", hex: "#FF0000" },
    { id: "blue", name: "Blue", hex: "#0000FF" },
    { id: "black", name: "Black", hex: "#000000" },
    { id: "white", name: "White", hex: "#FFFFFF" },
    { id: "green", name: "Green", hex: "#00FF00" },
  ];

  // Generate the correct image path
  const getImagePath = () => {
    return `/images/clothing/${currentItem}/${currentColor}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">360° Clothing Viewer</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 360 Viewer */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <ClothingViewer360
            itemName={`${
              currentItem.charAt(0).toUpperCase() + currentItem.slice(1)
            }`}
            totalFrames={6}
            imagePath={getImagePath()}
          />

          {isDebugMode && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
              <p className="font-medium">Debug Info:</p>
              <p>Image Path: {getImagePath()}</p>
              <p>Current Item: {currentItem}</p>
              <p>Current Color: {currentColor}</p>
              <p>Expected image URL: {`${getImagePath()}/1.png`}</p>
            </div>
          )}
        </div>

        {/* Customization Panel */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Customize View</h2>

          {/* Item Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Select Item</h3>
            <div className="grid grid-cols-2 gap-2">
              {clothingItems.map((item) => (
                <button
                  key={item.id}
                  className={`py-2 px-4 rounded-lg border-2 ${
                    currentItem === item.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => setCurrentItem(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Select Color</h3>
            <div className="flex flex-wrap gap-2">
              {clothingColors.map((color) => (
                <button
                  key={color.id}
                  className={`w-10 h-10 rounded-full border-2 ${
                    currentColor === color.id
                      ? "border-blue-500 ring-2 ring-blue-300"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setCurrentColor(color.id)}
                  aria-label={`Select ${color.name} color`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Product Details</h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Item:</span>{" "}
                {clothingItems.find((item) => item.id === currentItem)?.name}
              </p>
              <p>
                <span className="font-medium">Color:</span>{" "}
                {
                  clothingColors.find((color) => color.id === currentColor)
                    ?.name
                }
              </p>
              <p>
                <span className="font-medium">Price:</span> $49.99
              </p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700">
                Add to Cart
              </button>
            </div>
          </div>

          {/* Debug Toggle */}
          <div className="mt-6 text-right">
            <button
              onClick={() => setIsDebugMode(!isDebugMode)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {isDebugMode ? "Hide Debug Info" : "Show Debug Info"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
