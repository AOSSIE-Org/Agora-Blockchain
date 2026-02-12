FROM ghcr.io/foundry-rs/foundry:latest

WORKDIR /app

# Install Node.js and npm
RUN apk add --no-cache nodejs npm

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the project
RUN forge build

# Set the entrypoint to anvil (local testnet) or forge
CMD ["anvil", "--host", "0.0.0.0"]