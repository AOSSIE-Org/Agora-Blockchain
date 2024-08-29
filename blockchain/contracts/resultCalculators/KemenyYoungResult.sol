// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Errors} from "./interface/Errors.sol";
import {Candidatecheck} from "./abstract/CandidateCheck.sol";
import {VoteWinnerCount} from "./abstract/VoteWinnerCount.sol";
import {WinnersArray} from "./abstract/WinnersArray.sol";

contract KemenyYoungResult is
    Errors,
    Candidatecheck,
    VoteWinnerCount,
    WinnersArray
{
    function calculateKemenyYoungResult(
        bytes memory returnData
    ) public pure returns (uint256[] memory) {
        // Decode the returnData to extract the vote arrays
        uint256[][] memory votes = abi.decode(returnData, (uint256[][]));

        // Perform Kemeny-Young calculation to determine the winner
        return performKemenyYoung(votes);
    }

    function performKemenyYoung(
        uint256[][] memory votes
    ) internal pure returns (uint256[] memory) {
        uint256 numCandidates = votes.length;

        if (numCandidates < 2) {
            return checkEdgeCases(numCandidates);
        }

        // Compute pairwise scores
        uint256[][] memory pairwiseScores = new uint256[][](numCandidates);
        for (uint i = 0; i < numCandidates; i++) {
            pairwiseScores[i] = new uint256[](numCandidates);
            for (uint j = 0; j < numCandidates; j++) {
                if (i != j) {
                    pairwiseScores[i][j] = votes[i][j] > votes[j][i]
                        ? votes[i][j]
                        : votes[j][i];
                }
            }
        }

        // Find the ranking with the highest Kemeny score
        uint256[] memory bestRanking = new uint256[](numCandidates);
        uint256 bestScore = 0;

        for (uint i = 0; i < numCandidates; i++) {
            uint256[] memory ranking = new uint256[](numCandidates);
            uint256 score = 0;

            for (uint j = 0; j < numCandidates; j++) {
                if (i != j) {
                    if (pairwiseScores[i][j] > pairwiseScores[j][i]) {
                        ranking[i]++;
                        score += pairwiseScores[i][j];
                    }
                }
            }

            if (score > bestScore) {
                bestScore = score;
                bestRanking = ranking;
            }
        }

        uint256 highestRankingScore;
        uint256 winnerCount;

        (highestRankingScore, winnerCount) = getVoteWinnerCount(bestRanking);

        // Collect all candidates with the highest ranking score
        return getWinnersArray(winnerCount, highestRankingScore, bestRanking);
    }
}
