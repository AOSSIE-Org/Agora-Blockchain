// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {Errors} from "./interface/Errors.sol";
import {Candidatecheck} from "./abstract/CandidateCheck.sol";
import {WinnersArray} from "./abstract/WinnersArray.sol";

contract MooreResult is Errors, Candidatecheck, WinnersArray {
    function calculateMooreResult(
        bytes calldata returnData
    ) public pure returns (uint[] memory) {
        uint[] memory candidateList = abi.decode(returnData, (uint[]));
        uint candidatesLength = candidateList.length;

        if (candidatesLength < 2) {
            return checkEdgeCases(candidatesLength);
        }

        uint maxVotes = 0;
        uint winnerCount = 0;
        uint[] memory winners;
        for (uint i = 0; i < candidatesLength; i++) {
            uint votes = candidateList[i];
            if (votes > candidatesLength / 2) {
                winners = new uint[](1);
                winners[0] = i;
                return winners;
            } else if (votes > maxVotes) {
                maxVotes = votes;
                winnerCount = 1;
            } else if (votes == maxVotes) {
                winnerCount++;
            }
        }

        return getWinnersArray(winnerCount, maxVotes, candidateList);
    }
}
