"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "What is Agora Blockchain?",
    answer:
      "Agora Blockchain is a decentralized voting platform that uses blockchain technology to ensure secure, transparent, and tamper-proof elections. It implements various voting algorithms like Moore's, Oklahoma, Borda, and IRV on the blockchain.",
    category: "voting",
  },
  {
    id: "2",
    question: "How do I connect my wallet?",
    answer:
      "Click on the 'Connect Wallet' button in the header. You'll need MetaMask or another Web3 wallet installed. Follow the prompts to connect your wallet to the Sepolia testnet.",
    category: "wallets",
  },
  {
    id: "3",
    question: "Which voting algorithms are supported?",
    answer:
      "Agora Blockchain supports multiple voting algorithms including: Moore's method, Oklahoma method, Borda count, Instant Runoff Voting (IRV), Kemeny-Young, Schulze method, Score voting, Ranked voting, and Quadratic voting.",
    category: "voting",
  },
  {
    id: "4",
    question: "How do I create an election?",
    answer:
      "Navigate to the Create page, fill in the election details including title, description, voting algorithm, candidates, and time period. Make sure your wallet is connected and has enough test ETH for gas fees.",
    category: "voting",
  },
  {
    id: "5",
    question: "Is my vote anonymous?",
    answer:
      "Votes are recorded on the blockchain and linked to wallet addresses. However, Agora Blockchain includes anonymous voting features using zero-knowledge proofs for enhanced privacy. Check the anonymousVoting directory for implementation details.",
    category: "security",
  },
  {
    id: "6",
    question: "What networks are supported?",
    answer:
      "Agora Blockchain currently supports Sepolia testnet for Ethereum and Fuji testnet for Avalanche. Cross-chain voting is enabled through Chainlink CCIP.",
    category: "wallets",
  },
  {
    id: "7",
    question: "How do I get test ETH?",
    answer:
      "You can get test ETH from Sepolia faucets like Alchemy Sepolia Faucet or Infura Faucet. Simply enter your wallet address to receive test tokens.",
    category: "wallets",
  },
  {
    id: "8",
    question: "Can I vote from different blockchains?",
    answer:
      "Yes! Agora Blockchain supports cross-chain voting through Chainlink's Cross-Chain Interoperability Protocol (CCIP). You can vote from Sepolia or Fuji testnets.",
    category: "smart-contracts",
  },
  {
    id: "9",
    question: "How are election results calculated?",
    answer:
      "Results are calculated on-chain using smart contracts specific to each voting algorithm. The ResultCalculator contract processes votes according to the selected algorithm and returns the winner.",
    category: "voting",
  },
  {
    id: "10",
    question: "What are the gas fees?",
    answer:
      "Gas fees vary depending on network congestion and the complexity of the transaction. Creating an election typically costs more than casting a vote. Make sure you have enough testnet tokens.",
    category: "smart-contracts",
  },
  {
    id: "11",
    question: "How secure are the smart contracts?",
    answer:
      "Agora Blockchain uses OpenZeppelin's audited smart contract libraries and follows security best practices. All contracts are tested thoroughly and deployed on testnets for verification.",
    category: "security",
  },
  {
    id: "12",
    question: "Can I delete an election?",
    answer:
      "Yes, election creators can delete their elections through the smart contract. However, once voting has started, deletion may be restricted to preserve election integrity.",
    category: "voting",
  },
  {
    id: "13",
    question: "What if my transaction fails?",
    answer:
      "Transaction failures can occur due to insufficient gas, network issues, or contract constraints. Check your wallet's gas settings and ensure you have enough testnet tokens. See the Troubleshooting section for more details.",
    category: "smart-contracts",
  },
  {
    id: "14",
    question: "How do I view my voting history?",
    answer:
      "Navigate to your Profile page to see all elections you've created or participated in. You can also view transaction history in your wallet or on the blockchain explorer.",
    category: "voting",
  },
  {
    id: "15",
    question: "Is the source code open?",
    answer:
      "Yes! Agora Blockchain is fully open source and available on GitHub. You can contribute to the project by following the contribution guidelines in the README.",
    category: "security",
  },
];

interface FAQSectionProps {
  searchQuery: string;
  selectedCategory: string | null;
}

export default function FAQSection({
  searchQuery,
  selectedCategory,
}: FAQSectionProps) {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-16"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    openFAQ === faq.id ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openFAQ === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No FAQs found matching your search.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
