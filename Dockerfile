# Dockerfile for MCP Chuck Norris Jokes Server
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install pnpm for consistent installs
RUN npm install -g pnpm@8.15.7

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the MCP server bundle
RUN npm run build

# Expose custom port (default 4372)
EXPOSE 4372

# Default environment variables
ENV PORT=4372

# Entrypoint
CMD ["npm", "start"]