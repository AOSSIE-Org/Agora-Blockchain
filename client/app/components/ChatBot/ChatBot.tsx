"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";

interface Message {
  content: string;
  role: "assistant" | "user";
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content:
        "Greetings! I'm here to help with any blockchain questions you have",
      role: "assistant",
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = { content: inputMessage, role: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage("");
    await getReply(inputMessage);
  };

  const getReply = async (value: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: value }),
      });
      const data = await response.json();
      const reply: Message = { content: data.message, role: "assistant" };
      setMessages((prevMessages) => [...prevMessages, reply]);
    } catch (error) {
      console.error("Error:", error);
      // Add error message in chatbot here
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        className="relative"
      >
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 w-96 h-[32rem] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
            >
              <div className="bg-blue-600 text-white p-4 text-center font-semibold">
                Agora Chatbot
              </div>
              <div className="flex-grow overflow-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      msg.role === "assistant" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === "assistant"
                          ? "bg-gray-200 text-gray-800"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                <div ref={messageEndRef} />
              </div>
              <form onSubmit={handleSubmit} className="p-4 bg-gray-100">
                <div className="flex items-center bg-white rounded-full overflow-hidden shadow">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setInputMessage(e.target.value)
                    }
                    placeholder="Type your message..."
                    className="flex-grow px-4 py-2 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 rounded-full"
                  >
                    <ArrowUpIcon className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ChatBot;
