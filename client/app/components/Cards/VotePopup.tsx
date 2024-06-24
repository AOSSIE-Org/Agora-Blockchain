import React from "react";
import { useAccount, useReadContract } from "wagmi";
import { Election } from "../../../abi/artifacts/Election";
import LoaderInline from "../Helper/LoaderInline";

const VotePopup = ({ electionAddress }: { electionAddress: `0x${string}` }) => {
  const { address } = useAccount();
  const { data: isVoted, isLoading } = useReadContract({
    abi: Election,
    address: electionAddress,
    functionName: "userVoted",
    args: [address!],
  });
  if (!address) return null;
  if (isLoading) return <LoaderInline />;
  return (
    <div className="my-2 flex items-center justify-center">
      <button
        className="bg-[#2463eb] text-white rounded-lg px-3 py-0.5 hover:bg-blue-700"
        disabled={isVoted}
      >
        Vote
      </button>
    </div>
  );
};

export default VotePopup;
