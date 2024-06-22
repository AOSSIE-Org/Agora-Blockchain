import React from "react";
import { AVATARS } from "../../constants";
import { useReadContract } from "wagmi";
import { Election } from "../../../abi/artifacts/Election";
import LoaderInline from "../Helper/LoaderInline";
const ElectionCandidates = ({
  electionAddress,
}: {
  electionAddress: `0x${string}`;
}) => {
  const { data: candidateList, isLoading } = useReadContract({
    abi: Election,
    address: electionAddress,
    functionName: "getCandidateList",
  });
  const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  if (isLoading) return <LoaderInline />;
  return (
    <div className="w-full max-w-md p-4 mt-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 ">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none text-gray-900 ">
          Candidate List
        </h5>
        <button className="text-sm font-medium text-blue-600 hover:underline ">
          View all
        </button>
      </div>
      <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200 ">
          {candidates?.map((candidate, key) => {
            if (key > 4) return null;
            return (
              <li className="pt-3 pb-0 sm:pt-4">
                <div className="flex items-center ">
                  <div className="flex-shrink-0">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={AVATARS[key % 4]}
                      alt="pfp"
                    />
                  </div>
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate ">
                      {/* {candidate.name} */}Name
                    </p>
                    <p className="text-sm text-gray-500 truncate ">
                      {/* Id : {Number(candidate.candidateID)} */} CandidateID
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 ">
                    $2367
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ElectionCandidates;
