import { filterFoodsByQuery } from "@/app/lib/utils/filterFoodsByQuery";
import { tool } from "ai";
import z from "zod";

export const getSearchResults = tool({
  description:
    "Search for food items in the database by name, category, description, or ingredients",
  inputSchema: z.object({
    query: z.string().describe("The search query to find matching food items"),
  }),
  execute: async ({ query }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/get-food`,
    );
    const data = await response.json();
    const results = filterFoodsByQuery(data.foods, query);
    return { query, results };
  },
});

export const renderFoodCards = tool({
  description:
    "Render food cards for specific items the user should see. Call this after getSearchResults with only the IDs you want to display. IMPORTANT: If displaying 2 or more dishes, you MUST immediately call askForComparison with the same IDs (do NOT ask in text).",
  inputSchema: z.object({
    ids: z.array(z.number()).describe("IDs of food items to display as cards"),
  }),
  execute: async ({ ids }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/get-food`,
    );
    const data = await response.json();
    return data.foods.filter((f: any) => ids.includes(f.id));
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/get-food`,
    );
    const data = await response.json();
    const dishes = data.foods.filter((f: any) => ids.includes(f.id));
    return { dishes };
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
