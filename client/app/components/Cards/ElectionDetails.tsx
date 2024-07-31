import React from "react";
import { UnixTimeConvertor } from "../Functions/UnixTimeConvertor";
import { VotingInfo } from "../../helpers/votingInfo";
import { useElectionData } from "@/app/hooks/ElectionInfo";

const ElectionDetails = ({ electionStat }: { electionStat: number }) => {
  const { electionData } = useElectionData();
  const timestamp = electionData[2].result;
  const resultType = electionData[3].result;
  const totalVotes = Number(electionData[4].result);
  const startTime = UnixTimeConvertor(timestamp[0]);
  const endTime = UnixTimeConvertor(timestamp[1]);
  const votingType = VotingInfo(Number(resultType));
  const ElectionStatus: { [key: number]: string } = {
    1: "Pending",
    2: "Active",
    3: "Ended",
  };
  const cardData = [
    { head: `${startTime?.day} ${startTime?.time}`, des: "Starts" },
    { head: `${endTime?.day} ${endTime?.time}`, des: "Ends" },
    {
      head: ElectionStatus[electionStat],
      des: "Status",
    },
    { head: `${votingType.name}`, des: "Voting Type" },
    { head: `${totalVotes}`, des: "Votes Casted" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-x-0 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-5">
      {cardData.map((card, key) => {
        return (
          <div
            key={key}
            className="flex flex-col items-center select-none justify-center w-[75%] sm:w-full h-xl bg-white p-6 rounded-lg border border-gray-200 "
          >
            <dt className="mb-2 text-xl font-bold">{card.head}</dt>
            <dd className="text-gray-500">{card.des}</dd>
          </div>
        );
      })}
    </div>
  );
};

export default ElectionDetails;
