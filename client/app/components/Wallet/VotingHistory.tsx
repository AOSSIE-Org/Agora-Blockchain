"use client";

import React, { useState, useEffect } from "react";
import {
  ClockIcon,
  CheckBadgeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useChainId } from "wagmi";

interface VotingHistoryProps {
  address: `0x${string}` | undefined;
}

interface VoteRecord {
  id: string;
  electionName: string;
  timestamp: Date;
  txHash: string;
  network: string;
}

const VotingHistory: React.FC<VotingHistoryProps> = ({ address }) => {
  const chainId = useChainId();
  const [votingHistory, setVotingHistory] = useState<VoteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulated voting history - In production, this would fetch from blockchain
    // or a backend service tracking user's voting activities
    const fetchVotingHistory = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock data - Replace with actual blockchain queries
      const mockHistory: VoteRecord[] = [];
      
      setVotingHistory(mockHistory);
      setIsLoading(false);
    };

    if (address) {
      fetchVotingHistory();
    }
  }, [address, chainId]);

  const getNetworkName = (network: string) => {
    switch (network) {
      case "sepolia":
        return "Sepolia";
      case "avalancheFuji":
        return "Avalanche Fuji";
      case "polygonAmoy":
        return "Polygon Amoy";
      default:
        return network;
    }
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <ChartBarIcon className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Voting History</h2>
          <p className="text-sm text-gray-600">
            Track your participation in elections
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : votingHistory.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <ClockIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Voting History Yet
          </h3>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            You haven't participated in any elections yet. Your voting activity
            will appear here once you cast your first vote.
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {votingHistory.map((vote, index) => (
            <motion.div
              key={vote.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <CheckBadgeIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {vote.electionName}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {vote.timestamp.toLocaleDateString()} at{" "}
                      {vote.timestamp.toLocaleTimeString()}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">
                        Network: {getNetworkName(vote.network)}
                      </span>
                      <a
                        href={`https://etherscan.io/tx/${vote.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Tx: {truncateHash(vote.txHash)}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Statistics Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600">
            {votingHistory.length}
          </p>
          <p className="text-xs text-gray-600 mt-1">Total Votes</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {new Set(votingHistory.map((v) => v.electionName)).size}
          </p>
          <p className="text-xs text-gray-600 mt-1">Elections</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-pink-600">
            {new Set(votingHistory.map((v) => v.network)).size}
          </p>
          <p className="text-xs text-gray-600 mt-1">Networks</p>
        </div>
      </div>
    </motion.div>
  );
};

export default VotingHistory;
