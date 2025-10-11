"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  WalletIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  BookOpenIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";
import FAQSection from "../components/Help/FAQSection";
import CategoryCard from "../components/Help/CategoryCard";
import TroubleshootingGuide from "../components/Help/TroubleshootingGuide";
import HowToGuides from "../components/Help/HowToGuides";
import ContactSupport from "../components/Help/ContactSupport";

const categories = [
  {
    id: "voting",
    title: "Voting",
    icon: QuestionMarkCircleIcon,
    color: "bg-blue-100 text-blue-600",
    description: "Learn about voting algorithms and casting votes",
  },
  {
    id: "wallets",
    title: "Wallets",
    icon: WalletIcon,
    color: "bg-purple-100 text-purple-600",
    description: "Connect and manage your crypto wallet",
  },
  {
    id: "security",
    title: "Security",
    icon: ShieldCheckIcon,
    color: "bg-green-100 text-green-600",
    description: "Best practices for keeping your account secure",
  },
  {
    id: "smart-contracts",
    title: "Smart Contracts",
    icon: CommandLineIcon,
    color: "bg-orange-100 text-orange-600",
    description: "Understanding blockchain interactions",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <BookOpenIcon className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Help & Support
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to your questions, explore guides, and get the support
            you need to make the most of Agora Blockchain.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles, FAQs, and guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                isSelected={selectedCategory === category.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )
                }
              />
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <FAQSection searchQuery={searchQuery} selectedCategory={selectedCategory} />

        {/* How-To Guides */}
        <HowToGuides />

        {/* Troubleshooting Guide */}
        <TroubleshootingGuide />

        {/* Contact Support */}
        <ContactSupport />

        {/* Community Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="text-center">
            <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
              Connect with other users, share experiences, and get help from our
              community members on Discord.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://discord.gg/HrJ6eKJ28a"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                Discord Community
              </a>
              <a
                href="https://github.com/AOSSIE-Org/Agora-Blockchain"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/30"
              >
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Documentation
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
