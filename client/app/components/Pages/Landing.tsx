"use client"
import {FaTwitter, FaFacebook} from 'react-icons/fa';
import { CheckCircle, Lock, Shield} from "lucide-react"
import Link from 'next/link';


export default function Landing() {
  const features = [
    { icon: <Shield className="h-10 w-10 text-green-600" />, title: "Secure Voting", desc: "Blockchain-powered voting ensuring tamper-proof elections" },
    { icon: <Lock className="h-10 w-10 text-green-600" />, title: "Immutable Records", desc: "Once recorded, votes cannot be altered or deleted" },
    { icon: <CheckCircle className="h-10 w-10 text-green-600" />, title: "Real-time Results", desc: "Instant access to election results after voting concludes" },
  ];

  const faqs = [
    { question: "How does blockchain voting work?", answer: "Each vote is recorded as a transaction on the blockchain, ensuring transparency and security." },
    { question: "Is my vote anonymous?", answer: "Yes, we use advanced cryptography to maintain voter anonymity while ensuring vote validity." },
    { question: "Can I verify my vote?", answer: "Voters receive a unique transaction ID to verify their vote was counted correctly." },
  ];

  return (
    <div className="min-h-screen bg-white">
     

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-green-600 bg-clip-text text-transparent">
            Revolutionizing Democracy with Blockchain
          </h1>
          <p className="text-gray-600 text-xl mb-8">
            Secure, transparent, and accessible voting solutions powered by blockchain technology
          </p>
          <div className="space-x-4">
            <Link href={"/dashboard"}>
            <button className="bg-green-600 text-white px-8 py-3 rounded-full text-lg hover:bg-green-700 transition">
              Start Voting
            </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-green-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-600">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-green-600">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-6 md:gap-8 md:grid-cols-2">
              <div className="space-y-2 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-green-600">How does blockchain voting work?</h3>
                <p className="text-gray-600">
                  Blockchain voting uses distributed ledger technology to create a secure and transparent voting system.
                </p>
              </div>
              <div className="space-y-2 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-green-600">Is my vote really anonymous?</h3>
                <p className="text-gray-600">
                  Yes, our system ensures vote anonymity while maintaining the integrity of the voting process.
                </p>
              </div>
              <div className="space-y-2 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-green-600">Can I verify my vote was counted?</h3>
                <p className="text-gray-600">
                  You can verify your vote on the blockchain without compromising your anonymity.
                </p>
              </div>
              <div className="space-y-2 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-green-600">What makes this system more secure?</h3>
                <p className="text-gray-600">
                  The decentralized nature of blockchain makes it extremely difficult to tamper with votes or hack the
                  system.
                </p>
              </div>
            </div>
          </div>
        </section>

      {/* Footer */}
      <footer className="bg-green-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          
          <p className="text-sm">© 2023 ChainVote. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}