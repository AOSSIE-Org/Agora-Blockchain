// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Errors} from "./interface/Errors.sol";

contract SchulzeResult is Errors {
    function calculateSchulzeResult(
        bytes memory returnData
    ) public pure returns (uint256) {
        uint256[][] memory preferences = abi.decode(returnData, (uint256[][]));
        uint256 winner = performSchulze(preferences);
        return winner;
    }

    function performSchulze(
        uint256[][] memory preferences
    ) internal pure returns (uint256) {
        uint256 numCandidates = preferences.length;
        if (numCandidates == 0) {
            revert NoCandidates();
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
        uint256 winner;
        bool tie = false;

        for (uint i = 0; i < numCandidates; i++) {
            uint256 score = 0;
            for (uint j = 0; j < numCandidates; j++) {
                if (i != j) {
                    if (strength[i][j] > strength[j][i]) {
                        score += 1;
                    }
                }
            }
            if (score > highestScore) {
                highestScore = score;
                winner = i;
                tie = false;
            } else if (score == highestScore) {
                tie = true;
            }
        }

        if (tie) {
            revert CandidatesTie();
        }

        return winner;
    }
}
