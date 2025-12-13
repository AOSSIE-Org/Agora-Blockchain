"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    category: "Getting Started",
    question: "What is Agora Blockchain?",
    answer:
      "Agora Blockchain is a decentralized voting platform that ensures secure, transparent, and tamper-proof elections using blockchain technology. It supports multiple voting algorithms and provides complete anonymity for voters.",
  },
  {
    category: "Getting Started",
    question: "How do I connect my wallet?",
    answer:
      "Click the 'Connect Wallet' button in the top-right corner of the page. You'll need a Web3 wallet like MetaMask installed in your browser. Follow the prompts to connect your wallet and you'll be ready to participate in elections.",
  },
  {
    category: "Getting Started",
    question: "Which networks are supported?",
    answer:
      "Agora Blockchain currently supports Ethereum Sepolia testnet, Polygon Amoy testnet, Avalanche Fuji testnet, and BSC testnet. Make sure your wallet is connected to one of these networks.",
  },
  {
    category: "Voting",
    question: "How do I participate in an election?",
    answer:
      "First, connect your wallet. Then browse available elections from the home page. Click on an election to view details and cast your vote. Your vote is recorded on the blockchain and cannot be changed once submitted.",
  },
  {
    category: "Voting",
    question: "Can I change my vote after submitting?",
    answer:
      "No, once your vote is recorded on the blockchain, it becomes immutable. This ensures the integrity of the election process. Please review your choice carefully before submitting.",
  },
  {
    category: "Voting",
    question: "What voting algorithms are supported?",
    answer:
      "Agora supports multiple voting algorithms including Borda Count, Instant Runoff Voting (IRV), Moore's Voting Algorithm, and Oklahoma Voting System. Each election specifies which algorithm will be used for counting votes.",
  },
  {
    category: "Creating Elections",
    question: "How do I create an election?",
    answer:
      "Navigate to the 'Create' page from the header menu. Fill in the election details including title, description, candidates, start/end dates, and select your preferred voting algorithm. You'll need to pay a small gas fee to deploy the election smart contract.",
  },
  {
    category: "Creating Elections",
    question: "What are the requirements for creating an election?",
    answer:
      "You need a connected Web3 wallet with sufficient funds for gas fees, at least 2 candidates, and valid start/end dates. The election duration must be at least 1 hour.",
  },
  {
    category: "Security & Privacy",
    question: "Is my vote anonymous?",
    answer:
      "Yes! Agora Blockchain uses zero-knowledge proofs (ZK-SNARKs) to ensure complete voter anonymity. Your vote is recorded on the blockchain without revealing your identity.",
  },
  {
    category: "Security & Privacy",
    question: "How secure is the platform?",
    answer:
      "The platform uses blockchain technology which provides immutability and transparency. All smart contracts are audited and votes are cryptographically secured. The decentralized nature of the platform prevents single points of failure.",
  },
  {
    category: "Troubleshooting",
    question: "My transaction failed. What should I do?",
    answer:
      "Transaction failures can occur due to insufficient gas fees, network congestion, or wallet configuration issues. Check your wallet balance, ensure you're on the correct network, and try again with higher gas settings.",
  },
  {
    category: "Troubleshooting",
    question: "I can't see my election after creating it",
    answer:
      "Elections may take a few moments to appear after creation due to blockchain confirmation times. Refresh the page after waiting 30-60 seconds. If the issue persists, check your transaction status on a block explorer.",
  },
];

const categories = [
  "All",
  "Getting Started",
  "Voting",
  "Creating Elections",
  "Security & Privacy",
  "Troubleshooting",
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Help & Support
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions and get the help you need
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              aria-label="Search FAQs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-colors duration-200"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200"
                >
                  <button
                    onClick={() => toggleFAQ(faq.question)}
                    aria-expanded={expandedFAQ === faq.question}
                    aria-controls={`faq-panel-${index}`}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                        {faq.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDownIcon
                      className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                        expandedFAQ === faq.question ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedFAQ === faq.question && (
                      <motion.div
                        id={`faq-panel-${index}`}
                        role="region"
                        aria-label={faq.question}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-4"
                      >
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No FAQs found matching your search.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact & Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Still Need Help?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center transition-colors duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 mb-4">
                <BookOpenIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Documentation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Read our comprehensive guides and tutorials
              </p>
              <a
                href="https://github.com/AOSSIE-Org/Agora-Blockchain"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
              >
                View Docs →
              </a>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center transition-colors duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Join our community on Discord or Slack
              </p>
              <a
                href="https://aossie.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
              >
                Join Community →
              </a>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center transition-colors duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                <EnvelopeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Email Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Send us an email and we'll get back to you
              </p>
              <a
                href="mailto:support@aossie.org"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Contact Us →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
