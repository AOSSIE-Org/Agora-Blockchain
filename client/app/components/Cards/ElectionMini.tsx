"use client";
import React from "react";
import { useReadContract } from "wagmi";
import { Election } from "../../../abi/artifacts/Election";
import SkeletonElection from "../Helper/SkeletonElection";
import { FaRegUser } from "react-icons/fa6";
import { useElectionStore } from "../../hooks/ElectionInfo";
import Link from "next/link";

const ElectionMini = ({
  electionAddress,
  key,
}: {
  electionAddress: `0x${string}`;
  key: number;
}) => {
  const { data: electionInfo, isLoading } = useReadContract({
    abi: Election,
    address: electionAddress,
    functionName: "electionInfo",
  });
  const { data: owner, isLoading: loadingOwner } = useReadContract({
    abi: Election,
    address: electionAddress,
    functionName: "owner",
  });
  const { setelectionInfo } = useElectionStore();

  if (isLoading || electionInfo == undefined) return <SkeletonElection />;
  const isStarted = Math.floor(Date.now() / 1000) < Number(electionInfo[0]);
  const isEnded = Math.floor(Date.now() / 1000) > Number(electionInfo[1]);
  const electionStatus = isStarted ? "Starting" : isEnded ? "Ended" : "Live";
  return (
    <div
      key={key}
      className="flex w-xl h-xl px-3 py-1 rounded-lg border-[1.8px] border-black border-opacity-20 flex-col items-start justify-between"
    >
      <div className="group">
        <h3 className="mt-3 text-lg truncate font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
          <div>
            <span className="absolute inset-0" />
            {electionInfo![2]}
          </div>
        </h3>
        <div className="flex items-center justify-center mt-3 h-20 line-clamp-3 text-sm leading-6 text-gray-600">
          <div>{electionInfo![3]}</div>
        </div>
      </div>
      <div className=" my-2 flex items-center gap-x-4">
        <FaRegUser size={30} />
        <div className="text-sm leading-5">
          <div className="font-semibold text-gray-900">
            <div>
              <span className="absolute inset-0" />
              Michael Foster
            </div>
          </div>
          <div className="text-gray-600 truncate max-w-[100px]">
            {loadingOwner ? "0x0000000000000" : owner}
          </div>
        </div>
        <div className="flex items-center text-xs">
          <div
            className={`"inline-flex text-white items-center  text-sm font-normal px-2 py-0.5 rounded-full ${
              electionStatus === "Ended"
                ? "bg-gray-200"
                : electionStatus === "Live"
                ? "bg-green-500"
                : "bg-yellow-300"
            } "`}
          >
            <div
              className={`${electionStatus === "Ended" && "text-gray-700"} "`}
            >
              {electionStatus}
            </div>
          </div>

          <button className="px-4 py-1 z-10 text-sm font-medium text-blue-600 hover:underline  rounded-2xl  hover:border-gray-300">
            <Link href={`/election/${electionAddress}`}>Show More</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElectionMini;
