FROM node:20-slim

WORKDIR /app/blockchain

# Install Python and build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set Python path for node-gyp
ENV PYTHON=/usr/bin/python3

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npx", "hardhat", "node"]