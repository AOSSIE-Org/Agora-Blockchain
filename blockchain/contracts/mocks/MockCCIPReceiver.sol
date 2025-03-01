// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {ElectionFactory} from "../ElectionFactory.sol";
import "hardhat/console.sol";

contract MockCCIPReceiver {
    ElectionFactory private electionFactory;

    constructor(address _electionFactory) {
        electionFactory = ElectionFactory(_electionFactory);
    }

    function mockCcipReceive(
        bytes32 messageId,
        uint64 sourceChainSelector,
        address sender,
        address election,
        address user,
        uint[] calldata voteArr
    ) external {
        // Debug
        console.log("Sender address being used:", sender);
        console.log("Chain selector:", sourceChainSelector);
        console.log("Election address:", election);
        console.log("User address:", user);
        console.log("Vote array length:", voteArr.length);
        // Create a struct for the vote
        ElectionFactory.CCIPVote memory vote = ElectionFactory.CCIPVote({
            election: election,
            user: user,
            voteArr: voteArr
        });

        // Create the CCIP message
        Client.Any2EVMMessage memory message = Client.Any2EVMMessage({
            messageId: messageId,
            sourceChainSelector: sourceChainSelector,
            sender: abi.encode(sender),
            data: abi.encode(vote),
            destTokenAmounts: new Client.EVMTokenAmount[](0)
        });

        console.log(
            "Sender encoded in message:",
            abi.decode(message.sender, (address))
        );

        // Get the function selector for _ccipReceive
        bytes4 selector = bytes4(
            keccak256(
                "_ccipReceive((bytes32,uint64,bytes,bytes,(address,uint256,bytes)[]))"
            )
        );
        bytes memory callData = abi.encodeWithSelector(selector, message);

        (bool success, bytes memory returnData) = address(electionFactory).call(
            callData
        );

        if (!success) {
            // If the call failed, revert with the same reason if available
            if (returnData.length > 0) {
                assembly {
                    let ptr := add(returnData, 0x20)
                    revert(ptr, mload(returnData))
                }
            } else {
                revert("Call to _ccipReceive failed");
            }
        }
    }
}
