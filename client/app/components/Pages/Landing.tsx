"use client";
import { FaTwitter, FaFacebook } from "react-icons/fa";
import { CheckCircle, Lock, Shield } from "lucide-react";
import Link from "next/link";

export default function Landing() {
  const features = [
    { icon: <Shield className="h-10 w-10 text-green-600" />, title: "Secure Voting", desc: "Blockchain-powered voting ensuring tamper-proof elections." },
    { icon: <Lock className="h-10 w-10 text-green-600" />, title: "Immutable Records", desc: "Once recorded, votes cannot be altered or deleted." },
    { icon: <CheckCircle className="h-10 w-10 text-green-600" />, title: "Real-time Results", desc: "Instant access to election results after voting concludes." },
  ];

  const faqs = [
    { question: "How does blockchain voting work?", answer: "Each vote is recorded as a transaction on the blockchain, ensuring transparency and security." },
    { question: "Is my vote anonymous?", answer: "Yes, we use advanced cryptography to maintain voter anonymity while ensuring vote validity." },
    { question: "Can I verify my vote?", answer: "Voters receive a unique transaction ID to verify their vote was counted correctly." },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="py-20 text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-green-600 bg-clip-text text-transparent">
            Revolutionizing Democracy with Blockchain
          </h1>
          <p className="text-gray-600 text-xl mb-8">
            Secure, transparent, and accessible voting solutions powered by blockchain technology.
          </p>
          <Link href={"/dashboard"}>
            <button className="bg-green-600 text-white px-8 py-3 rounded-full text-lg hover:bg-green-700 transition">
              Start Voting
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-green-50 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-600">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-12 md:py-24 lg:py-32 bg-green-50 px-6">
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-3xl font-bold text-center mb-8 text-green-600">Frequently Asked Questions</h2>
          <div className="space-y-6 w-full">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-white p-4 rounded-lg shadow-md w-full">
                <summary className="text-lg font-semibold text-green-600 cursor-pointer">{faq.question}</summary>
                <p className="text-gray-600 mt-2">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-600 text-white py-12 text-center">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <p className="text-sm">© 2023 ChainVote. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
