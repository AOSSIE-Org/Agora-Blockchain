// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Errors} from "./interface/Errors.sol";
import {Candidatecheck} from "./abstract/CandidateCheck.sol";

contract IRVResult is Errors, Candidatecheck {
    function calculateIRVResult(
        bytes memory returnData
    ) public pure returns (uint256[] memory winners) {
        // Decode the returnData to extract the vote arrays
        uint256[][] memory votes = abi.decode(returnData, (uint256[][]));

        // Perform IRV calculation to determine the winner(s)
        winners = performIRV(votes);
    }

    function performIRV(
        uint256[][] memory votes
    ) internal pure returns (uint256[] memory winners) {
        uint256 numCandidates = votes[0].length;

        // Check for no candidates
        if (numCandidates < 2) {
            return checkEdgeCases(numCandidates);
        }

        uint256[] memory remainingCandidates = new uint256[](numCandidates);
        for (uint256 i = 0; i < numCandidates; i++) {
            remainingCandidates[i] = i;
        }

        while (true) {
            // Count the first preferences
            uint256[] memory firstPreferences = countFirstPreferences(
                votes,
                numCandidates
            );

            // If any candidate has a majority, they are the winner
            for (uint256 i = 0; i < firstPreferences.length; i++) {
                if (firstPreferences[i] > votes.length / 2) {
                    winners = new uint256[](1);
                    winners[0] = i;
                    return winners;
                }
            }

            // No winner yet, eliminate the candidate with the fewest first preferences
            uint256 minVotes = votes.length;
            uint256 minCandidate = votes.length;
            bool tie = true;
            for (uint256 i = 0; i < firstPreferences.length; i++) {
                if (firstPreferences[i] < minVotes && firstPreferences[i] > 0) {
                    minVotes = firstPreferences[i];
                    minCandidate = i;
                    tie = false;
                } else if (
                    firstPreferences[i] == minVotes && firstPreferences[i] > 0
                ) {
                    tie = false; // Updated tie condition
                }
            }
            // Check if all remaining candidates are tied
            if (tie) {
                uint256[] memory tiedWinners = new uint256[](numCandidates);
                uint256 count = 0;
                for (uint256 i = 0; i < firstPreferences.length; i++) {
                    if (firstPreferences[i] > 0) {
                        tiedWinners[count] = i;
                        count++;
                    }
                }
                // Return the array with the correct size
                winners = new uint256[](2);
                for (uint256 i = 0; i < count; i++) {
                    winners[i] = tiedWinners[i];
                }
                return winners;
            }

            // Create a new array for the next round of votes without the eliminated candidate
            for (uint256 i = 0; i < votes.length; i++) {
                votes[i] = removeCandidate(votes[i], minCandidate);
            }

            // Check if all votes are exhausted
            bool allVotesExhausted = true;
            for (uint256 i = 0; i < votes.length; i++) {
                if (votes[i].length > 0) {
                    allVotesExhausted = false;
                    break;
                }
            }

            // If all votes are exhausted, return remaining candidates

            if (allVotesExhausted) {
                uint256 remainingCount = 0;
                for (uint256 i = 0; i < remainingCandidates.length; i++) {
                    if (remainingCandidates[i] != votes.length) {
                        remainingCount++;
                    }
                }

                winners = new uint256[](remainingCount);
                uint256 index = 0;
                for (uint256 i = 0; i < remainingCandidates.length; i++) {
                    if (remainingCandidates[i] != votes.length) {
                        winners[index] = remainingCandidates[i];
                        index++;
                    }
                }

                return winners;
            }
        }
    }

    function countFirstPreferences(
        uint256[][] memory votes,
        uint256 numCandidates
    ) internal pure returns (uint256[] memory) {
        // Count the first preferences for each candidate
        uint256[] memory firstPreferences = new uint256[](numCandidates);
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].length > 0) {
                firstPreferences[votes[i][0]]++;
            }
        }
        return firstPreferences;
    }

    function removeCandidate(
        uint256[] memory ballot,
        uint256 candidate
    ) internal pure returns (uint256[] memory) {
        uint256[] memory newBallot = new uint256[](ballot.length - 1);
        uint256 index = 0;
        for (uint256 i = 0; i < ballot.length; i++) {
            if (ballot[i] != candidate) {
                newBallot[index] = ballot[i];
                index++;
            }
        }
        return newBallot;
    }
}
