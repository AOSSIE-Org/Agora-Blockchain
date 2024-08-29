"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaRegUser } from "react-icons/fa6";
import { IoOpenOutline } from "react-icons/io5";
import Link from "next/link";
import {
  useMiniElectionInfo,
  useMiniOwnerInfo,
} from "../Hooks/GetMiniElectionInfo";
import SkeletonElection from "../Helper/SkeletonElection";

const ElectionMini = ({
  electionAddress,
  update,
}: {
  electionAddress: `0x${string}`;
  update?: (electionAddress: `0x${string}`, status: number) => void;
}) => {
  const ElectionStatus = {
    1: "Pending",
    2: "Active",
    3: "Ended",
  };
  const { electionInfo, isLoading } = useMiniElectionInfo({
    electionAddress: electionAddress,
  });
  const { owner, loadingOwner } = useMiniOwnerInfo({
    electionAddress: electionAddress,
  });

  if (isLoading || electionInfo == undefined) return <SkeletonElection />;
  const isStarting = Math.floor(Date.now() / 1000) < Number(electionInfo[0]);
  const isEnded = Math.floor(Date.now() / 1000) > Number(electionInfo[1]);
  const electionStat = isStarting ? 1 : isEnded ? 3 : 2;
  update?.(electionAddress, electionStat);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
            {electionInfo[2]}
          </h3>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              electionStat === 3
                ? "bg-gray-100 text-gray-800"
                : electionStat === 2
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {ElectionStatus[electionStat]}
          </motion.div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {electionInfo[3]}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaRegUser className="text-gray-400" size={20} />
            <div>
              <p className="text-xs font-semibold text-gray-700">Owner</p>
              <p className="text-xs text-gray-500 truncate w-24">
                {loadingOwner ? "Loading..." : owner}
              </p>
            </div>
          </div>
          <Link href={`/election/${electionAddress}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-sm btn-primary normal-case"
            >
              Open
              <IoOpenOutline className="ml-1" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ElectionMini;
