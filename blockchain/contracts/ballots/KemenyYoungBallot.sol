// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./BaseBallot.sol";

contract KemenyYoungBallot is BaseBallot {
    uint[][] private votes;

    function _afterInit() internal override {
        votes = new uint[][](totalCandidates);
        for (uint i = 0; i < totalCandidates; i++) {
            votes[i] = new uint[](totalCandidates);
        }
    }

    function vote(uint[] memory voteArr) external onlyOwner {
        if (voteArr.length != totalCandidates) revert VoteInputLength();

        for (uint i = 0; i < totalCandidates; i++) {
            for (uint j = i + 1; j < totalCandidates; j++) {
                votes[voteArr[i]][voteArr[j]] += 1;
            }
        }
    }

    function getVotes() external view onlyOwner returns (uint256[][] memory) {
        return votes;
    }
}