// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract VoteWinnerCount {
    function getVoteWinnerCount(
        uint[] memory candidateList
    ) internal pure returns (uint, uint) {
        uint maxVotes = 0;
        uint winnerCount = 0;
        uint candidatesLength = candidateList.length;
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
        return (maxVotes, winnerCount);
    }
}
