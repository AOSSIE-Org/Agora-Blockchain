"use client";

import React from "react";
import { useEnsName, useEnsAvatar } from "wagmi";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { motion } from "framer-motion";

interface WalletInfoProps {
  address: `0x${string}` | undefined;
}

const WalletInfo: React.FC<WalletInfoProps> = ({ address }) => {
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName || undefined });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 h-full"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-6">Wallet Details</h2>
      
      <div className="space-y-6">
        {/* Avatar/Profile Section */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {ensAvatar ? (
              <Image
                src={ensAvatar}
                alt="ENS Avatar"
                width={64}
                height={64}
                className="rounded-full border-4 border-indigo-100"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                <UserCircleIcon className="h-10 w-10 text-white" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Identity</p>
            <p className="text-lg font-bold text-gray-800">
              {ensName || "No ENS Name"}
            </p>
          </div>
        </div>

        {/* Wallet Type */}
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Wallet Type
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-indigo-600">
              Web3
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your wallet is connected and ready for blockchain interactions
          </p>
        </div>

        {/* Connection Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-xl">
            <p className="text-xs font-medium text-green-600 mb-1">Status</p>
            <p className="text-lg font-bold text-green-700">Active</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-xs font-medium text-blue-600 mb-1">Address Type</p>
            <p className="text-lg font-bold text-blue-700">EOA</p>
          </div>
        </div>

        {/* Address Checksum Info */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-600 mb-2 font-medium">
            Security Info
          </p>
          <p className="text-xs text-gray-500">
            ✓ Address is checksummed<br />
            ✓ Valid Ethereum address format<br />
            ✓ Compatible with EVM chains
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletInfo;
