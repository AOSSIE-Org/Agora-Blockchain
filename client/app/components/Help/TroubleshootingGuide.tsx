"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExclamationTriangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

interface Issue {
  id: string;
  title: string;
  symptoms: string[];
  solutions: string[];
}

const commonIssues: Issue[] = [
  {
    id: "wallet-not-connecting",
    title: "Wallet Not Connecting",
    symptoms: [
      "Can't see 'Connect Wallet' button response",
      "MetaMask popup doesn't appear",
      "Connection request times out",
    ],
    solutions: [
      "Refresh the page and try again",
      "Make sure MetaMask extension is installed and unlocked",
      "Check if you're using a supported browser (Chrome, Firefox, Brave)",
      "Clear browser cache and cookies",
      "Try disabling other wallet extensions temporarily",
      "Update MetaMask to the latest version",
    ],
  },
  {
    id: "transaction-failing",
    title: "Transaction Keeps Failing",
    symptoms: [
      "Transaction reverts with an error",
      "Gas estimation fails",
      "Transaction stays pending forever",
    ],
    solutions: [
      "Ensure you have enough test ETH for gas fees",
      "Check if you're connected to the correct network (Sepolia/Fuji)",
      "Try increasing gas limit manually in MetaMask",
      "Wait for network congestion to decrease",
      "Cancel pending transactions if stuck",
      "Check contract requirements (e.g., voting period, eligibility)",
    ],
  },
  {
    id: "wrong-network",
    title: "Connected to Wrong Network",
    symptoms: [
      "Can't see your elections",
      "Transactions don't go through",
      "Balance shows as zero",
    ],
    solutions: [
      "Open MetaMask and switch to Sepolia testnet",
      "Add custom network if using Fuji (Avalanche testnet)",
      "Check network configuration in MetaMask settings",
      "Verify RPC URLs match the documentation",
      "Clear MetaMask activity and nonce data",
    ],
  },
  {
    id: "insufficient-funds",
    title: "Insufficient Funds for Gas",
    symptoms: [
      "Error message about insufficient funds",
      "Can't complete transactions",
      "Balance too low warning",
    ],
    solutions: [
      "Get test ETH from Sepolia faucet (Alchemy, Infura, or Chainlink)",
      "Wait 24 hours if faucet has cooldown period",
      "Use multiple faucets for more test tokens",
      "Ask in Discord community for test tokens",
      "Verify you're requesting from correct network faucet",
    ],
  },
  {
    id: "vote-not-recorded",
    title: "My Vote Wasn't Recorded",
    symptoms: [
      "Transaction succeeded but vote not showing",
      "Vote count didn't increase",
      "Can't see vote in transaction history",
    ],
    solutions: [
      "Wait a few minutes for blockchain confirmation",
      "Check transaction on block explorer (Etherscan/Snowtrace)",
      "Refresh the page to update vote count",
      "Verify you voted before election ended",
      "Check if you already voted (most elections allow one vote)",
      "Ensure you're viewing the correct election",
    ],
  },
  {
    id: "election-not-loading",
    title: "Election Page Not Loading",
    symptoms: [
      "Blank page or loading spinner",
      "404 error",
      "Election details not showing",
    ],
    solutions: [
      "Verify the election address/ID is correct",
      "Check if you're connected to the right network",
      "Try refreshing the page",
      "Clear browser cache",
      "Check if election was deleted by creator",
      "Verify blockchain connection is active",
    ],
  },
  {
    id: "cross-chain-issues",
    title: "Cross-Chain Voting Not Working",
    symptoms: [
      "CCIP transaction fails",
      "Vote doesn't appear on destination chain",
      "Higher than expected fees",
    ],
    solutions: [
      "Ensure both source and destination networks are supported",
      "Have enough tokens for cross-chain fees (higher than normal)",
      "Wait longer for cross-chain confirmation (can take minutes)",
      "Check CCIP contract allowlist for supported routes",
      "Verify both contracts are properly whitelisted",
      "Try direct voting on the election's native chain instead",
    ],
  },
  {
    id: "metamask-errors",
    title: "MetaMask Error Messages",
    symptoms: [
      '"User rejected the request"',
      '"Nonce too high"',
      '"Gas required exceeds allowance"',
    ],
    solutions: [
      "User rejected: Click approve/confirm in MetaMask popup",
      "Nonce too high: Reset account in MetaMask settings",
      "Gas exceeds allowance: Increase gas limit or wait for lower network fees",
      "Check MetaMask for specific error details",
      "Update MetaMask to latest version",
      "Report persistent errors on GitHub or Discord",
    ],
  },
];

export default function TroubleshootingGuide() {
  const [openIssue, setOpenIssue] = useState<string | null>(null);

  const toggleIssue = (id: string) => {
    setOpenIssue(openIssue === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mb-16"
    >
      <div className="flex items-center mb-6">
        <ExclamationTriangleIcon className="h-8 w-8 text-orange-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">
          Troubleshooting Guide
        </h2>
      </div>
      <div className="space-y-4">
        {commonIssues.map((issue) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-orange-500"
          >
            <button
              onClick={() => toggleIssue(issue.id)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">{issue.title}</span>
              <ChevronDownIcon
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  openIssue === issue.id ? "transform rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {openIssue === issue.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Symptoms:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {issue.symptoms.map((symptom, index) => (
                          <li key={index}>{symptom}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Solutions:
                      </h4>
                      <ol className="space-y-2">
                        {issue.solutions.map((solution, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold">
                              {index + 1}
                            </span>
                            <span className="text-gray-700 flex-1">
                              {solution}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
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
