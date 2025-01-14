"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ElectionMini from "../components/Cards/ElectionMini";
import { useOpenElection } from "../components/Hooks/GetOpenElections";
import Loader from "../components/Helper/Loader";
import ErrorPage from "../components/Error-pages/ErrorPage";

const ElectionMiniSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-pulse w-full">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/4 mt-6"></div>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { elections = [], isLoading=false } = useOpenElection();
  const [showError, setShowError] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setShowError(true);
      }
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timer);
  }, [isLoading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (showError) {
    return <ErrorPage 
    errorCode={403} // Forbidden error, often due to access restrictions
  errorMessage="Oops! Something went wrong."
  details="We couldn't load the page you're trying to access. This may be due to a temporary issue with our servers. Please try again later."
  redirectPath="/"
  redirectLabel="Go to Homepage"
  onRetry={() => window.location.reload()}
  />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 pt-20 flex items-start justify-center">
      <div className="w-full max-w-4xl p-6 bg-white rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
        <motion.div
          className="space-y-6 overflow-auto pr-4"
          style={{ height: "calc(100vh - 12rem)" }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {elections.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No elections found
            </div>
          ) : (
            elections.map((election, index) => (
              <motion.div key={election || index} variants={itemVariants}>
                <ElectionMini electionAddress={election} />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
