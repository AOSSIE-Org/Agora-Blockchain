"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  FireIcon,
  ClockIcon,
  CheckBadgeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  TagIcon,
  UserCircleIcon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

interface Discussion {
  id: number;
  title: string;
  content: string;
  author: string;
  authorBadge?: string;
  votes: number;
  replies: number;
  views: number;
  category: string;
  tags: string[];
  timestamp: string;
  isPinned?: boolean;
}

const mockDiscussions: Discussion[] = [
  {
    id: 1,
    title: "Best voting algorithm for university elections?",
    content:
      "We're planning to use Agora for our university student council elections. Which voting algorithm would you recommend for 500+ voters?",
    author: "Alex Chen",
    authorBadge: "Verified Creator",
    votes: 24,
    replies: 15,
    views: 342,
    category: "Voting Algorithms",
    tags: ["borda", "irv", "advice"],
    timestamp: "2 hours ago",
    isPinned: true,
  },
  {
    id: 2,
    title: "How to ensure voter anonymity with ZK-SNARKs?",
    content:
      "I'm interested in implementing anonymous voting. Can someone explain how the zero-knowledge proofs work in Agora?",
    author: "Sarah Johnson",
    votes: 18,
    replies: 8,
    views: 256,
    category: "Security & Privacy",
    tags: ["zk-snarks", "anonymity", "privacy"],
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    title: "Smart contract deployment costs on different networks",
    content:
      "Has anyone compared gas fees for deploying elections on Sepolia vs Polygon Amoy? Looking for real-world data.",
    author: "Michael Torres",
    authorBadge: "Top Contributor",
    votes: 32,
    replies: 22,
    views: 489,
    category: "Blockchain & Gas",
    tags: ["gas-fees", "deployment", "networks"],
    timestamp: "1 day ago",
  },
  {
    id: 4,
    title: "Feature request: Multi-signature election creation",
    content:
      "Would be great to have multiple admins approve election creation. Anyone else need this feature?",
    author: "Emma Davis",
    votes: 15,
    replies: 12,
    views: 178,
    category: "Feature Requests",
    tags: ["multi-sig", "governance", "feature"],
    timestamp: "2 days ago",
  },
  {
    id: 5,
    title: "Integrating Agora with Discord for community voting",
    content:
      "Working on a Discord bot that integrates with Agora. Has anyone done this before? Looking for guidance.",
    author: "David Kim",
    votes: 28,
    replies: 19,
    views: 412,
    category: "Integrations",
    tags: ["discord", "bot", "integration"],
    timestamp: "3 days ago",
  },
  {
    id: 6,
    title: "Troubleshooting: Wallet won't connect on mobile",
    content:
      "Users reporting issues connecting MetaMask on mobile browsers. Any solutions?",
    author: "Lisa Wang",
    votes: 12,
    replies: 7,
    views: 145,
    category: "Technical Support",
    tags: ["mobile", "wallet", "bug"],
    timestamp: "4 days ago",
  },
];

const categories = [
  { name: "All Topics", icon: ChatBubbleLeftRightIcon, count: 156 },
  { name: "Voting Algorithms", icon: CheckBadgeIcon, count: 42 },
  { name: "Security & Privacy", icon: FireIcon, count: 38 },
  { name: "Blockchain & Gas", icon: TagIcon, count: 29 },
  { name: "Feature Requests", icon: PlusCircleIcon, count: 24 },
  { name: "Integrations", icon: ChatBubbleBottomCenterTextIcon, count: 15 },
  { name: "Technical Support", icon: ClockIcon, count: 8 },
];

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [sortBy, setSortBy] = useState<"hot" | "new" | "top">("hot");
  const [votedPosts, setVotedPosts] = useState<{
    [key: number]: "up" | "down" | null;
  }>({});
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    category: "General",
    tags: "",
  });

  const handleVote = (postId: number, voteType: "up" | "down") => {
    setVotedPosts((prev) => ({
      ...prev,
      [postId]: prev[postId] === voteType ? null : voteType,
    }));
  };

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would POST to an API
    alert(`New discussion created:\nTitle: ${newDiscussion.title}\nCategory: ${newDiscussion.category}`);
    setNewDiscussion({ title: "", content: "", category: "General", tags: "" });
    setIsNewDiscussionOpen(false);
  };

  const filteredDiscussions = mockDiscussions.filter((discussion) => {
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "All Topics" ||
      discussion.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Community Forum
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Discuss voting algorithms, share ideas, and connect with the
                community
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsNewDiscussionOpen(true)}
              className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              New Discussion
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search discussions, tags..."
                aria-label="Search discussions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-colors duration-200"
              />
            </div>
            <div className="flex gap-2">
              {(["hot", "new", "top"] as const).map((sort) => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    sortBy === sort
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {sort === "hot" && <FireIcon className="h-5 w-5 inline mr-1" />}
                  {sort === "new" && <ClockIcon className="h-5 w-5 inline mr-1" />}
                  {sort === "top" && (
                    <ArrowUpIcon className="h-5 w-5 inline mr-1" />
                  )}
                  {sort.charAt(0).toUpperCase() + sort.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Categories
              </h2>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                      selectedCategory === category.name
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <category.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.aside>

          {/* Discussions List */}
          <main className="lg:col-span-3">
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredDiscussions.map((discussion, index) => {
                  const userVote = votedPosts[discussion.id];
                  const displayVotes =
                    discussion.votes +
                    (userVote === "up" ? 1 : userVote === "down" ? -1 : 0);

                  return (
                    <motion.article
                      key={discussion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
                        discussion.isPinned ? "ring-2 ring-indigo-500" : ""
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex gap-4">
                          {/* Vote Section */}
                          <div className="flex flex-col items-center space-y-1">
                            <button
                              onClick={() => handleVote(discussion.id, "up")}
                              className={`p-1 rounded transition-colors ${
                                userVote === "up"
                                  ? "text-indigo-600 dark:text-indigo-400"
                                  : "text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                              }`}
                              aria-label="Upvote"
                            >
                              <ArrowUpIcon className="h-6 w-6" />
                            </button>
                            <span
                              className={`text-lg font-bold ${
                                userVote === "up"
                                  ? "text-indigo-600 dark:text-indigo-400"
                                  : userVote === "down"
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {displayVotes}
                            </span>
                            <button
                              onClick={() => handleVote(discussion.id, "down")}
                              className={`p-1 rounded transition-colors ${
                                userVote === "down"
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                              }`}
                              aria-label="Downvote"
                            >
                              <ArrowDownIcon className="h-6 w-6" />
                            </button>
                          </div>

                          {/* Content Section */}
                          <div className="flex-1 min-w-0">
                            {discussion.isPinned && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-2">
                                📌 Pinned
                              </span>
                            )}
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                              {discussion.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                              {discussion.content}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {discussion.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                                >
                                  <TagIcon className="h-3 w-3 mr-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center space-x-2">
                                <UserCircleIcon className="h-4 w-4" />
                                <span className="font-medium">
                                  {discussion.author}
                                </span>
                                {discussion.authorBadge && (
                                  <span className="inline-flex items-center text-xs text-indigo-600 dark:text-indigo-400">
                                    <CheckBadgeIcon className="h-4 w-4 mr-1" />
                                    {discussion.authorBadge}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{discussion.timestamp}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                <span>{discussion.replies} replies</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span>{discussion.views} views</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>

              {filteredDiscussions.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                  <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    No discussions found matching your search.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* New Discussion Modal */}
        <AnimatePresence>
          {isNewDiscussionOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsNewDiscussionOpen(false)}
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
              />
              
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Start a New Discussion
                    </h2>
                    
                    <form onSubmit={handleCreateDiscussion} className="space-y-4">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          required
                          value={newDiscussion.title}
                          onChange={(e) =>
                            setNewDiscussion({ ...newDiscussion, title: e.target.value })
                          }
                          placeholder="What's your discussion about?"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category
                        </label>
                        <select
                          value={newDiscussion.category}
                          onChange={(e) =>
                            setNewDiscussion({ ...newDiscussion, category: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option>General</option>
                          <option>Governance</option>
                          <option>Technical</option>
                          <option>Proposals</option>
                          <option>Voting Algorithms</option>
                        </select>
                      </div>

                      {/* Content */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Content
                        </label>
                        <textarea
                          required
                          rows={6}
                          value={newDiscussion.content}
                          onChange={(e) =>
                            setNewDiscussion({ ...newDiscussion, content: e.target.value })
                          }
                          placeholder="Share your thoughts, questions, or ideas..."
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                        />
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={newDiscussion.tags}
                          onChange={(e) =>
                            setNewDiscussion({ ...newDiscussion, tags: e.target.value })
                          }
                          placeholder="e.g., borda, security, help"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setIsNewDiscussionOpen(false)}
                          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
                        >
                          Post Discussion
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
