# Chuck Norris Jokes MCP Server for Vercel

This is a Model Context Protocol (MCP) server that provides access to the Chuck Norris Jokes API. It allows AI assistants like Claude to fetch and search for Chuck Norris jokes.

## Features

- Get random Chuck Norris jokes
- Get jokes from specific categories
- List all available joke categories
- Search for jokes by text

## Tools

The MCP server provides the following tools:

1. `get-random-joke` - Fetches a random Chuck Norris joke
2. `get-joke-from-category` - Fetches a random joke from a specified category
3. `get-categories` - Lists all available joke categories
4. `search-jokes` - Searches for jokes containing specific text

## Deployment

The server can be deployed to Vercel, or run locally in a Docker (or Podman) container.

### Deploying to Vercel

1. Fork or clone this repository
2. Deploy to Vercel with:

   ```bash
   vercel deploy
   ```

3. Once deployed, you can use the deployed URL as an MCP server in compatible clients.

### Running locally with Docker or Podman

#### Prerequisites

- Docker or Podman installed
- A Redis instance (locally or remotely) accessible via `REDIS_URL`

#### Steps

1. (If needed) Start a Redis container:

   ```bash
   docker run -d --name redis -p 6379:6379 redis:7-alpine
   ```

2. Build the server image:

   ```bash
   docker build -t mcp-server .
   ```

3. Run the server on port 4372 (or any custom port):

   ```bash
   docker run --rm -p 4372:4372 \
     -e REDIS_URL=redis://localhost:6379 \
     -e PORT=4372 \
     mcp-server
   ```

   Replace `localhost` with your Redis host if different.

#### Verifying the server

- Check the SSE endpoint (should return a text/event-stream):

  ```bash
  curl -i -N http://localhost:4372/sse
  ```

  Expected headers:
  ```
  HTTP/1.1 200 OK
  content-type: text/event-stream; charset=utf-8
  ```

- Check the `/message` endpoint without `sessionId` (should return 400):

  ```bash
  curl -i -X POST http://localhost:4372/message
  ```

  Expected response:
  ```
  HTTP/1.1 400 Bad Request
  No sessionId provided
  ```

- (Optional) Use the test client to exercise tools:

  ```bash
  # In a separate terminal, after 'docker run' above:
  npm install # if not already installed locally
  node scripts/test-client.mjs http://localhost:4372
  ```

### Using a different port

You can override the port with the `PORT` environment variable. For example, to run on port 4372:

```bash
docker run --rm -p 4372:4372 \
  -e REDIS_URL=redis://localhost:6379 \
  -e PORT=4372 \
  mcp-server
```

## Sample Usage

You can test the MCP server using any MCP-compatible client. Here's an example using the MCP CLI:

```bash
npx @modelcontextprotocol/[cli your-vercel-deployment-url](https://mcp-chuck-norris.vercel.app/)
```

## Credits

- Jokes provided by [api.chucknorris.io](https://api.chucknorris.io/)
- Built with the [Model Context Protocol](https://modelcontextprotocol.io/)
- Hosted on [Vercel](https://vercel.com/)
