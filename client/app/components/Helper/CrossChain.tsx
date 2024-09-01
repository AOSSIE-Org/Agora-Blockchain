import { CCIPSender } from "@/abi/artifacts/CCIPSender";
import { CCIP_FUJI_ADDRESS, LINK_FUJI } from "@/app/constants";
import React, { useEffect, useState } from "react";
import { erc20Abi } from "viem";
import { avalancheFuji } from "viem/chains";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
const CrossChain = ({
  electionAddress,
  isEnded,
  isCrossChainEnabled,
}: {
  electionAddress: `0x${string}`;
  isEnded: boolean;
  isCrossChainEnabled: boolean;
}) => {
  const { switchChain } = useSwitchChain();
  const { chain } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [buttonValue, setbuttonValue] = useState(false);
  const addCrossChain = async () => {
    try {
      if (chain?.id !== 43113) switchChain({ chainId: avalancheFuji.id });
      await writeContractAsync({
        address: LINK_FUJI,
        abi: erc20Abi,
        functionName: "approve",
        args: [CCIP_FUJI_ADDRESS, BigInt("25000000000000000000")],
      });
      await writeContractAsync({
        abi: CCIPSender,
        address: CCIP_FUJI_ADDRESS,
        functionName: "addElection",
        args: [electionAddress],
      });
      setbuttonValue(true);
    } catch (error) {
      console.log("Error : ", error);
    }
  };
  useEffect(() => {
    setbuttonValue(isCrossChainEnabled);
  }, [isCrossChainEnabled]);
  return (
    <div className="flex flex-col items-center justify-around gap-y-1 w-[75%] sm:w-[50%] mt-4 border border-gray-200 rounded-lg shadow p-4 ">
      <h5 className="text-lg font-bold my-1 leading-none text-gray-900 ">
        Cross Chain Support
      </h5>
      <div className="inline-flex items-center gap-x-2">
        <p className="text-sm">Enables Voting for users on different chains</p>
        <div className="relative inline-block w-8 bg-red-400 h-4 rounded-full cursor-pointer">
          <input
            id="switch-component"
            type="checkbox"
            checked={buttonValue}
            disabled={buttonValue || isEnded}
            onChange={addCrossChain}
            className="absolute w-8 h-4 transition-colors duration-300 rounded-full appearance-none cursor-pointer peer bg-blue-gray-100 checked:bg-gray-900 peer-checked:border-gray-900 peer-checked:before:bg-gray-900"
          />
          <label
            htmlFor="switch-component"
            className="before:content[''] absolute top-2/4 -left-1 h-5 w-5 -translate-y-2/4 cursor-pointer rounded-full border border-blue-gray-100 bg-white shadow-md transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-full peer-checked:border-gray-900 peer-checked:before:bg-gray-900"
          >
            <div
              className="inline-block p-5 rounded-full top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
              data-ripple-dark="true"
            ></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CrossChain;
