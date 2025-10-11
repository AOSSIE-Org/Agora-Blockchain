"use client";

import React from "react";
import { useBalance, useChainId } from "wagmi";
import { sepolia, avalancheFuji, polygonAmoy } from "wagmi/chains";
import { BanknotesIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface BalanceCardProps {
  address: `0x${string}` | undefined;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ address }) => {
  const chainId = useChainId();
  const { data: balance, isLoading } = useBalance({
    address,
  });

  const getChainName = (id: number) => {
    switch (id) {
      case sepolia.id:
        return "Sepolia";
      case avalancheFuji.id:
        return "Avalanche Fuji";
      case polygonAmoy.id:
        return "Polygon Amoy";
      default:
        return "Unknown Network";
    }
  };

  const getChainColor = (id: number) => {
    switch (id) {
      case sepolia.id:
        return "from-blue-400 to-blue-600";
      case avalancheFuji.id:
        return "from-red-400 to-red-600";
      case polygonAmoy.id:
        return "from-purple-400 to-purple-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 h-full"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-6">Balance Overview</h2>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-24 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-16 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Balance Display */}
          <div
            className={`p-6 bg-gradient-to-r ${getChainColor(
              chainId
            )} rounded-2xl text-white`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium opacity-90">
                {getChainName(chainId)} Balance
              </span>
              <BanknotesIcon className="h-6 w-6 opacity-90" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">
                {balance
                  ? parseFloat(balance.formatted).toFixed(4)
                  : "0.0000"}
              </span>
              <span className="text-xl font-medium opacity-90">
                {balance?.symbol || "ETH"}
              </span>
            </div>
          </div>

          {/* Balance Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">
                  Native Token
                </span>
              </div>
              <p className="text-sm font-bold text-gray-800">
                {balance?.symbol || "ETH"}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-blue-600">
                  Network
                </span>
              </div>
              <p className="text-sm font-bold text-gray-800">
                {getChainName(chainId)}
              </p>
            </div>
          </div>

          {/* Decimals Info */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Decimals</span>
              <span className="font-bold text-gray-800">
                {balance?.decimals || 18}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-gray-600">Full Balance</span>
              <span className="font-mono text-xs text-gray-800">
                {balance?.formatted || "0"} {balance?.symbol || "ETH"}
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BalanceCard;
