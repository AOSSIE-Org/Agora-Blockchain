"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  ShieldCheckIcon,
  LockClosedIcon,
  ChartBarIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const LoginPage = () => {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: "Secure & Transparent",
      description:
        "Blockchain technology ensures every vote is immutable and verifiable, preventing tampering and fraud.",
    },
    {
      icon: LockClosedIcon,
      title: "Decentralized Voting",
      description:
        "No central authority controls the voting process. Your vote is stored on the blockchain forever.",
    },
    {
      icon: ChartBarIcon,
      title: "Multiple Algorithms",
      description:
        "Support for various voting methods including Borda Count, Instant Runoff Voting (IRV), and Moore's method.",
    },
    {
      icon: UserGroupIcon,
      title: "Anonymous & Private",
      description:
        "Zero-knowledge proofs ensure your vote remains private while maintaining the integrity of the election.",
    },
  ];

  const votingMethods = [
    {
      name: "Borda Count",
      description: "Ranked voting where candidates receive points based on their position in each voter's ranking.",
    },
    {
      name: "Instant Runoff (IRV)",
      description: "Voters rank candidates by preference, and the candidate with majority support wins.",
    },
    {
      name: "Moore's Method",
      description: "A Condorcet method that selects the candidate who wins the most pairwise comparisons.",
    },
    {
      name: "Oklahoma Method",
      description: "A unique voting algorithm designed for fair representation in multi-candidate elections.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white overflow-y-auto pb-20 pt-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center mb-8">
            <Image
              src="/aossie.png"
              alt="AOSSIE Logo"
              width={200}
              height={200}
              priority
              className="drop-shadow-lg"
            />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Agora Blockchain
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The Future of Decentralized Voting - Secure, Transparent, and Tamper-Proof
          </p>

          <p className="text-lg text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed">
            Agora Blockchain brings democratic voting to Web3, leveraging blockchain technology to ensure every vote
            is recorded immutably and transparently. Say goodbye to election fraud and hello to true democracy.
          </p>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-1">
              <div className="bg-white rounded-full px-8 py-4">
                <ConnectButton.Custom>
                  {({ account, chain, openConnectModal, mounted }) => {
                    return (
                      <button
                        onClick={openConnectModal}
                        className="flex items-center gap-3 text-lg font-semibold text-indigo-600"
                      >
                        <span>Connect Wallet to Get Started</span>
                        <ArrowRightIcon className="h-5 w-5" />
                      </button>
                    );
                  }}
                </ConnectButton.Custom>
              </div>
            </div>
          </motion.div>

          <p className="mt-4 text-sm text-gray-500">
            Connect your wallet to create elections, vote, and explore blockchain-based democracy
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-24"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Agora Blockchain?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="bg-indigo-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <feature.icon className="h-7 w-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Voting Methods Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Supported Voting Algorithms
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Choose from multiple proven voting algorithms to ensure fair and accurate election results
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {votingMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="bg-gradient-to-br from-white to-indigo-50 rounded-xl p-6 border border-indigo-100 hover:border-indigo-300 transition-all"
              >
                <div className="flex items-start gap-3">
                  <CheckBadgeIcon className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{method.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{method.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Connect Your Wallet</h3>
              <p className="text-indigo-100">
                Use MetaMask or any Web3 wallet to securely connect to the platform
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 backdrop-blur rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Create or Join Elections</h3>
              <p className="text-indigo-100">
                Create your own election or participate in existing ones with various voting algorithms
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 backdrop-blur rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Vote & Verify</h3>
              <p className="text-indigo-100">
                Cast your vote securely and verify it on the blockchain - tamper-proof forever
              </p>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 text-lg mb-6">
            Ready to experience the future of democratic voting?
          </p>
          <div className="inline-block">
            <ConnectButton />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
