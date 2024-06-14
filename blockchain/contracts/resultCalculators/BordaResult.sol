// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Errors} from "./interface/Errors.sol";

contract BordaResult is Errors {
    function calculateBordaResult(
        bytes memory returnData
    ) public pure returns (uint256) {
        // Decode the returnData to extract the vote arrays
        uint256[][] memory votes = abi.decode(returnData, (uint256[][]));

        // Perform Borda Count calculation to determine the winner
        uint256 winner = performBordaCount(votes);

        return winner;
    }

    function performBordaCount(
        uint256[][] memory votes
    ) internal pure returns (uint256) {
        uint256 numCandidates = votes[0].length;

        // Check for no candidates
        if (numCandidates == 0) {
            revert NoCandidates();
        }

        // Initialize the scores for each candidate
        uint256[] memory scores = new uint256[](numCandidates);

        // Calculate the Borda scores for each candidate
        for (uint256 i = 0; i < votes.length; i++) {
            for (uint256 j = 0; j < votes[i].length; j++) {
                scores[votes[i][j]] += numCandidates - j - 1;
            }
        }

        // Determine the candidate with the highest score
        uint256 maxScore = 0;
        uint256 winner = 0;
        bool tie = false;
        for (uint256 i = 0; i < scores.length; i++) {
            if (scores[i] > maxScore) {
                maxScore = scores[i];
                winner = i;
                tie = false;
            } else if (scores[i] == maxScore) {
                tie = true;
            }
        }

        if (tie) {
            revert CandidatesTie();
        }

        return winner;
    }
}
