import React from "react";
import { UnixTimeConvertor } from "../Functions/UnixTimeConvertor";
import { useReadContract } from "wagmi";
import { Election } from "../../../abi/artifacts/Election";
import { VotingInfo } from "../../helpers/votingInfo";

const ElectionDetails = ({ electionAddress, timestamp }) => {
  const startTime = UnixTimeConvertor(timestamp![0]);
  const endTime = UnixTimeConvertor(timestamp![1]);
  const { data: resultType, isLoading } = useReadContract({
    abi: Election,
    address: electionAddress,
    functionName: "resultType",
  });
  let votingType: string = "";
  if (resultType) {
    votingType = VotingInfo(Number(resultType));
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 md:grid-cols-3 lg:grid-cols-5">
      <div className="flex flex-col items-center justify-center w-xl h-xl bg-white p-6 rounded-lg border border-gray-200 ">
        <dt className="mb-2 text-xl font-bold">
          {startTime?.day} {startTime?.time}
        </dt>
        <dd className="text-gray-500">Starts</dd>
      </div>
      <div className="flex flex-col items-center justify-center w-xl h-xl bg-white p-6  rounded-lg border border-gray-200 ">
        <dt className="mb-2 text-xl font-bold">
          {endTime?.day} {endTime?.time}
        </dt>
        <dd className="text-gray-500 ">Ends</dd>
      </div>
      <div className="flex flex-col items-center justify-center w-xl h-xl bg-white p-6  rounded-lg border border-gray-200 ">
        <dt className="mb-2 text-xl font-bold">1000+</dt>
        <dd className="text-gray-500 ">Views</dd>
      </div>
      <div className="flex flex-col items-center justify-center w-xl h-xl bg-white p-6  rounded-lg border border-gray-200 ">
        <dt className="mb-2 text-xl font-bold">
          {votingType === "" ? "General Voting" : <p>{votingType}</p>}
        </dt>
        <dd className="text-gray-500 ">Voting Type</dd>
      </div>
      <div className="flex flex-col items-center justify-center w-xl h-xl bg-white p-6  rounded-lg border border-gray-200 ">
        <dt className="mb-2 text-xl font-bold">90+</dt>
        <dd className="text-gray-500 ">Votes Casted</dd>
      </div>
    </div>
  );
};

export default ElectionDetails;
