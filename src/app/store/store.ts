import { create } from "zustand";

interface FoodItem {
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

interface FoodState {
  food: { foods: FoodItem[] };
  setFood: (food: { foods: FoodItem[] }) => void;
  selectedCategory: string;
  setSelectedCategory: (selectedCategory: string) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
}

export const useFoodStore = create<FoodState>((set) => ({
  food: { foods: [] },
  setFood: (food) => set({ food }),
  selectedCategory: "All Items",
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));

interface CartState {
  cart: FoodItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (item: FoodItem) => void;
  decrementItem: (itemId: number) => void;
  removeAllOfItem: (itemId: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (item) =>
    set((state) => ({ cart: state.cart.filter((i) => i.id !== item.id) })),
  decrementItem: (itemId) =>
    set((state) => {
      const index = state.cart.findIndex((i) => i.id === itemId);
      if (index !== -1) {
        const newCart = [...state.cart];
        newCart.splice(index, 1);
        return { cart: newCart };
      }
      return state;
    }),
  removeAllOfItem: (itemId) =>
    set((state) => ({ cart: state.cart.filter((i) => i.id !== itemId) })),
  clearCart: () => set({ cart: [] }),
}));
