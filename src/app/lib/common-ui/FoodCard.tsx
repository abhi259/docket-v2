"use client";

import Image from "next/image";
import { Plus, Minus, Flame, Leaf, Dumbbell } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const { cart, addToCart, decrementItem } = useCartStore();

  const handleDescriptionMouseEnter = () => {
    if (descriptionRef.current) {
      const rect = descriptionRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.bottom + 8,
        left: Math.max(8, Math.min(rect.left, window.innerWidth - 360)),
      });
      setShowTooltip(true);
    }
  };

  const handleDescriptionMouseLeave = () => {
    setShowTooltip(false);
  };

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
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col"
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
      <div className="p-4 flex flex-col flex-1">
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
        <p
          ref={descriptionRef}
          className="text-gray-500 text-sm line-clamp-2 mb-3 cursor-help"
          onMouseEnter={handleDescriptionMouseEnter}
          onMouseLeave={handleDescriptionMouseLeave}
        >
          {foodData.description}
        </p>

        {/* Tooltip Portal */}
        {showTooltip &&
          createPortal(
            <div
              className="fixed z-[9999] w-[540px] p-4 bg-gray-900 text-white text-xs rounded-xl shadow-2xl pointer-events-none animate-in fade-in duration-150"
              style={{
                top: tooltipPosition.top,
                left: tooltipPosition.left,
              }}
            >
              {/* Arrow */}
              <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-900 rotate-45" />

              {/* Content */}
              <div className="relative space-y-3">
                {/* Name & Type */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{foodData.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] ${isVeg ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                  >
                    {foodData.type}
                  </span>
                </div>

                {/* Full Description */}
                <p className="text-gray-300 leading-relaxed">
                  {foodData.description}
                </p>

                {/* Category & Spice */}
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="px-2 py-0.5 bg-gray-800 rounded">
                    {foodData.category}
                  </span>
                  <span
                    className={`flex items-center gap-1 ${spiceLevelColor}`}
                  >
                    <Flame size={12} />
                    {foodData.spiceLevel}
                  </span>
                </div>

                {/* Nutrition Grid */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-orange-400 font-semibold">
                      {foodData.nutrition.calories}
                    </div>
                    <div className="text-gray-500 text-[10px]">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 font-semibold">
                      {foodData.nutrition.protein}
                    </div>
                    <div className="text-gray-500 text-[10px]">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 font-semibold">
                      {foodData.nutrition.carbs}
                    </div>
                    <div className="text-gray-500 text-[10px]">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-pink-400 font-semibold">
                      {foodData.nutrition.fat}
                    </div>
                    <div className="text-gray-500 text-[10px]">Fat</div>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="pt-2 border-t border-gray-700">
                  <div className="text-gray-400 mb-1.5">Ingredients:</div>
                  <div className="flex flex-wrap gap-1">
                    {foodData.ingredients.map((ingredient) => (
                      <span
                        key={ingredient}
                        className="px-1.5 py-0.5 bg-gray-800 text-gray-300 rounded text-[10px]"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Serves */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                  <span className="text-gray-400">
                    Serves:{" "}
                    <span className="text-white">{foodData.serves}</span>
                  </span>
                  <span className="text-lg font-bold text-green-400">
                    ₹{foodData.price}
                  </span>
                </div>
              </div>
            </div>,
            document.body,
          )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 flex-1">
          {foodData.ingredients.slice(0, 3).map((ingredient) => (
            <span
              key={ingredient}
              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full h-fit"
            >
              {ingredient}
            </span>
          ))}
          {foodData.ingredients.length > 3 && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full h-fit">
              +{foodData.ingredients.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-4">
          {/* Nutrition Quick View */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Leaf size={14} className="text-green-500" />
              {foodData.nutrition.calories} cal
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <Dumbbell size={14} className="text-blue-500" />
              {foodData.nutrition.protein} protein
            </span>
          </div>

          {/* Add Button / Quantity Controls */}
          {quantity === 0 ? (
            <button
              onClick={() => addToCart(foodData)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm font-medium rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/25 active:scale-95 cursor-pointer"
            >
              <Plus size={16} />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => decrementItem(foodData.id)}
                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors active:scale-95 cursor-pointer"
              >
                <Minus size={14} className="text-gray-600" />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() => addToCart(foodData)}
                className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 rounded-full hover:from-orange-600 hover:to-red-600 transition-colors active:scale-95 cursor-pointer"
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
