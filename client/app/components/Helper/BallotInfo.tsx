import { Tooltip } from "@material-tailwind/react";
import React from "react";

export const BallotVoteInfo = [
  "Simply click the 'Vote' button below to your chosen candidate to cast your vote.",
  "Rank the candidates in order of your preference, starting with your top choice.",
  "Allocate your credits among the candidates as you see fit. You can distribute them evenly or give more to your preferred candidates.",
];

const BallotInfo = ({ ballotID }: { ballotID: number }) => {
  return (
    <div className="flex items-center justify-center text-base h-[5%] flex-col">
      <Tooltip
        content={BallotVoteInfo[ballotID]}
        className="border border-blue-gray-50 rounded-xl text-base bg-white z-40 text-blue-gray-900 px-4 py-1.5 shadow-xl shadow-black/10"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0, y: 25 },
        }}
      >
        <div className="font-medium select-none">&#9432;</div>
      </Tooltip>
    </div>
  );
};

export default BallotInfo;
