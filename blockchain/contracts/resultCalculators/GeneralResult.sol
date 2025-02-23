// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {Errors} from "./interface/Errors.sol";
import {Candidatecheck} from "./abstract/CandidateCheck.sol";
import {VoteWinnerCount} from "./abstract/VoteWinnerCount.sol";
import {WinnersArray} from "./abstract/WinnersArray.sol";

contract GeneralResult is
    Errors,
    Candidatecheck,
    VoteWinnerCount,
    WinnersArray
{
    function calculateGeneralResult(
        bytes calldata returnData
    ) public pure returns (uint[] memory) {
        uint[] memory candidateList = abi.decode(returnData, (uint[]));
        uint candidatesLength = candidateList.length;

        if (candidatesLength < 2) {
            return checkEdgeCases(candidatesLength);
        }

        uint maxVotes = 0;
        uint winnerCount = 0;

        (maxVotes, winnerCount) = getVoteWinnerCount(candidateList);

        if (maxVotes == 0) {
            revert NoWinner();
        }

        // Second pass: collect all candidates with the maximum number of votes
        return getWinnersArray(winnerCount, maxVotes, candidateList);
    }
}
