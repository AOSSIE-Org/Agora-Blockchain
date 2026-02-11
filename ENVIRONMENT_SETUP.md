# Environment Setup Guide

This guide will help you set up your development environment for the Agora Blockchain project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start (Local Development)](#quick-start-local-development)
- [Testnet/Production Setup](#testnetproduction-setup)
- [Getting Credentials](#getting-credentials)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v18 or later) - [Download](https://nodejs.org/)
2. **npm** or **yarn** (comes with Node.js)
3. **Git** - [Download](https://git-scm.com/)
4. **MetaMask** browser extension - [Install](https://metamask.io/)
5. **(Optional) Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop) - Only if using Docker setup

### Verify Installation

```bash
node --version  # Should be v18 or higher
npm --version
git --version
```

## Quick Start (Local Development)

For contributors who want to quickly test and develop without external services:

### Step 1: Clone the Repository

```bash
git clone https://github.com/AOSSIE-Org/Agora-Blockchain
cd Agora-Blockchain
```

### Step 2: Set Up Environment Files

#### Option A: Using Scripts (Recommended)

**For Linux/Mac:**
```bash
chmod +x setup-env.sh
./setup-env.sh
```

**For Windows (PowerShell):**
```powershell
.\setup-env.ps1
```

#### Option B: Manual Setup

**Blockchain Environment:**
```bash
cp blockchain/.env.example blockchain/.env
```

Edit `blockchain/.env` and use these local development values:
```env
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL_SEPOLIA=http://localhost:8545
RPC_URL_FUJI=http://localhost:8545
RPC_URL_AMOY=http://localhost:8545
RPC_URL_BSC=http://localhost:8545
ETHERSCAN_KEY=dummy_key_for_local_dev
```

**Client Environment:**
```bash
cp client/.env.example client/.env
```

Edit `client/.env` with:
```env
NEXT_PUBLIC_SEPOLIA_RPC_URL=http://localhost:8545
NEXT_PUBLIC_AMOY_RPC_URL=http://localhost:8545
NEXT_PUBLIC_FUJI_RPC_URL=http://localhost:8545
NEXT_PUBLIC_PINATA_JWT=dummy_jwt_for_local_dev
```

### Step 3: Start Development Environment

#### Terminal 1: Start Local Blockchain
```bash
cd blockchain
npm install
npx hardhat node
```

Keep this terminal running. You'll see test accounts with 10000 ETH each.

#### Terminal 2: Start Frontend
```bash
cd client
npm install
npm run dev
```

### Step 4: Access the Application

- **Frontend**: http://localhost:3000
- **Blockchain Node**: http://localhost:8545

### Step 5: Configure MetaMask (Optional)

To interact with the local blockchain:

1. Open MetaMask
2. Click on the network dropdown → Add Network → Add a network manually
3. Enter these details:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://localhost:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH
4. Import a test account using one of the private keys from the Hardhat node output

⚠️ **Note**: These test accounts are publicly known. Never send real funds to them!

## Testnet/Production Setup

For deploying to testnets or production environments:

### Step 1: Get Required Credentials

You'll need:
1. **Wallet Private Key** (for a testnet wallet)
2. **RPC Provider URLs** (Alchemy, Infura, or QuickNode)
3. **Block Explorer API Keys** (Etherscan, Polygonscan, etc.)
4. **Pinata API Key** (for IPFS storage)

See [Getting Credentials](#getting-credentials) section for detailed instructions.

### Step 2: Configure Environment Files

Copy the example files:
```bash
cp blockchain/.env.example blockchain/.env
cp client/.env.example client/.env
```

Edit both files with your actual credentials. The `.env.example` files contain detailed comments for each variable.

### Step 3: Get Testnet Tokens

You'll need test tokens for transactions:

- **Sepolia (Ethereum)**: https://sepoliafaucet.com/
- **Fuji (Avalanche)**: https://faucet.avax.network/
- **Amoy (Polygon)**: https://faucet.polygon.technology/
- **BSC Testnet**: https://testnet.bnbchain.org/faucet-smart

### Step 4: Deploy and Test

```bash
# Test contracts
cd blockchain
npx hardhat test

# Deploy to testnet (example: Sepolia)
npx hardhat ignition deploy ./ignition/modules/YourModule --network sepolia --verify

# Run frontend
cd ../client
npm run dev
```

## Getting Credentials

### 1. Wallet Private Key

**For Testing (Recommended):**
1. Create a new MetaMask wallet specifically for testing
2. Never use a wallet with real funds
3. Export the private key: MetaMask → Account Details → Export Private Key

⚠️ **NEVER commit your private key to Git or share it publicly!**

### 2. RPC Provider URLs

Free RPC providers for blockchain access:

#### Alchemy (Recommended)
1. Sign up at https://www.alchemy.com/
2. Create a new app
3. Select your desired network (Sepolia, Polygon, etc.)
4. Copy the HTTPS endpoint

#### Infura
1. Sign up at https://www.infura.io/
2. Create a new project
3. Select your network
4. Copy the endpoint URL

#### QuickNode
1. Sign up at https://www.quicknode.com/
2. Create an endpoint
3. Select network and copy URL

### 3. Block Explorer API Keys

For contract verification:

#### Etherscan (Ethereum networks)
1. Sign up at https://etherscan.io/
2. Go to API Keys section
3. Create new API key

#### Polygonscan (Polygon networks)
1. Sign up at https://polygonscan.com/
2. Same process as Etherscan

#### Snowtrace (Avalanche)
1. Sign up at https://snowtrace.io/
2. Create API key in your account

### 4. Pinata API Key (IPFS)

For storing election metadata:

1. Sign up at https://www.pinata.cloud/
2. Go to API Keys section
3. Create new key with "pinFileToIPFS" permission
4. Copy the JWT token

## Troubleshooting

### Common Issues

#### "Cannot find module" errors
```bash
# Reinstall dependencies
cd blockchain && npm install
cd ../client && npm install
```

#### "Port 3000 already in use"
```bash
# Kill the process using port 3000
# Linux/Mac:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

#### "Failed to connect to localhost:8545"
Make sure the Hardhat node is running in a separate terminal:
```bash
cd blockchain
npx hardhat node
```

#### MetaMask not connecting
1. Ensure you're on the correct network (Hardhat Local for local dev)
2. Try resetting your MetaMask account: Settings → Advanced → Reset Account

#### Compilation errors with Hardhat
```bash
cd blockchain
npx hardhat clean
npx hardhat compile
```

#### Next.js build errors
```bash
cd client
rm -rf .next
npm run dev
```

### Getting Help

If you're still facing issues:

1. Check existing [GitHub Issues](https://github.com/AOSSIE-Org/Agora-Blockchain/issues)
2. Join the [Discord channel](https://discord.gg/HrJ6eKJ28a)
3. Create a new issue with:
   - Your error message
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)

## Security Best Practices

✅ **DO:**
- Use separate wallets for testing and production
- Keep private keys in `.env` files (already in `.gitignore`)
- Use testnet tokens for development
- Regularly rotate API keys

❌ **DON'T:**
- Commit `.env` files to Git
- Share private keys or API keys
- Use production wallets with real funds for testing
- Store credentials in code files

## Next Steps

After setting up your environment:

1. Read the main [README.md](README.md) for project overview
2. Check [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
3. Review the [Architecture Documentation](docs/)
4. Start with "good first issue" labels on GitHub

Happy Contributing! 🚀
