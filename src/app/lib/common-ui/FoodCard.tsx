"use client";

import Image from "next/image";
import { Plus, Minus, Flame, Leaf } from "lucide-react";
import { useState, useMemo } from "react";
import { useCartStore } from "@/app/store/store";

interface FoodData {
  id: number;
  name: string;
  image: string;
  description: string;
  category: string;
  type: string;
  spiceLevel: string;
  ingredients: string[];
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  price: number;
  serves: number;
}

interface FoodCardProps {
  foodData: FoodData;
}

export default function FoodCard({ foodData }: FoodCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { cart, addToCart, decrementItem } = useCartStore();

  const quantity = useMemo(() => {
    return cart.filter((item) => item.id === foodData.id).length;
  }, [cart, foodData.id]);

  const spiceLevelColor =
    {
      Mild: "text-green-500",
      Medium: "text-amber-500",
      Hot: "text-orange-500",
      "Very Hot": "text-red-500",
    }[foodData.spiceLevel] || "text-gray-500";

  const isVeg = foodData.type === "Vegetarian";

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={foodData.image}
          alt={foodData.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-xs font-medium bg-white/90 backdrop-blur-sm rounded-full text-gray-700">
            {foodData.category}
          </span>
        </div>

        {/* Veg/Non-Veg Indicator */}
        <div className="absolute top-3 right-3">
          <div
            className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
              isVeg ? "border-green-500 bg-white" : "border-red-500 bg-white"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full ${
                isVeg ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </div>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1.5 text-sm font-bold bg-white rounded-lg shadow-md text-gray-900">
            ₹{foodData.price}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Spice Level */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-1">
            {foodData.name}
          </h3>
          <div
            className={`flex items-center gap-1 shrink-0 ${spiceLevelColor}`}
          >
            <Flame size={16} />
            <span className="text-xs font-medium">{foodData.spiceLevel}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">
          {foodData.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {foodData.ingredients.slice(0, 3).map((ingredient) => (
            <span
              key={ingredient}
              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {ingredient}
            </span>
          ))}
          {foodData.ingredients.length > 3 && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
              +{foodData.ingredients.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Nutrition Quick View */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Leaf size={14} className="text-green-500" />
              {foodData.nutrition.calories} cal
            </span>
          </div>

          {/* Add Button / Quantity Controls */}
          {quantity === 0 ? (
            <button
              onClick={() => addToCart(foodData)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm font-medium rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/25 active:scale-95"
            >
              <Plus size={16} />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => decrementItem(foodData.id)}
                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors active:scale-95"
              >
                <Minus size={14} className="text-gray-600" />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() => addToCart(foodData)}
                className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 rounded-full hover:from-orange-600 hover:to-red-600 transition-colors active:scale-95"
              >
                <Plus size={14} className="text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
