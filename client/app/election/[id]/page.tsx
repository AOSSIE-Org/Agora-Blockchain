"use client";
import React from "react";
import { Election } from "../../../abi/artifacts/Election";
import { useReadContracts } from "wagmi";
import Loader from "../../components/Helper/Loader";
import ElectionDetails from "../../components/Cards/ElectionDetails";
import ClipBoard from "../../components/Helper/ClipBoard";
import ElectionCandidates from "../../components/Cards/ElectionCandidates";
import { Toaster } from "react-hot-toast";
import ButtonCard from "../../components/Cards/ButtonCard";
const page = ({ params }: { params: { id: `0x${string}` } }) => {
  const electionAddress = params.id;
  const electionContract = {
    abi: Election,
    address: electionAddress,
  };

  const { data: electionInformation, isLoading } = useReadContracts({
    contracts: [
      {
        ...electionContract,
        functionName: "owner",
      },
      {
        ...electionContract,
        functionName: "winner",
      },
      {
        ...electionContract,
        functionName: "electionInfo",
      },
      {
        ...electionContract,
        functionName: "resultType",
      },
    ],
  });
  if (isLoading) return <Loader />;
  const owner = electionInformation![0].result;
  const winner = electionInformation![1].result;
  const electionInfo = electionInformation![2].result;
  const resultType = electionInformation![3].result;
  return (
    <div className="min-h-screen overflow-auto bg-white pt-20 w-full flex items-start justify-center">
      <div className="my-2 rounded-2xl">
        <div className="mx-4 px-6 lg:px-8">
          <div className=" p-2 rounded-lg md:p-4 ">
            <div className="flex mx-6 my-1 w-3xl  items-center justify-around lg:mx-0">
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
          <ElectionDetails
            timestamp={electionInfo}
            resultType={resultType}
            winner={Number(winner)}
          />
          <div className="md:flex-row gap-x-4 flex flex-col justify-between">
            <ElectionCandidates
              electionAddress={electionAddress}
              resultType={resultType}
            />
            <ButtonCard
              owner={owner!}
              electionAddress={electionAddress}
              winner={Number(winner)}
            />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default page;
