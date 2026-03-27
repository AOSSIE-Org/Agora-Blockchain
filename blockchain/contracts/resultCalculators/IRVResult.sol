// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Errors} from "./interface/Errors.sol";
import {Candidatecheck} from "./abstract/CandidateCheck.sol";

contract IRVResult is Errors, Candidatecheck {
    function calculateIRVResult(
        bytes memory returnData
    ) public pure returns (uint256[] memory winners) {
        uint256[][] memory votes = abi.decode(returnData, (uint256[][]));
        winners = performIRV(votes);
    }

    function performIRV(
        uint256[][] memory votes
    ) internal pure returns (uint256[] memory winners) {
        // Guard against empty votes array
        if (votes.length == 0) {
            revert NoWinner();
        }

        uint256 numCandidates = votes[0].length;

        if (numCandidates < 2) {
            return checkEdgeCases(numCandidates);
        }

        // Cap iterations to numCandidates to prevent unbounded loop
        for (uint256 round = 0; round < numCandidates; round++) {
            // Count active (non-exhausted) ballots
            uint256 activeBallots = 0;
            for (uint256 i = 0; i < votes.length; i++) {
                if (votes[i].length > 0) {
                    activeBallots++;
                }
            }

            if (activeBallots == 0) {
                revert NoWinner();
            }

            // Count first preferences
            uint256[] memory firstPreferences = countFirstPreferences(
                votes,
                numCandidates
            );

            // Check if any candidate has a majority of active ballots
            for (uint256 i = 0; i < firstPreferences.length; i++) {
                if (firstPreferences[i] > activeBallots / 2) {
                    winners = new uint256[](1);
                    winners[0] = i;
                    return winners;
                }
            }

            // Find the minimum non-zero vote count
            uint256 minVotes = activeBallots + 1;
            for (uint256 i = 0; i < firstPreferences.length; i++) {
                if (firstPreferences[i] > 0 && firstPreferences[i] < minVotes) {
                    minVotes = firstPreferences[i];
                }
            }

            // Count how many candidates have votes, and how many are tied at min
            uint256 candidatesWithVotes = 0;
            uint256 candidatesAtMin = 0;
            for (uint256 i = 0; i < firstPreferences.length; i++) {
                if (firstPreferences[i] > 0) {
                    candidatesWithVotes++;
                    if (firstPreferences[i] == minVotes) {
                        candidatesAtMin++;
                    }
                }
            }

            // If all remaining candidates have equal votes, they are all tied winners
            if (candidatesAtMin == candidatesWithVotes) {
                winners = new uint256[](candidatesWithVotes);
                uint256 idx = 0;
                for (uint256 i = 0; i < firstPreferences.length; i++) {
                    if (firstPreferences[i] > 0) {
                        winners[idx] = i;
                        idx++;
                    }
                }
                return winners;
            }

            // Eliminate the candidate with fewest first preferences
            // (if multiple tied at min, eliminate the first one found)
            uint256 minCandidate = numCandidates;
            for (uint256 i = 0; i < firstPreferences.length; i++) {
                if (firstPreferences[i] == minVotes) {
                    minCandidate = i;
                    break;
                }
            }

            // Remove the eliminated candidate from all ballots
            for (uint256 i = 0; i < votes.length; i++) {
                votes[i] = removeCandidate(votes[i], minCandidate);
            }
        }

        // Fallback: should not reach here, but return remaining candidates
        revert NoWinner();
    }

    function countFirstPreferences(
        uint256[][] memory votes,
        uint256 numCandidates
    ) internal pure returns (uint256[] memory) {
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
        // First count how many times candidate appears
        uint256 removeCount = 0;
        for (uint256 i = 0; i < ballot.length; i++) {
            if (ballot[i] == candidate) {
                removeCount++;
            }
        }
        // If candidate not in ballot, return as-is
        if (removeCount == 0) {
            return ballot;
        }
        uint256[] memory newBallot = new uint256[](ballot.length - removeCount);
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
