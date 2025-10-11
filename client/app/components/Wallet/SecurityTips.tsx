"use client";

import React, { useState } from "react";
import {
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const SecurityTips: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const securityTips = [
    {
      icon: LockClosedIcon,
      title: "Never Share Your Private Keys",
      description:
        "Your private keys and seed phrases should never be shared with anyone. No legitimate service will ever ask for them.",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: ShieldCheckIcon,
      title: "Verify Transaction Details",
      description:
        "Always double-check transaction details including recipient address, amount, and gas fees before confirming.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: ExclamationTriangleIcon,
      title: "Beware of Phishing",
      description:
        "Be cautious of suspicious links and websites. Always verify the URL and ensure you're on the official platform.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: EyeSlashIcon,
      title: "Use Hardware Wallets",
      description:
        "For large amounts, consider using a hardware wallet for enhanced security and protection against online threats.",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl shadow-lg border-2 border-orange-200"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-white/30 transition-colors duration-200 rounded-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <ShieldCheckIcon className="h-6 w-6 text-orange-600" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-800">Security Tips</h2>
            <p className="text-sm text-gray-600">
              Important guidelines to keep your wallet secure
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUpIcon className="h-6 w-6 text-gray-600" />
        ) : (
          <ChevronDownIcon className="h-6 w-6 text-gray-600" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4">
              {securityTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 ${tip.bgColor} rounded-xl border border-gray-200`}
                >
                  <div className="flex gap-3">
                    <tip.icon className={`h-6 w-6 ${tip.color} flex-shrink-0`} />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {tip.title}
                      </h3>
                      <p className="text-sm text-gray-600">{tip.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Additional Warning */}
              <div className="mt-4 p-4 bg-white rounded-xl border-2 border-orange-300">
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">
                      Stay Safe Online
                    </h4>
                    <p className="text-sm text-gray-600">
                      This platform will never ask you to send cryptocurrency to
                      an external address. All voting transactions are handled
                      through smart contracts. If you encounter any suspicious
                      activity, please disconnect your wallet immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SecurityTips;
