import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// Default to localhost if no URL provided
const origin = process.argv[2] || "http://localhost:3000";

async function main() {
  console.log(`Connecting to MCP server at ${origin}...`);
  
  const transport = new SSEClientTransport(new URL(`${origin}/sse`));

  const client = new Client(
    {
      name: "chuck-norris-test-client",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  try {
    await client.connect(transport);
    console.log("Connected to MCP server successfully!");
    console.log("Server capabilities:", client.getServerCapabilities());

    // List available tools
    const toolsResult = await client.listTools();
    console.log("\nAvailable tools:");
    for (const tool of toolsResult.tools) {
      console.log(`- ${tool.name}: ${tool.description}`);
    }

    // Test the get-random-joke tool
    console.log("\nTesting get-random-joke tool...");
    const randomJokeResult = await client.callTool({
      name: "get-random-joke",
    });
    console.log("Random joke result:");
    console.log(randomJokeResult.content[0].text);

    // Test the get-categories tool
    console.log("\nTesting get-categories tool...");
    const categoriesResult = await client.callTool({
      name: "get-categories",
    });
    console.log("Categories result:");
    console.log(categoriesResult.content[0].text);

    // Test the search-jokes tool
    console.log("\nTesting search-jokes tool...");
    const searchResult = await client.callTool({
      name: "search-jokes",
      arguments: { query: "computer" },
    });
    console.log("Search result:");
    console.log(searchResult.content[0].text);

  } catch (error) {
    console.error("Error connecting to or using MCP server:", error);
  } finally {
    await client.close();
  }
}

main();
