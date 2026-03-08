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

export const agentTools = {
  getSearchResults,
};
