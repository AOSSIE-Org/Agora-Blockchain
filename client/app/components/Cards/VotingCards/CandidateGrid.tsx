"use client";
import React, { Fragment } from "react";
import {
  AVATARS,
  CCIP_FUJI_ADDRESS,
  SEPOLIA_CHAIN_SELECTOR,
  ELECTION_FACTORY_ADDRESS,
} from "../../../constants";
import {
  Menu,
  Transition,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { ErrorMessage } from "../../../helpers/ErrorMessage";
import toast from "react-hot-toast";
import { useElectionModal } from "../../../hooks/ElectionModal";
import { Election } from "../../../../abi/artifacts/Election";
import { CCIPSender } from "@/abi/artifacts/CCIPSender";
import { useParams } from "next/navigation";
import { sepolia } from "viem/chains";

const CandidateGrid = ({
  isVoted,
  candidate,
  isOwner,
}: {
  isOwner: boolean;
  isVoted: boolean;
  candidate: any;
}) => {
  const { id: electionAddress } = useParams<{ id: `0x${string}` }>();
  const { switchChain } = useSwitchChain();
  const { chain } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { setelectionModal } = useElectionModal();
  const candidateId = Number(candidate.candidateID);
  const vote = async () => {
    try {
      if (chain?.id === 43113) {
        await writeContractAsync({
          address: CCIP_FUJI_ADDRESS,
          abi: CCIPSender,
          functionName: "sendMessage",
          args: [
            SEPOLIA_CHAIN_SELECTOR,
            ELECTION_FACTORY_ADDRESS,
            electionAddress,
            [BigInt(candidate.candidateID)],
          ],
        });
      } else {
        await writeContractAsync({
          address: electionAddress,
          abi: Election,
          functionName: "userVote",
          args: [[BigInt(candidate.candidateID)]],
        });
      }
      toast.success(`Voted Casted to ${candidate.name}`);
      setelectionModal(false);
    } catch (error) {
      toast.error(ErrorMessage(error));
    }
  };
  const removeCandidate = async () => {
    try {
      if (chain?.id === 43113) switchChain({ chainId: sepolia.id });
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
    <div className="w-full relative max-w-sm bg-white border border-gray-200 rounded-lg shadow ">
      {isOwner && (
        <Menu as="div" className="inline-block text-left">
          <MenuButton className="flex items-center justify-center">
            <button className=" absolute top-1 right-1 text-gray-500  hover:bg-gray-100  focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg text-sm p-1.5">
              <svg
                className="w-5 h-5"
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
            <MenuItems className="absolute right-0 z-10 mt-2  w-[70%] border-white border-[1px] border-opacity-20 origin-top-right shadow-lg ring-1 bg-white ring-gray-600 ring-opacity-5 rounded-xl focus:outline-none">
              <div className="flex flex-col items-center justify-center">
                <MenuItem>
                  <button className="flex items-center gap-x-3 justify-center  w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                    </svg>
                    Edit
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={removeCandidate}
                    className="flex items-center justify-center gap-x-3 w-full px-4 py-2 text-sm text-red-600  hover:bg-gray-100 "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delete
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      )}

      <div className="flex mt-2 flex-col items-center pb-2">
        <img
          className="w-16 h-16 mb-3 rounded-full shadow-lg"
          src={AVATARS[candidateId % 4]}
          alt="pfp"
        />
        <h5 className="mb-1 text-xl font-medium text-gray-900">
          {candidate.name} #{Number(candidateId)}
        </h5>
        <p className="text-sm overflow-y-auto p-2 w-full h-20 text-gray-500 ">
          {/* {candidate.description} */}
          Candidate Description : Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. et luctus ante, et lacinia ligula. Etiam enim lectus,
          efficitur ac semper ac, maximus a nunc. Fusce vitae lacus dictum,
          dapibus sit amet, dapibus eros. Sed a condimentum nulla. Duis ut urna
          amet sapien malesuada finibus in tempor erat. Praesent congue risus.
        </p>
        {!isVoted && (
          <div className="flex mt-4">
            <button
              onClick={vote}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              Vote
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateGrid;
