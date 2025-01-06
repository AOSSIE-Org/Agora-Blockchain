"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  PlusCircleIcon,
  UserIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import Web3Connect from "../Helper/Web3Connect"; // Assuming this is your wallet connection logic
import Image from "next/image";

const menuItems = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Create", href: "/create", icon: PlusCircleIcon },
  { name: "Profile", href: "/profile", icon: UserIcon },
];

const Header = () => {
  const pathname = usePathname();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Function to simulate wallet connection
  const connectWallet = async () => {
    try {
      // Call your wallet connection logic here
      // For example, using Web3Connect or any other method
      await Web3Connect(); // Assuming this function connects the wallet
      setIsWalletConnected(true);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // Optional: Function to check wallet connection status
  const checkWalletConnection = async () => {
    // Logic to check if the wallet is connected
    const connected = /* your logic here to check if wallet is connected */;
    setIsWalletConnected(connected);
  };

  useEffect(() => {
    checkWalletConnection();
  }, []);

  return (
    <motion.header
      className="bg-white border-b border-gray-200 fixed w-full z-30 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              width={32}
              height={32}
              className="h-8 w-auto"
              src="/aossie.png"
              alt="Agora Blockchain"
            />
            <h1 className="ml-3 text-xl font-bold text-gray-800 hidden sm:block">
              Agora Blockchain
            </h1>
          </Link>

          <nav className="flex items-center space-x-4">
            {isWalletConnected && menuItems.map((item) => (
              <Link key={item.name} href={item.href} className="relative">
                <motion.button
                  className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                    pathname === item.href
                      ? "text-indigo-600"
                      : "text-gray-700 hover:text-indigo-600"
                  } bg-white hover:bg-gray-50`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="h-5 w-5 mr-2" aria-hidden="true" />
                  <span className="hidden sm:inline">{item.name}</span>
                </motion.button>
                {pathname === item.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
            {!isWalletConnected && (
              <button onClick={connectWallet} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                Connect Wallet
              </button>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;