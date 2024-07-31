import React from "react";
import { UnixTimeConvertor } from "../Functions/UnixTimeConvertor";
import { VotingInfo } from "../../helpers/votingInfo";
import { useElectionData } from "@/app/hooks/ElectionInfo";

const ElectionDetails = () => {
  const { electionData } = useElectionData();
  const winner = Number(electionData[1].result);
  const timestamp = electionData[2].result;
  const resultType = electionData[3].result;
  const totalVotes = Number(electionData[4].result);
  const resultDeclared = electionData[6].result;
  const startTime = UnixTimeConvertor(timestamp![0]);
  const endTime = UnixTimeConvertor(timestamp![1]);
  let votingType: string = "";
  if (resultType) {
    votingType = VotingInfo(Number(resultType));
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-x-0 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-5">
      <div className="flex flex-col items-center justify-center w-[75%] sm:w-full h-xl bg-white p-6 rounded-lg border border-gray-200 ">
        <dt className="mb-2 text-xl font-bold">
          {startTime?.day} {startTime?.time}
        </dt>
        <dd className="text-gray-500">Starts</dd>
      </div>
      <div className="flex flex-col items-center justify-center w-[75%] sm:w-full h-xl bg-white p-6 rounded-lg border border-gray-200 ">
        <dt className="mb-2 text-xl font-bold">
          {endTime?.day} {endTime?.time}
        </dt>
        <dd className="text-gray-500 ">Ends</dd>
      </div>
      <div className="flex flex-col items-center justify-center w-[75%] sm:w-full h-xl bg-white p-6 rounded-lg border border-gray-200 ">
        <dt className="mb-2 text-xl font-bold">
          {!resultDeclared ? "~" : winner}
        </dt>
        <dd className="text-gray-500 ">Winner</dd>
      </div>
      <div className="flex flex-col items-center justify-center w-[75%] sm:w-full h-xl bg-white p-6 rounded-lg border border-gray-200 ">
        <dt className="mb-2 text-xl font-bold">
          {votingType === "" ? "General Voting" : <p>{votingType}</p>}
        </dt>
        <dd className="text-gray-500 ">Voting Type</dd>
      </div>
      <div className="flex flex-col items-center justify-center w-[75%] sm:w-full h-xl bg-white p-6 rounded-lg border border-gray-200 ">
        <dt className="mb-2 text-xl font-bold">{totalVotes}</dt>
        <dd className="text-gray-500 ">Votes Casted</dd>
      </div>
    </div>
  );
};

export default ElectionDetails;
