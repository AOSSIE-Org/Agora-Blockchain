// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./BaseBallot.sol";

contract QuadraticBallot is BaseBallot {
    uint[] private candidateVotes;

    function _afterInit() internal override {
        candidateVotes = new uint[](totalCandidates);
    }

    function vote(uint[] memory voteArr) external onlyOwner {
        if (voteArr.length != totalCandidates) revert VoteInputLength();
        if (!_validateQuadraticCredits(voteArr)) revert IncorrectCredits();

        for (uint i = 0; i < totalCandidates; i++) {
            candidateVotes[i] += voteArr[i];
        }
    }

    function getVotes() external view onlyOwner returns (uint256[] memory) {
        return candidateVotes;
    }

    function _validateQuadraticCredits(
        uint[] memory voteArr
    ) internal pure returns (bool) {
        uint remainingCredits = 100;
        for (uint i = 0; i < voteArr.length; i++) {
            remainingCredits -= voteArr[i];
        }
        return remainingCredits == 0;
    }
}