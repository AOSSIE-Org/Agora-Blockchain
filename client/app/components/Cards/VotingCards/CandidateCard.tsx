import React from "react";
import { AVATARS } from "../../../constants";
const CandidateCard = ({
  candidate,
  isMini,
}: {
  candidate: any;
  isMini: boolean;
}) => {
  return (
    <li className="p-2 select-none">
      <div className="flex items-center ">
        <div className="flex-shrink-0">
          <img
            className="w-8 h-8 rounded-full"
            src={AVATARS[Number(candidate.candidateID) % 4]}
            alt="pfp"
          />
        </div>
        <div className="flex-1 min-w-0 ms-4">
          <p className="text-sm font-medium text-gray-900 truncate ">
            {candidate.name}
          </p>
          <p
            className={`text-sm text-gray-500 truncate w-[80%] ${
              isMini ? "max-w-96" : ""
            }`}
          >
            {/* {candidate.description} */} Candidate Description : Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. et luctus ante, et
            lacinia ligula. Etiam enim lectus, efficitur ac semper ac, maximus a
            nunc. Fusce vitae lacus dictum, dapibus sit amet, dapibus eros. Sed
            a condimentum nulla. Duis ut urna amet sapien malesuada finibus in
            tempor erat. Praesent congue risus.
          </p>
        </div>
        <div className="inline-flex items-center text-base font-semibold text-gray-900 ">
          {Number(candidate.candidateID)}
        </div>
      </div>
    </li>
  );
};

export default CandidateCard;
