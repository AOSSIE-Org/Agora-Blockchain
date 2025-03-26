// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./BaseBallot.sol";

contract RankedBallot is BaseBallot {
    uint[] private candidateVotes;

    function _afterInit() internal override {
        candidateVotes = new uint[](totalCandidates);
    }

    function vote(uint[] memory voteArr) external onlyOwner {
        if (voteArr.length != totalCandidates) revert VoteInputLength();

        for (uint i = 0; i < totalCandidates; i++) {
            candidateVotes[voteArr[i]] += totalCandidates - i; // Rank-based weighting
        }
    }

    function getVotes() external view onlyOwner returns (uint256[] memory) {
        return candidateVotes;
    }
}