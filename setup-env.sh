#!/bin/bash

# Agora Blockchain - Environment Setup Script
# This script helps you quickly set up environment files for local development

echo "🚀 Agora Blockchain - Environment Setup"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to create blockchain .env file
setup_blockchain_env() {
    echo -e "${YELLOW}Setting up blockchain environment...${NC}"
    
    if [ -f "blockchain/.env" ]; then
        echo "⚠️  blockchain/.env already exists!"
        read -p "Do you want to overwrite it? (y/n): " overwrite
        if [ "$overwrite" != "y" ]; then
            echo "Skipping blockchain/.env"
            return
        fi
    fi
    
    read -p "Are you setting up for local development? (y/n): " local_dev
    
    if [ "$local_dev" = "y" ]; then
        cat > blockchain/.env << 'EOF'
# Local Development Configuration
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL_SEPOLIA=http://localhost:8545
RPC_URL_FUJI=http://localhost:8545
RPC_URL_AMOY=http://localhost:8545
RPC_URL_BSC=http://localhost:8545
ETHERSCAN_KEY=dummy_key_for_local_dev
EOF
        echo -e "${GREEN}✅ Created blockchain/.env with local development values${NC}"
    else
        cp blockchain/.env.example blockchain/.env
        echo -e "${GREEN}✅ Created blockchain/.env from example${NC}"
        echo -e "${YELLOW}⚠️  Please edit blockchain/.env with your credentials${NC}"
    fi
}

# Function to create client .env file
setup_client_env() {
    echo -e "${YELLOW}Setting up client environment...${NC}"
    
    if [ -f "client/.env" ]; then
        echo "⚠️  client/.env already exists!"
        read -p "Do you want to overwrite it? (y/n): " overwrite
        if [ "$overwrite" != "y" ]; then
            echo "Skipping client/.env"
            return
        fi
    fi
    
    read -p "Are you setting up for local development? (y/n): " local_dev
    
    if [ "$local_dev" = "y" ]; then
        cat > client/.env << 'EOF'
# Local Development Configuration
NEXT_PUBLIC_SEPOLIA_RPC_URL=http://localhost:8545
NEXT_PUBLIC_AMOY_RPC_URL=http://localhost:8545
NEXT_PUBLIC_FUJI_RPC_URL=http://localhost:8545
NEXT_PUBLIC_PINATA_JWT=dummy_jwt_for_local_dev
EOF
        echo -e "${GREEN}✅ Created client/.env with local development values${NC}"
        echo -e "${YELLOW}⚠️  Note: IPFS uploads won't work with dummy Pinata JWT${NC}"
    else
        cp client/.env.example client/.env
        echo -e "${GREEN}✅ Created client/.env from example${NC}"
        echo -e "${YELLOW}⚠️  Please edit client/.env with your credentials${NC}"
    fi
}

# Main execution
echo "This script will help you set up environment variables."
echo ""

# Check if .env.example files exist
if [ ! -f "blockchain/.env.example" ] || [ ! -f "client/.env.example" ]; then
    echo -e "${YELLOW}⚠️  Warning: .env.example files not found!${NC}"
    echo "Make sure you're running this script from the project root directory."
    exit 1
fi

setup_blockchain_env
echo ""
setup_client_env

echo ""
echo "========================================"
echo -e "${GREEN}✅ Environment setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Start blockchain: cd blockchain && npx hardhat node"
echo "2. Start frontend: cd client && npm run dev"
echo "3. Open http://localhost:3000"
echo ""
echo "For detailed instructions, see ENVIRONMENT_SETUP.md"
echo "========================================"
