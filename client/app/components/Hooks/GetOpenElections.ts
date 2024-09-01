import { ElectionFactory } from "@/abi/artifacts/ElectionFactory";
import { ELECTION_FACTORY_ADDRESS } from "@/app/constants";
import { sepolia } from "viem/chains";
import { useReadContract } from "wagmi";

export const useOpenElection = () => {
  const { data: elections, isLoading } = useReadContract({
    chainId: sepolia.id,
    abi: ElectionFactory,
    address: ELECTION_FACTORY_ADDRESS,
    functionName: "getOpenElections",
  });
  return { elections, isLoading };
};
