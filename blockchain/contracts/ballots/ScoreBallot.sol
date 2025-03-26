// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./BaseBallot.sol";

contract ScoreBallot is BaseBallot {
    error InvalidScore(uint score);
    
    uint[] private candidateScores;
    uint public constant maxScore = 10;

    function _afterInit() internal override {
        candidateScores = new uint[](totalCandidates);
    }

    function vote(uint[] memory voteArr) external onlyOwner {
        if (voteArr.length != totalCandidates) revert VoteInputLength();

        for (uint i = 0; i < totalCandidates; i++) {
            uint score = voteArr[i];
            if (score > maxScore) revert InvalidScore(score);
            candidateScores[i] += score;
        }
    }

    function getVotes() external view onlyOwner returns (uint256[] memory) {
        return candidateScores;
    }
}