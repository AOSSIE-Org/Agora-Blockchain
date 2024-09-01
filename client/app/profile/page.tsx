"use client";

import React from "react";
import { motion } from "framer-motion";
import ElectionMini from "../components/Cards/ElectionMini";
import { useOpenElection } from "../components/Hooks/GetOpenElections";

const ElectionMiniSkeleton = () => {
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
  const { elections, isLoading } = useOpenElection();

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
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <ElectionMiniSkeleton />
                  </motion.div>
                ))
            : elections?.map((election, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <ElectionMini electionAddress={election} />
                </motion.div>
              ))}
        </motion.div>
import React from "react";
import ElectionMini from "../components/Cards/ElectionMini";
import { useOpenElection } from "../components/Hooks/GetOpenElections";
import Loader from "../components/Helper/Loader";

const ProfilePage = () => {
  const { elections, isLoading } = useOpenElection();
  if (isLoading) return <Loader />;
  return (
    <div className="min-h-screen overflow-auto bg-white pt-20 w-full flex items-start justify-center">
      <div className="my-2 rounded-2xl">
        <div className=" p-2 rounded-lg md:p-4 ">
          <div className="flex flex-col mx-6 my-1 w-full items-start justify-around lg:mx-0">
            <p className="mt-2 text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
              Profile
            </p>
          </div>
          <div
            className="w-[90%] lg:w-[75%] flex-col space-y-6 my-3 inline-block overflow-auto items-center justify-center"
            style={{ height: "75vh" }}
          >
            {elections!.map((election, key) => {
              return <ElectionMini electionAddress={election} key={key} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
