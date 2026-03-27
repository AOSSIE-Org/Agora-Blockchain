// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Errors} from "./interface/Errors.sol";
import {Candidatecheck} from "./abstract/CandidateCheck.sol";
import {VoteWinnerCount} from "./abstract/VoteWinnerCount.sol";
import {WinnersArray} from "./abstract/WinnersArray.sol";

contract CopelandResult is
    Errors,
    Candidatecheck,
    VoteWinnerCount,
    WinnersArray
{
    function calculateCopelandResult(
        bytes memory returnData
    ) public pure returns (uint256[] memory) {
        uint256[][] memory votes = abi.decode(returnData, (uint256[][]));
        return performCopeland(votes);
    }

    // Uses Copeland pairwise comparison method as an on-chain feasible
    // approximation of Kemeny-Young (true K-Y requires O(n!) permutation search).
    // Each candidate scores +1 for each pairwise contest they win.
    // The candidate(s) with the most pairwise wins is declared winner.
    function performCopeland(
        uint256[][] memory votes
    ) internal pure returns (uint256[] memory) {
        uint256 numCandidates = votes.length;

        if (numCandidates < 2) {
            return checkEdgeCases(numCandidates);
        }

        // Compute Copeland scores: for each pair (i, j), candidate i gets
        // a point if more voters prefer i over j than j over i.
        uint256[] memory scores = new uint256[](numCandidates);
        for (uint i = 0; i < numCandidates; i++) {
            for (uint j = 0; j < numCandidates; j++) {
                if (i != j) {
                    if (votes[i][j] > votes[j][i]) {
                        scores[i]++;
                    }
                }
            }
        }

        uint256 highestScore;
        uint256 winnerCount;

        (highestScore, winnerCount) = getVoteWinnerCount(scores);

        return getWinnersArray(winnerCount, highestScore, scores);
    }
}
