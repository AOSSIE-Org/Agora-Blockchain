"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function ContactSupport() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would send to a backend or support system
    toast.success(
      "Thank you! Your message has been received. We'll get back to you soon."
    );
    
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="mb-16"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Contact Cards */}
        <motion.a
          href="https://discord.gg/HrJ6eKJ28a"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
        >
          <ChatBubbleLeftRightIcon className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Discord Community</h3>
          <p className="text-indigo-100 text-sm">
            Join our active community for real-time help and discussions
          </p>
        </motion.a>

        <motion.a
          href="https://github.com/AOSSIE-Org/Agora-Blockchain/issues"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-6 text-white shadow-lg"
        >
          <CodeBracketIcon className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">GitHub Issues</h3>
          <p className="text-gray-300 text-sm">
            Report bugs or request features on our GitHub repository
          </p>
        </motion.a>

        <motion.a
          href="https://github.com/AOSSIE-Org/Agora-Blockchain"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white shadow-lg"
        >
          <DocumentTextIcon className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Documentation</h3>
          <p className="text-green-100 text-sm">
            Explore detailed documentation and contribution guidelines
          </p>
        </motion.a>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center mb-6">
          <EnvelopeIcon className="h-6 w-6 text-indigo-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">
            Send Us a Message
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">Select a topic</option>
              <option value="technical">Technical Issue</option>
              <option value="wallet">Wallet/Connection Problem</option>
              <option value="voting">Voting Question</option>
              <option value="feature">Feature Request</option>
              <option value="security">Security Concern</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe your issue or question in detail..."
            />
          </div>

          <div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
            >
              Send Message
            </motion.button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            For urgent issues, please reach out on{" "}
            <a
              href="https://discord.gg/HrJ6eKJ28a"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Discord
            </a>{" "}
            or open a{" "}
            <a
              href="https://github.com/AOSSIE-Org/Agora-Blockchain/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              GitHub issue
            </a>
            .
          </p>
        </div>
      </div>
    </motion.div>
  );
}
