"use client";
import React from "react";
import * as ContextMenu from "@radix-ui/react-context-menu";

import { AVATARS } from "../../../constants";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { Election } from "@/abi/artifacts/Election";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import toast from "react-hot-toast";
import { ErrorMessage } from "@/app/helpers/ErrorMessage";
import { useParams } from "next/navigation";
import { sepolia } from "viem/chains";

const CreditsVoting = ({
  candidate,
  isOwner,
  id,
  handleChange,
  score,
}: {
  candidate: any;
  isOwner: boolean;
  id: number;
  score: number;
  handleChange: any;
}) => {
  const { id: electionAddress } = useParams<{ id: `0x${string}` }>();
  const { switchChain } = useSwitchChain();
  const { chain } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const candidateId = Number(candidate.candidateID);
  const removeCandidate = async () => {
    try {
      if (chain?.id === 43113) switchChain({ chainId: sepolia.id });
      await writeContractAsync({
        address: electionAddress as `0x${string}`,
        abi: Election,
        functionName: "removeCandidate",
        args: [candidate.candidateID],
      });
      toast.success(`Removed Candidate ${candidate.name}`);
    } catch (error) {
      toast.error(ErrorMessage(error));
    }
  };
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div className="p-2 select-none">
          <div className="flex relative items-center ">
            <div className="flex-shrink-0">
              <img
                className="w-9 h-9 rounded-full"
                src={AVATARS[candidateId % 4]}
                alt="pfp"
              />
            </div>
            <div className="flex-1 min-w-0 ms-4">
              <div className="text-sm font-medium flex gap-x-3">
                <p className="inline-flex items-center text-blue-900 ">
                  #{candidateId}
                </p>
                <p className=" text-gray-900 truncate ">{candidate.name}</p>
              </div>
              <p className="text-sm text-gray-500 truncate w-[80%]">
                {candidate.description}
              </p>
            </div>
            <input
              className="absolute w-16 rounded-xl right-0 text-gray-800 bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 text-sm px-2.5 py-1.5"
              type="number"
              placeholder="0"
              value={score === 0 ? "" : score}
              onChange={(event) => {
                handleChange(id, Number(event.target.value));
              }}
            />
          </div>
        </div>
      </ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content className="z-40 w-44 border-white border-[1px] border-opacity-20 origin-top-right shadow-lg ring-1 bg-white ring-gray-600 ring-opacity-5 rounded-xl focus:outline-none ">
          {isOwner && (
            <div className="flex flex-col items-center justify-center">
              <ContextMenu.Item>
                <button className="flex items-center gap-x-3 justify-center  w-full px-4 py-2 text-sm text-gray-700 ">
                  <PencilIcon className="w-6" />
                  Edit
                </button>
              </ContextMenu.Item>
              <ContextMenu.Item>
                <button
                  onClick={removeCandidate}
                  className="flex items-center justify-center gap-x-3 w-full px-4 py-2 text-sm text-red-600 "
                >
                  <TrashIcon className="w-6" />
                  Delete
                </button>
              </ContextMenu.Item>
            </div>
          )}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};

export default CreditsVoting;
