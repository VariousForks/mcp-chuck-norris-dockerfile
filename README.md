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

The server is designed to be deployed on Vercel. You can deploy it with the following steps:

1. Fork or clone this repository
2. Deploy to Vercel with `vercel deploy`
3. Once deployed, you can use the deployed URL as an MCP server in compatible clients

## Sample Usage

You can test the MCP server using any MCP-compatible client. Here's an example using the MCP CLI:

```bash
npx @modelcontextprotocol/[cli your-vercel-deployment-url](https://mcp-chuck-norris.vercel.app/)
```

## Credits

- Jokes provided by [api.chucknorris.io](https://api.chucknorris.io/)
- Built with the [Model Context Protocol](https://modelcontextprotocol.io/)
- Hosted on [Vercel](https://vercel.com/)
