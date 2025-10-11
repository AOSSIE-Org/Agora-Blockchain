"use client";

import React from "react";
import { useSwitchChain, useChainId } from "wagmi";
import { sepolia, avalancheFuji, polygonAmoy } from "wagmi/chains";
import {
  GlobeAltIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const NetworkSelector: React.FC = () => {
  const chainId = useChainId();
  const { chains, switchChain, isPending } = useSwitchChain();

  const supportedChains = [
    {
      id: sepolia.id,
      name: "Sepolia Testnet",
      icon: "🔵",
      color: "from-blue-400 to-blue-600",
      description: "Ethereum test network",
    },
    {
      id: avalancheFuji.id,
      name: "Avalanche Fuji",
      icon: "🔴",
      color: "from-red-400 to-red-600",
      description: "Avalanche test network",
    },
  ];

  const handleSwitchNetwork = async (targetChainId: number) => {
    try {
      await switchChain({ chainId: targetChainId });
      toast.success(`Switched to ${supportedChains.find(c => c.id === targetChainId)?.name}`);
    } catch (error) {
      toast.error("Failed to switch network");
      console.error("Network switch error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <GlobeAltIcon className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Network Selection</h2>
          <p className="text-sm text-gray-600">
            Switch between supported blockchain networks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {supportedChains.map((chain) => {
          const isActive = chainId === chain.id;
          return (
            <motion.button
              key={chain.id}
              onClick={() => !isActive && handleSwitchNetwork(chain.id)}
              disabled={isActive || isPending}
              whileHover={!isActive ? { scale: 1.02 } : {}}
              whileTap={!isActive ? { scale: 0.98 } : {}}
              className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                isActive
                  ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50"
                  : "border-gray-200 hover:border-indigo-300 bg-white hover:bg-gray-50"
              } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{chain.icon}</span>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-800">{chain.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {chain.description}
                    </p>
                  </div>
                </div>
                {isActive && (
                  <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
                )}
                {isPending && !isActive && (
                  <ArrowPathIcon className="h-6 w-6 text-gray-400 animate-spin flex-shrink-0" />
                )}
              </div>
              {isActive && (
                <div className="mt-3 px-3 py-1 bg-green-100 rounded-full inline-block">
                  <span className="text-xs font-semibold text-green-700">
                    Currently Active
                  </span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Warning for unsupported networks */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <div className="flex gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">
              Important Notice
            </h4>
            <p className="text-sm text-yellow-700">
              Only the networks listed above are supported for voting. Ensure
              you're connected to the correct network before participating in
              elections.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NetworkSelector;
