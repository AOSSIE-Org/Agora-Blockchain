// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import {Errors} from "./interface/Errors.sol";
contract GeneralResult is Errors {
    function calculateGeneralResult(
        bytes calldata returnData
    ) public pure returns (uint) {
        uint[] memory candidateList = abi.decode(returnData, (uint256[]));
        uint256 maxVotes = 0;
        uint256 winner = candidateList.length;
        for (uint256 i = 0; i < candidateList.length; i++) {
            uint256 votes = candidateList[i];
            if (votes > maxVotes) {
                maxVotes = votes;
                winner = i;
            }
        }
        if (winner == candidateList.length) {
            revert NoWinner();
        }
        return winner;
    }
}
