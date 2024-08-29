import { Election } from "@/abi/artifacts/Election";
import { sepolia } from "viem/chains";
import { useReadContract } from "wagmi";

export const useMiniElectionInfo = ({
  electionAddress,
}: {
  electionAddress: `0x${string}`;
}) => {
  const { data: electionInfo, isLoading } = useReadContract({
    chainId: sepolia.id,
    abi: Election,
    address: electionAddress,
    functionName: "electionInfo",
  });
  return { electionInfo, isLoading };
};

export const useMiniOwnerInfo = ({
  electionAddress,
}: {
  electionAddress: `0x${string}`;
}) => {
  const { data: owner, isLoading: loadingOwner } = useReadContract({
    chainId: sepolia.id,
    abi: Election,
    address: electionAddress,
    functionName: "owner",
  });
  return { owner, loadingOwner };
};
