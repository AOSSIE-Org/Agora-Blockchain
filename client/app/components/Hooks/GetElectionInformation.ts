import { CCIPSender } from "@/abi/artifacts/CCIPSender";
import { Election } from "@/abi/artifacts/Election";
import { CCIP_FUJI_ADDRESS } from "@/app/constants";
import { avalancheFuji, sepolia } from "viem/chains";
import { useReadContracts } from "wagmi";

export const useElectionInformation = ({
  electionAddress,
  address,
}: {
  electionAddress: `0x${string}`;
  address: any;
}) => {
  const electionContract = {
    abi: Election,
    address: electionAddress,
    chainId: sepolia.id,
  };
  const CCIPContract = {
    abi: CCIPSender,
    address: CCIP_FUJI_ADDRESS as `0x${string}`,
    chainId: avalancheFuji.id,
  };
  const { data: electionInformation, isLoading } = useReadContracts({
    contracts: [
      {
        ...electionContract,
        functionName: "owner",
      },
      {
        ...electionContract,
        functionName: "getWinners",
      },
      {
        ...electionContract,
        functionName: "electionInfo",
      },
      {
        ...electionContract,
        functionName: "resultType",
      },
      {
        ...electionContract,
        functionName: "totalVotes",
      },
      {
        ...electionContract,
        functionName: "userVoted",
        args: [address!],
      },
      {
        ...electionContract,
        functionName: "resultsDeclared",
      },
      {
        ...electionContract,
        functionName: "getCandidateList",
      },
      {
        ...electionContract,
        functionName: "electionId",
      },
      {
        ...CCIPContract,
        functionName: "electionApproved",
        args: [electionAddress],
      },
    ],
  });
  return { electionInformation, isLoading };
};
