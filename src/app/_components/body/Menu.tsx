"use client";

import FoodCard from "@/app/lib/common-ui/FoodCard";
import { filterFoodsByQuery } from "@/app/lib/utils/filterFoodsByQuery";
import { useFoodStore } from "@/app/store/store";
import { useEffect, useState } from "react";

export default function Menu() {
  const { food, setFood, searchQuery, selectedCategory } = useFoodStore();
  const [loading, setLoading] = useState(false);

  const getFood = async () => {
    setLoading(true);
    const response = await fetch("/api/get-food");
    const data = await response.json();
    setFood(data);
    setLoading(false);
  };

  useEffect(() => {
    getFood();
  }, []);

  const filteredFood = filterFoodsByQuery(food.foods, searchQuery);

  const filteredFoodByCategory =
    selectedCategory === "All Items"
      ? filteredFood
      : filteredFood.filter((item: any) => item.category === selectedCategory);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {filteredFoodByCategory.map((item: any) => (
            <FoodCard key={item.id} foodData={item} />
          ))}
        </div>
      )}
    </div>
  );
}
