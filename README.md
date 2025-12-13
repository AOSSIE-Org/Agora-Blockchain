# Agora Blockchain

## Introduction

Agora is a library of voting algorithms like `Moore's`, `Oklahoma` , `Borda` , `IRV` etc. Some of these voting algorithms are already implemented by AOSSIE in a centralized manner using Scala as their backend. Our vision is to take these algorithms on a decentralized platform, so that, crucial votes of the voters could not be tampered with by admins, hackers, or anyone with access to the database. Blockchain technology would make the ballots immutable and hence more secure.

## Tech Stack 

- ### Backend

  - [Solidity](https://docs.soliditylang.org/en/v0.8.24/): A programming language used for developing smart contracts on the Ethereum ecosystem.
  - [Hardhat](https://hardhat.org/): A development environment for testing, deploying, and managing smart contracts.
  - [ChainLink](https://docs.chain.link/ccip): Facilitates cross-chain interoperability within the ecosystem.
  - [EIPs](https://eips.ethereum.org/): Utilized for implementing the latest Ethereum Improvement Proposals.
  - [OpenZeppelin](https://www.openzeppelin.com/): Provides a collection of well-audited, secure smart contracts that are easy to integrate and use.

- ### Client

  - [Next.js](https://nextjs.org/): A React framework used for developing the frontend of the application.
  - [Node.js](https://nodejs.org/en/) (v10.16 or later): A JavaScript runtime required for server-side development.
  - [MetaMask](https://metamask.io): A browser extension for managing Ethereum accounts and interacting with the blockchain.
  - [Vercel](https://vercel.com/) - The platform used for deploying the Next.js frontend, offering seamless deployment and hosting with serverless functions.
  - [Wagmi](https://wagmi.sh/): A set of React hooks for working with Ethereum contracts.
  - [TailwindCSS](https://tailwindcss.com/): A utility-first CSS framework for efficient styling.
  - [zustand](https://zustand.docs.pmnd.rs/getting-started/introduction): A state management library for React, used for managing global state in the Next.js application.

Here's a refined version of the development guide:

## Development Guide

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or later): [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git**: [Download here](https://git-scm.com/)
- **MetaMask** browser extension: [Install here](https://metamask.io/)

### Environment Setup

The project requires environment variables for both blockchain and client components. We provide `.env.example` files with detailed comments to help you get started.

#### Quick Setup for Local Development

For quick local testing without external services:

1. **Blockchain** (`blockchain/.env`):
   ```bash
   cp blockchain/.env.example blockchain/.env
   ```
   You can use the default Hardhat test account values provided in the comments.

2. **Client** (`client/.env`):
   ```bash
   cp client/.env.example client/.env
   ```
   For local development, you can use dummy values (some features like IPFS upload won't work).

#### Setup for Testnet/Production

For deploying to testnets or production:

1. Review the `.env.example` files in both `blockchain/` and `client/` directories
2. Each variable has detailed comments explaining:
   - What the variable is used for
   - Where to obtain the credentials
   - Differences between local/testnet/mainnet usage
3. Copy the example files and fill in your actual credentials:
   ```bash
   cp blockchain/.env.example blockchain/.env
   cp client/.env.example client/.env
   ```

⚠️ **Security Notes**:
- NEVER commit `.env` or `.env.local` files to Git
- NEVER use wallets with real funds for testing
- Keep your private keys and API keys secure

### Running Locally

**Clone the Repository**:

```bash
git clone https://github.com/AOSSIE-Org/Agora-Blockchain
```
### Option 1: Docker Setup 

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AOSSIE-Org/Agora-Blockchain
   cd Agora-Blockchain
   ```

2. **Set up Environment Variables**:
   
   Copy the example environment files and configure them:
   ```bash
   cp blockchain/.env.example blockchain/.env
   cp client/.env.example client/.env
   ```
   
   Edit the `.env` files with your credentials. See the `.env.example` files for detailed instructions on each variable.

3. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

4. **Access the Application**:
   - Frontend: http://localhost:3000
   - Blockchain Node: http://localhost:8545

The application will automatically reload when you make changes to the source code.

### Option 2: Manual Setup

#### Backend (Blockchain)

1. **Navigate to the Blockchain Directory**:
   ```bash
   cd blockchain
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration (see `.env.example` for detailed instructions).
   
   For local development only, you can use:
   ```bash
   npx hardhat node
   ```
   This starts a local blockchain at `http://localhost:8545` with test accounts.

4. **Test the Contracts**:
   ```bash
   npx hardhat test
   ```

5. **Compile & Deploy Contracts** (Optional - for testnet deployment):
   ```bash
   npx hardhat ignition deploy ./ignition/modules/<ContractModule> --network <Network> --verify
   ```

#### Frontend (Client)

1. **Navigate to the Client Directory**:
   ```bash
   cd client
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration (see `.env.example` for detailed instructions).

4. **Run the Application**:
   ```bash
   npm run dev
   ```

5. **Visit the Application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## About smart contracts

The architecture of your Election Factory contract is designed to facilitate the creation and management of elections on the blockchain, incorporating cross-chain voting capabilities through Chainlink's Cross-Chain Interoperability Protocol (CCIP). Below is a detailed explanation:

### Overview

The `ElectionFactory` contract serves as the core component of the election creation and management system. It is responsible for generating new election instances, handling cross-chain voting, and maintaining a record of active elections. The contract leverages several other contracts and libraries to achieve its functionality, including the `Election`, `BallotGenerator`, and `ResultCalculator` contracts, as well as Chainlink's CCIP components.

- ### Key Features:

  - Election Creation: Utilizes a clonable election template (electionGenerator) to efficiently create new election contracts.
  - Ballot and Result Handling: Generates ballots using the BallotGenerator contract and calculates election results with a dedicated ResultCalculator contract.
  - Cross-Chain Voting: Implements Chainlink's Cross-Chain Interoperability Protocol (CCIP) to allow voting from multiple blockchain networks.

- ### Efficiency and Security:

  - Clonable Contracts: Reduces deployment costs and resource usage by cloning a pre-deployed election template.
  - Owner Management: Ensures only the election creator can delete or modify their election, providing security and control.
  - Whitelisted Cross-Chain Communication: Only allows approved contracts to send votes across chains, preventing unauthorized access.

## Deployed Instances

- **Election Factory**: [Sepolia Testnet](https://sepolia.etherscan.io/address/0x64c720eBD5227bba57a5E8282893e71087cCcBb8#code)
- **CCIP Contract**: [FUJI Testnet](https://testnet.snowtrace.io//address/0xf267f0603672E791779E52B153BD9A39C9928767#code)
- **Frontend**: [Live URL](https://agora-blockchain.vercel.app/)

## How to Contribute

1. **Create an Issue**: For any feature requests, bugs, security concerns, or other issues, please create an issue in the repository and wait to be assigned before proceeding.
2. **Branch Management**: Always create a new branch on your forked repository to commit your changes.
3. **Pull Request Descriptions**: When submitting a pull request (PR), provide a detailed explanation in the description, outlining all changes and the reasons behind them.
4. **Community Engagement**: Post your issues and PR updates on the Agora-Blockchain [Discord channel](https://discord.gg/HrJ6eKJ28a) for visibility and discussion.

## Additional Points to Remember

1. **Testing and Code Quality**: Ensure all changes are thoroughly tested, and avoid introducing code smells.
2. **Small Changes**: If a frontend change involves fewer than 20 lines of code or if you are making documentation updates, you may directly create a PR without prior assignment.
3. **Assignment Requirement**: Do not submit unassigned PRs; they will be closed without review.
4. **Avoiding Overlap**: Before starting work, check existing issues and PRs to avoid duplicating efforts or conflicting changes.
5. **Open Review Period**: A new issue or PR will remain open for one week to allow other contributors to review and suggest improvements.
6. **Mentor Notification**: If your PR is left unattended for more than 1-2 weeks, depending on the contribution size, feel free to tag the mentors of Agora-Blockchain to get their attention.
7. **Completion Timeline**: An issue is expected to be completed within 5-30 days, depending on its complexity. If not completed within this timeframe, it may be reassigned to another contributor.
8. **Progress Updates**: If your work on an issue is taking longer than expected, ensure you provide regular updates in the issue’s or PR's comments to keep everyone informed.
9. **Working on Blockchain Components**:
   - **Error Interface Changes**: If modifying an interface for errors, ensure the corresponding error is added to `client/app/helper/ErrorMessage.ts`.
   - **Contract ABI Updates**: For changes to `ElectionFactory`, `Election`, or `CCIPSender` contracts, manually update the ABI files in `client/abi/artifacts/` (do not configure Hardhat to generate these paths automatically in the client directory).
