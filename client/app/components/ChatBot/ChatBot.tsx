"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";

/* ------------------ TYPES ------------------ */
interface Message {
  content: string;
  role: "assistant" | "user";
}

interface Intent {
  tag: string;
  patterns: string[];
  responses: string[];
}

/* ------------------ INTENTS ------------------ */
const intents: Intent[] = [
  {
    tag: "greeting",
    patterns: ["hi", "hello", "hey", "good morning", "good evening"],
    responses: [
      "Hello! 👋 How can I help you today?",
      "Hi there! What would you like to know?",
    ],
  },
  {
    tag: "voting",
    patterns: ["vote", "voting", "how to vote", "cast vote"],
    responses: [
      "You can vote by selecting an active election and submitting your choice securely.",
      "Voting is anonymous and blockchain-secured on Agora.",
    ],
  },
  {
    tag: "blockchain",
    patterns: ["blockchain", "security", "secure", "decentralized"],
    responses: [
      "Agora uses blockchain to ensure transparency and immutability.",
      "Blockchain guarantees vote integrity and prevents tampering.",
    ],
  },
  {
    tag: "fallback",
    patterns: [],
    responses: [
      "Sorry, I didn’t understand that. Could you rephrase?",
      "I'm still learning. Try asking about voting or blockchain.",
    ],
  },
];

/* ------------------ UTIL ------------------ */
const getBotReply = (message: string): string => {
  const lowerMsg = message.toLowerCase();

  for (const intent of intents) {
    for (const pattern of intent.patterns) {
      if (lowerMsg.includes(pattern)) {
        return intent.responses[
          Math.floor(Math.random() * intent.responses.length)
        ];
      }
    }
  }

  const fallback = intents.find((i) => i.tag === "fallback");
  return fallback
    ? fallback.responses[Math.floor(Math.random() * fallback.responses.length)]
    : "Sorry, something went wrong.";
};

/* ------------------ COMPONENT ------------------ */
const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Greetings! I'm here to help with Agora voting questions.",
      role: "assistant",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      content: inputMessage,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const botReply: Message = {
        content: getBotReply(userMessage.content),
        role: "assistant",
      };
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg"
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 w-[360px] h-[450px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden"
          >
            <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
              <span className="font-semibold">Agora Chatbot</span>
              <button onClick={() => setIsOpen(false)}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "assistant"
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${
                      msg.role === "assistant"
                        ? "bg-gray-200 text-gray-800"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 px-3 py-2 rounded-lg text-sm animate-pulse">
                    Typing...
                  </div>
                </div>
              )}

              <div ref={messageEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-3 bg-gray-100 flex gap-2"
            >
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 rounded-full text-sm focus:outline-none"
              />
              <button className="bg-blue-600 text-white p-2 rounded-full">
                <ArrowUpIcon className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;