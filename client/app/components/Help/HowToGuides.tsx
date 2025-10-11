"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface Guide {
  id: string;
  title: string;
  description: string;
  steps: string[];
  videoUrl?: string;
}

const guides: Guide[] = [
  {
    id: "setup-wallet",
    title: "Setting Up Your Wallet",
    description: "Learn how to install and configure MetaMask for Agora Blockchain",
    steps: [
      "Install MetaMask browser extension from metamask.io",
      "Create a new wallet or import an existing one",
      "Save your seed phrase securely (never share it!)",
      "Switch to Sepolia testnet in MetaMask",
      "Get test ETH from a Sepolia faucet",
      "Connect your wallet to Agora Blockchain",
    ],
  },
  {
    id: "create-election",
    title: "Creating Your First Election",
    description: "Step-by-step guide to creating a decentralized election",
    steps: [
      "Click 'Create' in the navigation menu",
      "Enter election title and description",
      "Select a voting algorithm (e.g., Borda, IRV, Moore's)",
      "Add candidates with names and descriptions",
      "Set start and end dates for voting period",
      "Review election details and gas estimate",
      "Confirm transaction in your wallet",
      "Wait for blockchain confirmation",
      "Share your election address with voters",
    ],
  },
  {
    id: "cast-vote",
    title: "Casting a Vote",
    description: "How to participate in an election and cast your vote",
    steps: [
      "Navigate to the election page",
      "Review candidates and election details",
      "Ensure you're on the correct network",
      "Click 'Vote' on your preferred candidate(s)",
      "For ranked voting: drag to reorder candidates",
      "For score voting: assign points to each candidate",
      "Review your vote selection",
      "Confirm the transaction in your wallet",
      "Wait for transaction confirmation",
      "View confirmation receipt on the blockchain",
    ],
  },
  {
    id: "cross-chain-voting",
    title: "Cross-Chain Voting with CCIP",
    description: "Vote from different blockchain networks using Chainlink CCIP",
    steps: [
      "Connect your wallet to either Sepolia or Fuji testnet",
      "Navigate to the election you want to vote in",
      "Select 'Cross-Chain Vote' if available",
      "Choose your source network (current network)",
      "Choose destination network (where election is hosted)",
      "Cast your vote as normal",
      "Approve CCIP cross-chain transaction",
      "Wait for cross-chain message confirmation",
      "Verify vote on destination blockchain",
    ],
  },
  {
    id: "view-results",
    title: "Viewing Election Results",
    description: "How to check election outcomes and verify results on-chain",
    steps: [
      "Navigate to the completed election page",
      "Wait for the voting period to end",
      "Click 'Calculate Results' (if not auto-calculated)",
      "View winner and vote distribution",
      "Check detailed algorithm-specific results",
      "Verify results on blockchain explorer",
      "Export results as needed",
    ],
  },
];

export default function HowToGuides() {
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mb-16"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        How-To Guides
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {guides.map((guide, index) => (
          <motion.div
            key={guide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() =>
                setSelectedGuide(selectedGuide === guide.id ? null : guide.id)
              }
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                  <PlayIcon className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-gray-600">{guide.description}</p>
                  </div>
                </div>
                <ChevronRightIcon
                  className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${
                    selectedGuide === guide.id ? "transform rotate-90" : ""
                  }`}
                />
              </div>
            </div>

            <AnimatePresence>
              {selectedGuide === guide.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 bg-gray-50 border-t border-gray-200">
                    <ol className="space-y-3 mt-4">
                      {guide.steps.map((step, stepIndex) => (
                        <li
                          key={stepIndex}
                          className="flex items-start space-x-3"
                        >
                          <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
                            {stepIndex + 1}
                          </span>
                          <span className="text-gray-700 flex-1">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
