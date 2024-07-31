import React from "react";
import { Tooltip } from "@material-tailwind/react";
import { VotingInfo } from "@/app/helpers/votingInfo";
const ElectionInfoPopup = ({ id }: { id: number }) => {
  const { name, description } = VotingInfo(id);
  return (
    <Tooltip
      placement="top-end"
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0, y: 25 },
      }}
      className="border text-blue-gray-900 border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
      content={
        <div className="w-80">
          <div className="font-medium">{name} Voting</div>
          <div className="font-normal opacity-80">{description}</div>
        </div>
      }
    >
      <div className="inline-flex text-blue-gray-500 p-2 font-medium items-center select-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      </div>
    </Tooltip>
  );
};

export default ElectionInfoPopup;
