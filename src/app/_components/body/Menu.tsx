"use client";

import FoodCard from "@/app/lib/common-ui/FoodCard";
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

  const filteredFood = food.foods.filter(
    (item: any) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ingredients.some((ingredient: string) =>
        ingredient.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const filteredFoodByCategory =
    selectedCategory === "All Items"
      ? filteredFood
      : filteredFood.filter(
          (item: any) => item.category === selectedCategory
        );

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFoodByCategory.map((item: any) => (
            <FoodCard key={item.id} foodData={item} />
          ))}
        </div>
      )}
    </div>
  );
}
