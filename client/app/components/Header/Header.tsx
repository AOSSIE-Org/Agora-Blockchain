"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircleIcon,
  UserIcon,
  HomeIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import Web3Connect from "../Helper/Web3Connect";
import Image from "next/image";

const menuItems = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Create", href: "/create", icon: PlusCircleIcon },
  { name: "Profile", href: "/profile", icon: UserIcon },
];

const Header = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Lock scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isSidebarOpen]);

  return (
    <>
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
                width={0}
                height={0}
                sizes="200px"
                className="h-8 w-auto"
                src="/aossie.png"
                alt="Agora Blockchain"
                style={{ width: 'auto' }}
              />
              <h1 className="ml-3 text-xl font-bold text-gray-800 hidden sm:block">
                Agora Blockchain
              </h1>
            </Link>

            {/* Desktop/Tablet Navigation */}
            <nav className="hidden lg:flex items-center space-x-4">
              {menuItems.map((item) => (
                <Link key={item.name} href={item.href} className="relative">
                  <motion.button
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${pathname === item.href
                      ? "text-indigo-600"
                      : "text-gray-700 hover:text-indigo-600"
                      } bg-white hover:bg-gray-50`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="h-5 w-5 mr-2" aria-hidden="true" />
                    <span>{item.name}</span>
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
              <div className="hidden lg:block">
                <Web3Connect />
              </div>
            </nav>

            {/* Mobile/Tablet Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <div className="scale-90">
                <Web3Connect />
              </div>
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile/Tablet Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Overlay/Scrim - blocks all interactions with background */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 touch-none"
              style={{ pointerEvents: 'auto' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              aria-hidden="true"
            />
            {/* Sidebar Panel */}
            <motion.div
              className="fixed right-0 top-0 h-full w-72 bg-white z-50 shadow-lg flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
            >
              {/* Sidebar Header with Close Button */}
              <div className="p-6 flex-shrink-0">
                <button
                  onClick={toggleSidebar}
                  className="absolute top-4 right-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  aria-label="Close sidebar"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                <div className="mt-2 space-y-6">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={toggleSidebar}
                      className={`flex items-center p-4 rounded-lg transition-colors ${pathname === item.href
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <item.icon className="h-6 w-6 mr-4" />
                      <span className="text-base font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;