"use client";
import React, { Fragment, useState } from "react";
import {
  Menu,
  Transition,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import { AVATARS } from "../../../constants";
import { useWriteContract } from "wagmi";
import { Election } from "@/abi/artifacts/Election";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import toast from "react-hot-toast";
import { ErrorMessage } from "@/app/helpers/ErrorMessage";

const CandidateCard = ({
  candidate,
  isMini,
  electionAddress,
  isOwner,
}: {
  candidate: any;
  electionAddress: `0x${string}`;
  isMini: boolean;
  isOwner: boolean;
}) => {
  const [inside, setinside] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const candidateId = Number(candidate.candidateID);
  const removeCandidate = async () => {
    try {
      await writeContractAsync({
        address: electionAddress,
        abi: Election,
        functionName: "removeCandidate",
        args: [BigInt(candidate.candidateID)],
      });
      toast.success(`Removed Candidate ${candidate.name}`);
    } catch (error) {
      toast.error(ErrorMessage(error));
    }
  };

  return (
    <li className="p-2 select-none">
      <div
        onMouseEnter={() => {
          setinside(true);
        }}
        onMouseLeave={() => {
          setinside(false);
        }}
        className="flex relative items-center "
      >
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
        {isOwner && (
          <Menu
            as="div"
            className={`inline-block text-left ${!inside && "hidden"}`}
          >
            <MenuButton className="flex items-center justify-center">
              <button className=" absolute rounded-xl right-0 text-gray-500  bg-gray-100  focus:ring-4 focus:outline-none focus:ring-gray-200 text-sm p-1.5">
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 3"
                >
                  <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                </svg>
              </button>
            </MenuButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 z-10 mt-2 max-w-60  w-[50%] border-white border-[1px] border-opacity-20 origin-top-right shadow-lg ring-1 bg-white ring-gray-600 ring-opacity-5 rounded-xl focus:outline-none ">
                <div className="py-1  flex flex-col items-center justify-center">
                  <MenuItem>
                    <button className="flex items-center gap-x-3 justify-center  w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ">
                      <PencilIcon className="w-6" />
                      Edit
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={removeCandidate}
                      className="flex items-center justify-center gap-x-3 w-full px-4 py-2 text-sm text-red-600  hover:bg-gray-100 "
                    >
                      <TrashIcon className="w-6" />
                      Delete
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        )}
      </div>
    </li>
  );
};

export default CandidateCard;
