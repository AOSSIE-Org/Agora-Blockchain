// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {Errors} from "./interface/Errors.sol";

contract GeneralResult is Errors {
    function calculateGeneralResult(
        bytes calldata returnData
    ) public pure returns (uint[] memory) {
        uint[] memory candidateList = abi.decode(returnData, (uint[]));
        uint candidatesLength = candidateList.length;

        if (candidatesLength == 0) {
            revert NoWinner();
        }
        if (candidatesLength == 1) {
            uint[] memory singleWinner = new uint[](1);
            singleWinner[0] = 0;
            return singleWinner;
        }

        uint maxVotes = 0;
        uint winnerCount = 0;

        // First pass: find the maximum number of votes and the count of candidates with that maximum
        for (uint i = 0; i < candidatesLength; i++) {
            uint votes = candidateList[i];
            if (votes > maxVotes) {
                maxVotes = votes;
                winnerCount = 1;
            } else if (votes == maxVotes) {
                winnerCount++;
            }
        }

        if (maxVotes == 0) {
            revert NoWinner();
        }

        // Second pass: collect all candidates with the maximum number of votes
        uint[] memory winners = new uint[](winnerCount);
        uint numWinners = 0;

        for (uint i = 0; i < candidatesLength; i++) {
            if (candidateList[i] == maxVotes) {
                winners[numWinners] = i;
                numWinners++;
            }
        }

        return winners;
    }
}
