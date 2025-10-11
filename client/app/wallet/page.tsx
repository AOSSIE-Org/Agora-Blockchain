"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useDisconnect, useBalance, useEnsName, useEnsAvatar } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  WalletIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import WalletInfo from "../components/Wallet/WalletInfo";
import BalanceCard from "../components/Wallet/BalanceCard";
import NetworkSelector from "../components/Wallet/NetworkSelector";
import VotingHistory from "../components/Wallet/VotingHistory";
import SecurityTips from "../components/Wallet/SecurityTips";
import toast from "react-hot-toast";

const WalletPage: React.FC = () => {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      toast.success("Address copied to clipboard!");
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success("Wallet disconnected successfully!");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl max-w-md w-full text-center"
        >
          <WalletIcon className="h-20 w-20 mx-auto text-indigo-600 mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Wallet Management
          </h1>
          <p className="text-gray-600 mb-8">
            Connect your wallet to view and manage your blockchain assets,
            voting history, and more.
          </p>
          <ConnectButton />
          <SecurityTips />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <WalletIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Wallet Management
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">
                      Connected via {connector?.name || "Wallet"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200 font-medium"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Disconnect
              </button>
            </div>

            {/* Address Display */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2 font-medium">
                Wallet Address
              </p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-sm sm:text-base font-mono text-gray-800 break-all">
                  {address}
                </code>
                <button
                  onClick={handleCopyAddress}
                  className="flex-shrink-0 p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  title="Copy address"
                >
                  {copiedAddress ? (
                    <CheckIcon className="h-5 w-5 text-green-600" />
                  ) : (
                    <ClipboardDocumentIcon className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Wallet Info and Balance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <WalletInfo address={address} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <BalanceCard address={address} />
            </motion.div>
          </div>

          {/* Network Selector */}
          <motion.div variants={itemVariants}>
            <NetworkSelector />
          </motion.div>

          {/* Voting History */}
          <motion.div variants={itemVariants}>
            <VotingHistory address={address} />
          </motion.div>

          {/* Security Tips */}
          <motion.div variants={itemVariants}>
            <SecurityTips />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default WalletPage;
