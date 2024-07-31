"use client";
import React, { useEffect } from "react";
import { useReadContract } from "wagmi";
import { Election } from "../../../abi/artifacts/Election";
import SkeletonElection from "../Helper/SkeletonElection";
import { FaRegUser } from "react-icons/fa6";
import { IoOpenOutline } from "react-icons/io5";
import Link from "next/link";
import { sepolia } from "viem/chains";
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
  const { data: electionInfo, isLoading } = useReadContract({
    chainId: sepolia.id,
    abi: Election,
    address: electionAddress,
    functionName: "electionInfo",
  });
  const { data: owner, isLoading: loadingOwner } = useReadContract({
    chainId: sepolia.id,
    abi: Election,
    address: electionAddress,
    functionName: "owner",
  });

  if (isLoading || electionInfo == undefined) return <SkeletonElection />;
  const isStarting = Math.floor(Date.now() / 1000) < Number(electionInfo[0]);
  const isEnded = Math.floor(Date.now() / 1000) > Number(electionInfo[1]);
  const electionStat = isStarting ? 1 : isEnded ? 3 : 2;
  update?.(electionAddress, electionStat);
  return (
    <div className="flex h-xl bg-white px-3 py-1 rounded-xl border border-gray-300 bg-clip-border shadow-md shadow-blue-gray-900/5 flex-col items-start justify-between">
      <div className="group w-full relative ">
        <h3 className="mt-3 text-lg  font-semibold leading-6 text-gray-900 ">
          <div>
            <span className="absolute" />
            {electionInfo![2]}
          </div>
        </h3>
        <div className="flex w-full items-start justify-start mt-3 h-20 line-clamp-3 text-sm leading-6 text-gray-600">
          <div>{electionInfo![3]}</div>
        </div>
        <div
          className={`"inline-flex  items-center absolute right-1.5 top-1.5 text-sm font-normal px-3 py-0.5 rounded-full ${
            electionStat === 3
              ? "bg-gray-200"
              : electionStat === 2
              ? "bg-green-500"
              : "bg-yellow-400"
          } "`}
        >
          <div className={`${electionStat === 3 && "text-gray-700"} "`}>
            {ElectionStatus[electionStat]}
          </div>
        </div>
      </div>
      <div className=" my-2 flex items-center justify-between w-full">
        <div className=" flex  items-center">
          <FaRegUser size={25} />
          <div className="text-sm mx-1 leading-5">
            <div className="font-semibold text-gray-900">
              <div>
                <span className="absolute " />
                Owner
              </div>
            </div>
            <div className="text-gray-600 truncate max-w-[100px]">
              {loadingOwner ? "0x0000000000000" : owner}
            </div>
          </div>
        </div>
        <div className="flex items-center text-xs">
          <Link href={`/election/${electionAddress}`}>
            <button className="px-4 relative py-1 z-10 text-sm font-medium text-blue-600 hover:underline  rounded-2xl  hover:border-gray-300">
              Open
              <div className="absolute right-0 top-1.5">
                <IoOpenOutline />
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ElectionMini;
