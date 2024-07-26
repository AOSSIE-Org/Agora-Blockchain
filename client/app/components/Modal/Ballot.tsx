"use client";
import React, { useState } from "react";
import { Dialog, DialogBackdrop } from "@headlessui/react";
import { useElectionModal } from "../../hooks/ElectionModal";
import { useElectionData } from "@/app/hooks/ElectionInfo";

import GeneralBallot from "../Cards/BallotCards/GeneralBallot";
import ScoreBallot from "../Cards/BallotCards/ScoreBallot";
import RankedBallot from "../Cards/BallotCards/RankedBallot";

const Ballot = ({
  isOwner,
  candidateList,
  resultType,
}: {
  candidateList: any;
  resultType: number;
  isOwner: boolean;
}) => {
  const { electionData } = useElectionData();
  const { electionModal, setelectionModal } = useElectionModal();
  const isVoted = electionData[5].result;
  const [inside, setinside] = useState(false);
  const [electionCredits, setelectionCredits] = useState(
    resultType === 5 ? 100 : 0
  );
  const checkCloseModal = () => {
    if (!inside) setelectionModal(false);
  };
  let ballotType = 3;
  if (resultType <= 1) {
    ballotType = 1;
  } else if (resultType >= 7 || resultType <= 4) {
    ballotType = 2;
  }
  return (
    <Dialog
      className="relative z-30"
      open={electionModal}
      onClose={setelectionModal}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-10 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div
        onClick={checkCloseModal}
        className="overflow-y-auto overflow-x-hidden flex fixed z-40 justify-center items-center w-full inset-0 h-screen"
      >
        <div
          onMouseEnter={() => {
            setinside(true);
          }}
          onMouseLeave={() => {
            setinside(false);
          }}
          className="md:w-[80%] md:h-[82%] w-[87%] h-[88%]  p-4 bg-white border border-gray-200 rounded-2xl shadow sm:p-8 "
        >
          <div className="flex items-center h-[10%] justify-between mb-2">
            <h5 className="text-xl font-bold leading-none text-gray-900 ">
              Candidate List
            </h5>
            <div className="text-sm font-medium ">
              {ballotType == 2
                ? "#ID"
                : resultType === 5
                ? `Credits Left : ${electionCredits}`
                : resultType === 6
                ? `Max Credits per Candidate : 10`
                : " "}
            </div>
          </div>
          <div className="flow-root h-[90%]">
            {ballotType === 1 && (
              <div className="overflow-auto h-full">
                <GeneralBallot
                  candidateList={candidateList}
                  isVoted={isVoted}
                  isOwner={isOwner}
                />
              </div>
            )}
            {ballotType === 2 && (
              <RankedBallot
                candidateList={candidateList}
                isVoted={isVoted}
                isOwner={isOwner}
              />
            )}
            {ballotType === 3 && (
              <ScoreBallot
                candidateList={candidateList}
                isVoted={isVoted}
                isOwner={isOwner}
                electionCredits={electionCredits}
                isScore={resultType === 6}
                setelectionCredits={setelectionCredits}
              />
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
export default Ballot;
