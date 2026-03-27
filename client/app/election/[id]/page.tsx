"use client";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { usePathname } from "next/navigation";
import Loader from "../../components/Helper/Loader";
import ElectionDetails from "../../components/Cards/ElectionDetails";
import ClipBoard from "../../components/Helper/ClipBoard";
import ElectionCandidates from "../../components/Cards/ElectionCandidates";
import { Toaster } from "react-hot-toast";
import ButtonCard from "../../components/Cards/ButtonCard";
import { useElectionData } from "@/app/hooks/ElectionInfo";
import CrossChain from "@/app/components/Helper/CrossChain";
import { useElectionInformation } from "@/app/components/Hooks/GetElectionInformation";

const ElectionPage = ({ params }: { params: { id: `0x${string}` } }) => {
  const { address } = useAccount();
  const pathname = usePathname();
  const electionAddress = params.id;
  const { electionData, setelectionData } = useElectionData();
  const { electionInformation, isLoading } = useElectionInformation({
    address: address,
    electionAddress: electionAddress,
  });

  // Sync latest fetched election info into the shared store.
  useEffect(() => {
    if (electionInformation) {
      setelectionData(electionInformation);
    }
  }, [electionInformation, setelectionData]);

  // Reset shared election data when context changes or this page unmounts.
  useEffect(() => {
    return () => {
      setelectionData(null);
    };
  }, [address, electionAddress, setelectionData]);

  if (isLoading) return <Loader />;

  const resolvedElectionData = electionData ?? electionInformation;
  if (!resolvedElectionData) return <Loader />;

  const owner = resolvedElectionData[0].result;
  const winners = Number(resolvedElectionData[1].result);
  const electionInfo = resolvedElectionData[2].result;
  const resultType = resolvedElectionData[3].result;
  const totalVotes = Number(resolvedElectionData[4].result);
  const userVoted = resolvedElectionData[5].result;
  const resultDeclared = resolvedElectionData[6].result;
  const candidateList = resolvedElectionData[7].result;
  const electionID = resolvedElectionData[8].result;
  const isCrossChainEnabled = resolvedElectionData[9].result;
  const isStarting = Math.floor(Date.now() / 1000) < Number(electionInfo[0]);
  const isEnded = Math.floor(Date.now() / 1000) > Number(electionInfo[1]);
  const electionStat = isStarting ? 1 : isEnded ? 3 : 2;

  // Build URL safely without accessing window during SSR
  const currentUrl = typeof window !== "undefined" ? window.location.href : `${pathname}`;

  return (
    <div className="h-screen overflow-auto bg-white pt-20 w-full rounded-2xl flex items-start justify-center">
      <div className="w-[90%] p-4">
        <div className="p-2 rounded-lg md:p-4 ">
          <div className="flex mx-6 my-1 w-full items-start justify-around lg:mx-0">
            <div className="flex flex-col">
              <p className="mt-2 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                {electionInfo![2]}
              </p>
              <div className="mt-2 text-sm sm:text-lg leading-8 text-gray-600">
                {electionInfo![3]}
              </div>
            </div>
          </div>
        </div>
        <ElectionDetails />
        <div className="md:flex-row gap-x-4 flex flex-col items-center sm:items-stretch justify-between">
          <ElectionCandidates
            isOwner={owner === address}
            resultType={resultType}
            electionStat={electionStat}
          />
          <ButtonCard isOwner={owner === address} />
        </div>
        <div className="md:flex-row gap-x-4 flex flex-col items-center sm:items-stretch justify-between">
          <ClipBoard inputValue={currentUrl} />
          <CrossChain
            isEnded={isEnded}
            electionAddress={electionAddress}
            isCrossChainEnabled={isCrossChainEnabled}
          />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ElectionPage;
