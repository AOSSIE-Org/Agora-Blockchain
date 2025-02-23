// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Errors} from "./interface/Errors.sol";
import {Candidatecheck} from "./abstract/CandidateCheck.sol";
import {WinnersArray} from "./abstract/WinnersArray.sol";

contract SchulzeResult is Errors, Candidatecheck, WinnersArray {
    function calculateSchulzeResult(
        bytes memory returnData
    ) public pure returns (uint256[] memory) {
        uint256[][] memory preferences = abi.decode(returnData, (uint256[][]));
        uint256[] memory winners = performSchulze(preferences);
        return winners;
    }

    function performSchulze(
        uint256[][] memory preferences
    ) internal pure returns (uint256[] memory) {
        uint256 numCandidates = preferences.length;

        if (numCandidates < 2) {
            return checkEdgeCases(numCandidates);
        }

        uint256[][] memory strength = new uint256[][](numCandidates);
        for (uint i = 0; i < numCandidates; i++) {
            strength[i] = new uint256[](numCandidates);
        }

        for (uint i = 0; i < numCandidates; i++) {
            for (uint j = 0; j < numCandidates; j++) {
                if (i != j) {
                    if (preferences[i][j] > preferences[j][i]) {
                        strength[i][j] = preferences[i][j];
                    }
                }
            }
        }

        for (uint i = 0; i < numCandidates; i++) {
            for (uint j = 0; j < numCandidates; j++) {
                if (i != j) {
                    for (uint k = 0; k < numCandidates; k++) {
                        if (i != k && j != k) {
                            if (
                                strength[j][k] < strength[j][i] &&
                                strength[j][k] < strength[i][k]
                            ) {
                                strength[j][k] = strength[j][i] < strength[i][k]
                                    ? strength[j][i]
                                    : strength[i][k];
                            }
                        }
                    }
                }
            }
        }

        uint256 highestScore = 0;
        uint256 winnerCount = 0;
        uint256[] memory scores = new uint256[](numCandidates);

        for (uint i = 0; i < numCandidates; i++) {
            uint256 score = 0;
            for (uint j = 0; j < numCandidates; j++) {
                if (i != j) {
                    if (strength[i][j] > strength[j][i]) {
                        score += 1;
                    }
                }
            }
            scores[i] = score;
            if (score > highestScore) {
                highestScore = score;
                winnerCount = 1;
            } else if (score == highestScore) {
                winnerCount++;
            }
        }

        // Collect all candidates with the highest ranking score
        return getWinnersArray(winnerCount, highestScore, scores);
    }
}
