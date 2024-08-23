// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract WinnersArray {
    function getWinnersArray(
        uint winnerCount,
        uint maxVotes,
        uint[] memory candidateList
    ) internal pure returns (uint[] memory) {
        uint[] memory winners = new uint[](winnerCount);
        uint candidatesLength = candidateList.length;
        uint numWinners = 0;

        for (uint i = 0; i < candidatesLength; i++) {
            if (candidateList[i] == maxVotes) {
                winners[numWinners] = i;
                numWinners++;
            }
        }
        return winners;
    }
}
