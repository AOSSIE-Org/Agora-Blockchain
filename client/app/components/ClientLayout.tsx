"use client";
import React from "react";
import Header from "./Header/Header";
import ChatBot from "./ChatBot/ChatBot";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ChatBot />
      {children}
    </>
  );
}
