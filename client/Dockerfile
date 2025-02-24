FROM node:20-slim

WORKDIR /app/client

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

EXPOSE 3000

# Use 0.0.0.0 to allow external connections
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["npm", "run", "dev"]