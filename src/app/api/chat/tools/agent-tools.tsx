import { filterFoodsByQuery } from "@/app/lib/utils/filterFoodsByQuery";
import { tool } from "ai";
import z from "zod";

export const getSearchResults = tool({
  description:
    "Search for food items in the database by name, category, description, or ingredients",
  inputSchema: z.object({
    query: z.string().describe("The search query to find matching food items"),
  }),
//   execute: async ({ query }) => {
//     const response = await fetch("/api/get-food");
//     const data = await response.json();
//     const foods = data.foods;
//     const results = filterFoodsByQuery(foods, query);
//     return { query, results: results };
//   },
});

export const agentTools = {
  getSearchResults,
};
