// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./BaseBallot.sol";

contract SchulzeBallot is BaseBallot {
    uint[][] private preferences;

    function _afterInit() internal override {
        preferences = new uint[][](totalCandidates);
        for (uint i = 0; i < totalCandidates; i++) {
            preferences[i] = new uint[](totalCandidates);
        }
    }

    function vote(uint[] memory voteArr) external onlyOwner {
        if (voteArr.length != totalCandidates) revert VoteInputLength();
        
        for (uint i = 0; i < totalCandidates; i++) {
            for (uint j = i + 1; j < totalCandidates; j++) {
                preferences[voteArr[i]][voteArr[j]] += 1;
            }
        }
    }

    function getVotes() external view onlyOwner returns (uint[][] memory) {
        return preferences;
    }
}