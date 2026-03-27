import { ElectionFactory } from "@/abi/artifacts/ElectionFactory";
import { Election } from "@/abi/artifacts/Election";
import { ELECTION_FACTORY_ADDRESS } from "@/app/constants";
import { sepolia } from "viem/chains";
import { useAccount, useReadContract, useReadContracts } from "wagmi";

export const useUserElections = () => {
  const { address } = useAccount();

  // Fetch all open elections first
  const { data: allElections, isLoading: loadingElections } = useReadContract({
    chainId: sepolia.id,
    abi: ElectionFactory,
    address: ELECTION_FACTORY_ADDRESS,
    functionName: "getOpenElections",
  });

  // Read the owner of each election
  const ownerCalls = (allElections ?? []).map((electionAddr) => ({
    chainId: sepolia.id,
    abi: Election,
    address: electionAddr as `0x${string}`,
    functionName: "owner" as const,
  }));

  const { data: owners, isLoading: loadingOwners } = useReadContracts({
    contracts: ownerCalls,
  });

  // Filter elections where the connected user is the owner
  const elections =
    allElections && owners && address
      ? allElections.filter(
          (_: any, i: number) =>
            owners[i]?.result &&
            (owners[i].result as string).toLowerCase() === address.toLowerCase()
        )
      : undefined;

  const isLoading = loadingElections || loadingOwners;

  return { elections, isLoading };
};
