// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./BaseBallot.sol";  // Changed from IBallot to BaseBallot

contract GeneralBallot is BaseBallot {
    error InvalidVoteArrayLength();
    error InvalidVoteDistribution();

    uint[] private candidateVotes;

    // Constructor removed - now inherited from BaseBallot

    function _afterInit() internal override {
        candidateVotes = new uint[](totalCandidates);  // Uses totalCandidates from BaseBallot
    }

    function vote(uint256[] memory _votes) external onlyOwner {
        if (_votes.length != 1) revert InvalidVoteArrayLength();
        _validateVote(_votes[0]);
        candidateVotes[_votes[0]]++;
    }

    function getVotes() external view onlyOwner returns (uint256[] memory) {
        return candidateVotes;
    }

    function _validateVote(uint256 _vote) internal view {
        if (_vote >= totalCandidates) revert InvalidVoteDistribution();
    }
}