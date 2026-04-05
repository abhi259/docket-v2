import { filterFoodsByQuery } from "@/app/lib/utils/filterFoodsByQuery";
import { tool } from "ai";
import z from "zod";
import foodData from "@/app/api/get-food/Foods.json";

const getFoodsByIds = (ids: number[]) => {
  return foodData.foods.filter((f: any) => ids.includes(f.id));
};

/** Keep tool output small for chat history; full records load via renderFoodCards. */
const SEARCH_RESULTS_LIMIT = 15;

function toSearchHit(food: (typeof foodData.foods)[number]) {
  return {
    id: food.id,
    name: food.name,
    category: food.category,
    type: food.type,
    spiceLevel: food.spiceLevel,
    price: food.price,
  };
}

export const getSearchResults = tool({
  description:
    "Search for food items by name, category, description, or ingredients. Returns compact rows (id, name, category, type, spice, price) only—at most 15 matches. Use renderFoodCards with chosen ids for full details and UI. If totalMatched exceeds the limit, narrow the query.",
  inputSchema: z.object({
    query: z.string().describe("The search query to find matching food items"),
  }),
  execute: async ({ query }) => {
    const matched = filterFoodsByQuery(foodData.foods, query);
    const truncated = matched.length > SEARCH_RESULTS_LIMIT;
    const results = matched.slice(0, SEARCH_RESULTS_LIMIT).map(toSearchHit);
    return {
      query,
      results,
      totalMatched: matched.length,
      truncated,
    };
  },
});

export const renderFoodCards = tool({
  description:
    "Render food cards for specific items the user should see. Call this after getSearchResults with only the IDs you want to display. IMPORTANT: If displaying 2 or more dishes, you MUST immediately call askForComparison with the same IDs (do NOT ask in text).",
  inputSchema: z.object({
    ids: z.array(z.number()).describe("IDs of food items to display as cards"),
  }),
  execute: async ({ ids }) => {
    return getFoodsByIds(ids);
  },
});

export const askForComparison = tool({
  description:
    "Ask the user if they want to compare dishes. MUST be called immediately after renderFoodCards when more than one dish (2 or more) is displayed. This tool displays a UI prompt - do NOT ask in text. When the user confirms (confirmed: true), call compareDishes with the returned IDs. If confirmed: false, acknowledge briefly.",
  inputSchema: z.object({
    ids: z
      .array(z.number())
      .describe("IDs of the food items that were displayed"),
  }),
});

export const compareDishes = tool({
  description:
    "Display a nutritional comparison chart for the specified dishes. Call this after askForComparison returns confirmed: true.",
  inputSchema: z.object({
    ids: z.array(z.number()).describe("IDs of the dishes to compare"),
  }),
  execute: async ({ ids }) => {
    return { dishes: getFoodsByIds(ids) };
  },
});

export const addToCart = tool({
  description:
    "Add a food item to the user's cart. Use when the user asks to add an item, order something, or wants to buy a dish. The client will handle the actual cart mutation and return success/failure.",
  inputSchema: z.object({
    id: z.number().describe("The ID of the food item to add to the cart"),
    quantity: z
      .number()
      .optional()
      .default(1)
      .describe("Number of items to add (defaults to 1)"),
  }),
});

export const removeFromCart = tool({
  description:
    "Remove one instance of a food item from the cart. Use when the user wants to decrease quantity or remove one item.",
  inputSchema: z.object({
    id: z
      .number()
      .describe("The ID of the food item to remove one instance of"),
  }),
});

export const removeAllFromCart = tool({
  description:
    "Remove all instances of a specific food item from the cart. Use when the user wants to completely remove an item regardless of quantity.",
  inputSchema: z.object({
    id: z
      .number()
      .describe("The ID of the food item to completely remove from cart"),
  }),
});

export const clearCart = tool({
  description:
    "Clear the entire cart, removing all items. Use when the user wants to empty their cart or start over.",
  inputSchema: z.object({}),
});

export const proceedToCheckout = tool({
  description:
    "Proceed to checkout. Use when the user wants to checkout. This tool will display a UI prompt for the user to proceed to checkout.",
  inputSchema: z.object({}),
});

export const agentTools = {
  getSearchResults,
  renderFoodCards,
  askForComparison,
  compareDishes,
  addToCart,
  removeFromCart,
  removeAllFromCart,
  clearCart,
  proceedToCheckout,
};
