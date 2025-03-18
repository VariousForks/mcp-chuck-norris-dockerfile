import { z } from "zod";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";

// Chuck Norris API base URL
const CHUCK_API_BASE = "https://api.chucknorris.io/jokes";

// Define interfaces for API responses
interface ChuckJoke {
  icon_url: string;
  id: string;
  url: string;
  value: string;
}

interface ChuckSearchResult {
  total: number;
  result: ChuckJoke[];
}

const handler = initializeMcpApiHandler(
  (server) => {
    // Tool 1: Get a random joke
    server.tool("get-random-joke", "Get a random Chuck Norris joke", {}, async () => {
      try {
        const response = await fetch(`${CHUCK_API_BASE}/random`);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const joke: ChuckJoke = await response.json();
        return {
          content: [
            {
              type: "text",
              text: `${joke.value}\n\n(Joke ID: ${joke.id})`,
            },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error fetching joke: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });

    // Tool 2: Get a random joke from category
    server.tool(
      "get-joke-from-category",
      "Get a random Chuck Norris joke from a specific category",
      {
        category: z.string().describe("The category name (e.g., animal, dev, food)"),
      },
      async ({ category }) => {
        try {
          const response = await fetch(`${CHUCK_API_BASE}/random?category=${encodeURIComponent(category)}`);
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
          const joke: ChuckJoke = await response.json();
          return {
            content: [
              {
                type: "text",
                text: `${joke.value}\n\nCategory: ${category}\n(Joke ID: ${joke.id})`,
              },
            ],
          };
        } catch (error) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `Error fetching joke from category '${category}': ${
                  error instanceof Error ? error.message : String(error)
                }`,
              },
            ],
          };
        }
      }
    );

    // Tool 3: Get categories
    server.tool("get-categories", "Get all available Chuck Norris joke categories", {}, async () => {
      try {
        const response = await fetch(`${CHUCK_API_BASE}/categories`);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const categories: string[] = await response.json();
        return {
          content: [
            {
              type: "text",
              text: `Available categories:\n\n${categories.map((cat) => `- ${cat}`).join("\n")}`,
            },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error fetching categories: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });

    // Tool 4: Search jokes
    server.tool(
      "search-jokes",
      "Search for Chuck Norris jokes containing specific text",
      {
        query: z.string().min(3).describe("Search query (minimum 3 characters)"),
      },
      async ({ query }) => {
        try {
          if (query.length < 3) {
            return {
              isError: true,
              content: [
                {
                  type: "text",
                  text: "Search query must be at least 3 characters long",
                },
              ],
            };
          }

          const response = await fetch(`${CHUCK_API_BASE}/search?query=${encodeURIComponent(query)}`);
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
          
          const searchResult: ChuckSearchResult = await response.json();
          
          if (searchResult.total === 0) {
            return {
              content: [
                {
                  type: "text",
                  text: `No jokes found containing "${query}"`,
                },
              ],
            };
          }

          // Limit results to 5 jokes to avoid overwhelming responses
          const jokesToShow = searchResult.result.slice(0, 5);
          const moreCount = Math.max(0, searchResult.total - 5);
          
          return {
            content: [
              {
                type: "text",
                text: 
                  `Found ${searchResult.total} jokes containing "${query}":\n\n` +
                  jokesToShow.map((joke, index) => `${index + 1}. ${joke.value}`).join("\n\n") +
                  (moreCount > 0 ? `\n\n...and ${moreCount} more jokes` : ""),
              },
            ],
          };
        } catch (error) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `Error searching jokes: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      }
    );
  },
  {
    capabilities: {
      tools: {
        "get-random-joke": {
          description: "Get a random Chuck Norris joke",
        },
        "get-joke-from-category": {
          description: "Get a random Chuck Norris joke from a specified category",
        },
        "get-categories": {
          description: "Get a list of all available joke categories",
        },
        "search-jokes": {
          description: "Search for Chuck Norris jokes containing specific text",
        },
      },
    },
  }
);

export default handler;
