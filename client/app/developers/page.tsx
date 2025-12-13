"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CodeBracketIcon,
  BookOpenIcon,
  RocketLaunchIcon,
  CubeIcon,
  CommandLineIcon,
  DocumentTextIcon,
  BeakerIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

interface DocSection {
  id: string;
  title: string;
  icon: any;
  content: string;
}

const docSections: DocSection[] = [
  {
    id: "quickstart",
    title: "Quick Start",
    icon: RocketLaunchIcon,
    content: `Get started with Agora Blockchain in minutes. Follow our step-by-step guide to create your first decentralized election.

## Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/AOSSIE-Org/Agora-Blockchain.git
cd Agora-Blockchain

# Install dependencies
npm install

# Start local blockchain
cd blockchain && npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Start the client
cd ../client && npm run dev
\`\`\`

## Your First Election

1. Connect your MetaMask wallet
2. Navigate to "Create Election"
3. Fill in election details and add candidates
4. Choose a voting algorithm (Borda, IRV, etc.)
5. Deploy and share your election!`,
  },
  {
    id: "smart-contracts",
    title: "Smart Contracts",
    icon: CubeIcon,
    content: `## Core Contracts

### Election.sol
The main contract for managing individual elections.

\`\`\`solidity
contract Election {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }
    
    mapping(address => bool) public hasVoted;
    mapping(uint256 => Candidate) public candidates;
    
    function vote(uint256 candidateId) public {
        require(!hasVoted[msg.sender], "Already voted");
        require(candidateId > 0 && candidateId <= candidatesCount);
        
        candidates[candidateId].voteCount++;
        hasVoted[msg.sender] = true;
    }
}
\`\`\`

### ElectionFactory.sol
Factory contract for creating new elections.

\`\`\`solidity
contract ElectionFactory {
    address[] public elections;
    
    function createElection(
        string memory _title,
        string memory _description
    ) public returns (address) {
        Election newElection = new Election(_title, _description, msg.sender);
        elections.push(address(newElection));
        return address(newElection);
    }
}
\`\`\`

## Voting Algorithms

Agora supports multiple voting algorithms:
- **Borda Count**: Ranked-choice voting system
- **Instant Runoff Voting (IRV)**: Eliminates candidates with fewest votes
- **Moore's Method**: Condorcet-compliant voting
- **Oklahoma Method**: Modified Borda count`,
  },
  {
    id: "api-reference",
    title: "API Reference",
    icon: CodeBracketIcon,
    content: `## Web3 Integration

### Connecting Wallet

\`\`\`typescript
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

function App() {
  const { address, isConnected } = useAccount();
  
  return (
    <ConnectButton />
  );
}
\`\`\`

### Reading Election Data

\`\`\`typescript
import { useContractRead } from 'wagmi';
import ElectionABI from './abi/Election.json';

function ElectionDetails({ address }) {
  const { data: title } = useContractRead({
    address: address,
    abi: ElectionABI,
    functionName: 'title',
  });
  
  const { data: candidateCount } = useContractRead({
    address: address,
    abi: ElectionABI,
    functionName: 'candidatesCount',
  });
  
  return (
    <div>
      <h2>{title}</h2>
      <p>{candidateCount} candidates</p>
    </div>
  );
}
\`\`\`

### Casting a Vote

\`\`\`typescript
import { useContractWrite } from 'wagmi';
import ElectionABI from './abi/Election.json';

function VoteButton({ electionAddress, candidateId }) {
  const { write: vote } = useContractWrite({
    address: electionAddress,
    abi: ElectionABI,
    functionName: 'vote',
    args: [candidateId],
  });
  
  return (
    <button onClick={() => vote()}>
      Vote for Candidate {candidateId}
    </button>
  );
}
\`\`\`

## Contract Events

\`\`\`typescript
import { useContractEvent } from 'wagmi';

function ElectionMonitor({ address }) {
  useContractEvent({
    address: address,
    abi: ElectionABI,
    eventName: 'VoteCast',
    listener: (log) => {
      console.log('Vote cast:', log);
    },
  });
}
\`\`\``,
  },
  {
    id: "integration",
    title: "Integration Guide",
    icon: BeakerIcon,
    content: `## Integrating Agora into Your DApp

### 1. Install Dependencies

\`\`\`bash
npm install wagmi viem @rainbow-me/rainbowkit
\`\`\`

### 2. Configure Wagmi

\`\`\`typescript
import { createConfig, configureChains } from 'wagmi';
import { sepolia, polygonAmoy } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [sepolia, polygonAmoy],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
});
\`\`\`

### 3. Wrap Your App

\`\`\`typescript
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
\`\`\`

### 4. Create an Election

\`\`\`typescript
const { write: createElection } = useContractWrite({
  address: FACTORY_ADDRESS,
  abi: ElectionFactoryABI,
  functionName: 'createElection',
  args: ['My Election', 'Description', ['Alice', 'Bob']],
});
\`\`\`

## Testing

\`\`\`bash
# Run contract tests
cd blockchain
npx hardhat test

# Run frontend tests
cd client
npm test
\`\`\``,
  },
  {
    id: "sdk",
    title: "SDK & Tools",
    icon: CommandLineIcon,
    content: `## Available SDKs

### JavaScript/TypeScript SDK

\`\`\`bash
npm install @agora-blockchain/sdk
\`\`\`

\`\`\`typescript
import { AgoraClient } from '@agora-blockchain/sdk';

const client = new AgoraClient({
  network: 'sepolia',
  privateKey: process.env.PRIVATE_KEY,
});

// Create election
const election = await client.createElection({
  title: 'My Election',
  candidates: ['Alice', 'Bob', 'Charlie'],
  algorithm: 'borda',
});

// Cast vote
await election.vote(candidateId);

// Get results
const results = await election.getResults();
\`\`\`

## Development Tools

### Hardhat Configuration

\`\`\`javascript
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
\`\`\`

### Useful Scripts

\`\`\`json
{
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "deploy": "hardhat run scripts/deploy.js",
    "verify": "hardhat verify --network sepolia"
  }
}
\`\`\`

## Debugging

\`\`\`bash
# Enable verbose logging
DEBUG=* npm run dev

# Check contract deployment
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
\`\`\``,
  },
  {
    id: "contributing",
    title: "Contributing",
    icon: DocumentTextIcon,
    content: `## How to Contribute

We welcome contributions from the community! Here's how you can help:

### 1. Fork the Repository

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/Agora-Blockchain.git
cd Agora-Blockchain
git remote add upstream https://github.com/AOSSIE-Org/Agora-Blockchain.git
\`\`\`

### 2. Create a Branch

\`\`\`bash
git checkout -b feat/my-feature
# or
git checkout -b fix/bug-description
\`\`\`

### 3. Make Your Changes

- Write clean, documented code
- Follow existing code style
- Add tests for new features
- Update documentation

### 4. Commit Standards

\`\`\`bash
# Feature
git commit -m "feat: add new voting algorithm"

# Bug fix
git commit -m "fix: resolve wallet connection issue"

# Documentation
git commit -m "docs: update API reference"
\`\`\`

### 5. Submit Pull Request

1. Push to your fork
2. Open a PR against \`main\` branch
3. Describe your changes
4. Wait for review

## Code Style

- Use TypeScript for frontend
- Use Solidity 0.8.x for contracts
- Follow ESLint configuration
- Write meaningful commit messages

## Testing Requirements

- All smart contracts must have test coverage
- Frontend components should have unit tests
- Integration tests for critical flows

## Need Help?

- Join our Discord community
- Check existing issues and discussions
- Read the documentation thoroughly`,
  },
];

const resources = [
  {
    title: "GitHub Repository",
    description: "View source code and contribute",
    icon: CodeBracketIcon,
    link: "https://github.com/AOSSIE-Org/Agora-Blockchain",
  },
  {
    title: "Smart Contracts",
    description: "Explore deployed contracts",
    icon: CubeIcon,
    link: "https://github.com/AOSSIE-Org/Agora-Blockchain/tree/main/blockchain/contracts",
  },
  {
    title: "API Documentation",
    description: "Complete API reference",
    icon: BookOpenIcon,
    link: "https://github.com/AOSSIE-Org/Agora-Blockchain#readme",
  },
  {
    title: "Community Discord",
    description: "Join developer discussions",
    icon: CommandLineIcon,
    link: "https://aossie.org",
  },
];

export default function DevelopersPage() {
  const [activeSection, setActiveSection] = useState("quickstart");

  const currentSection = docSections.find((s) => s.id === activeSection);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Developer Portal
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Build decentralized voting applications with Agora Blockchain.
            Comprehensive guides, API docs, and tools for developers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Documentation
              </h2>
              <nav className="space-y-2">
                {docSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <section.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                {currentSection && (
                  <>
                    <currentSection.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {currentSection.title}
                    </h2>
                  </>
                )}
              </div>

              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div
                  className="text-gray-700 dark:text-gray-300 space-y-4"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {currentSection?.content.split("\n").map((line, idx) => {
                    // Headers
                    if (line.startsWith("## ")) {
                      return (
                        <h2
                          key={idx}
                          className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4"
                        >
                          {line.replace("## ", "")}
                        </h2>
                      );
                    }
                    if (line.startsWith("### ")) {
                      return (
                        <h3
                          key={idx}
                          className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3"
                        >
                          {line.replace("### ", "")}
                        </h3>
                      );
                    }
                    // Code blocks
                    if (line.startsWith("```")) {
                      return null;
                    }
                    // List items
                    if (line.startsWith("- ")) {
                      return (
                        <li key={idx} className="ml-6">
                          {line.replace("- ", "")}
                        </li>
                      );
                    }
                    // Regular paragraphs
                    if (line.trim()) {
                      return (
                        <p key={idx} className="leading-relaxed">
                          {line}
                        </p>
                      );
                    }
                    return <br key={idx} />;
                  })}
                </div>
              </div>
            </div>
          </motion.main>
        </div>

        {/* Resources Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Resources & Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <motion.a
                key={index}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <resource.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {resource.description}
                </p>
              </motion.a>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
