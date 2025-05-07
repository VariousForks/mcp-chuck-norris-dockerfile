import http from "http";
import handler from "./api/server.ts";

// Read port from environment or default to 3000
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Ensure Redis URL is provided
if (!process.env.REDIS_URL) {
  console.error("Error: REDIS_URL environment variable is not set");
  process.exit(1);
}

// Create HTTP server and delegate requests to the MCP handler
const server = http.createServer(async (req, res) => {
  await handler(req, res);
});

server.listen(port, () => {
  console.log(`MCP server listening on port ${port}`);
});