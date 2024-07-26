"use client";
import React from "react";
import { Election } from "../../../abi/artifacts/Election";
import { useAccount, useReadContracts } from "wagmi";
import Loader from "../../components/Helper/Loader";
import ElectionDetails from "../../components/Cards/ElectionDetails";
import ClipBoard from "../../components/Helper/ClipBoard";
import ElectionCandidates from "../../components/Cards/ElectionCandidates";
import { Toaster } from "react-hot-toast";
import ButtonCard from "../../components/Cards/ButtonCard";
import { sepolia } from "viem/chains";
import { useElectionData } from "@/app/hooks/ElectionInfo";

const page = ({ params }: { params: { id: `0x${string}` } }) => {
  const { address } = useAccount();
  const electionAddress = params.id;
  const { electionData, setelectionData } = useElectionData();
  const electionContract = {
    abi: Election,
    address: electionAddress,
    chainId: sepolia.id,
  };
  const { data: electionInformation, isLoading } = useReadContracts({
    contracts: [
      {
        ...electionContract,
        functionName: "owner",
      },
      {
        ...electionContract,
        functionName: "getWinners",
      },
      {
        ...electionContract,
        functionName: "electionInfo",
      },
      {
        ...electionContract,
        functionName: "resultType",
      },
      {
        ...electionContract,
        functionName: "totalVotes",
      },
      {
        ...electionContract,
        functionName: "userVoted",
        args: [address!],
      },
      {
        ...electionContract,
        functionName: "resultsDeclared",
      },
      {
        ...electionContract,
        functionName: "getCandidateList",
      },
    ],
  });

  if (isLoading) return <Loader />;

  if (electionData !== electionInformation) {
    setelectionData(electionInformation);
  }

  if (!electionData) return <Loader />;

  const owner = electionData[0].result;
  const winners = Number(electionData[1].result);
  const electionInfo = electionData[2].result;
  const resultType = electionData[3].result;
  const totalVotes = Number(electionData[4].result);
  const userVoted = electionData[5].result;
  const resultDeclared = electionData[6].result;
  const candidateList = electionData[7].result;
  const isStarting = Math.floor(Date.now() / 1000) < Number(electionInfo[0]);
  const isEnded = Math.floor(Date.now() / 1000) > Number(electionInfo[1]);
  const electionStat = isStarting ? 1 : isEnded ? 3 : 2;
  return (
    <div className="min-h-screen overflow-auto bg-white pt-20 w-full flex items-start justify-center">
      <div className="my-2 rounded-2xl">
        <div className="mx-4 px-6 lg:px-8">
          <div className=" p-2 rounded-lg md:p-4 ">
            <div className="flex mx-6 my-1 w-full items-start justify-around lg:mx-0">
              <div className="flex flex-col">
                <p className="mt-2 text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
                  {electionInfo![2]}
                </p>
                <div className="mt-2 text-sm sm:text-lg leading-8 text-gray-600">
                  {electionInfo![3]}
                </div>
              </div>
              {/* <div className="inline-block h-[100px] min-h-[1em] w-0.5 self-stretch  bg-gray-300"></div>
              <div className="flex flex-col items-around justify-center">
                <div className="my-1 ">
                  <ClipBoard inputValue={window.location.href} />
                </div>
              </div> */}
            </div>
          </div>
          <ElectionDetails electionStat={electionStat} />
          <div className="md:flex-row gap-x-4 flex flex-col items-center sm:items-stretch justify-between">
            <ElectionCandidates
              isOwner={owner === address}
              resultType={resultType}
              electionStat={electionStat}
            />
            <ButtonCard isOwner={owner === address} />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default page;
