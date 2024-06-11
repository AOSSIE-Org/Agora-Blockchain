// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interface/IBallot.sol";

contract GeneralBallot is IBallot {
    error OwnerPermissioned();
    error InvalidVoteArrayLength();
    error InvalidVoteDistribution();

    address public electionContract;

    uint[] private candidateVotes;

    modifier onlyOwner() {
        if (msg.sender != electionContract) revert OwnerPermissioned();
        _;
    }

    constructor(address _electionAddress) {
        electionContract = _electionAddress;
    }

    function init(uint totalCandidate) external onlyOwner {
        candidateVotes = new uint[](totalCandidate);
    }

    function vote(uint256[] memory _votes) external onlyOwner {
        if (_votes.length != candidateVotes.length)
            revert InvalidVoteArrayLength();

        uint votedIndex = checkValidVotes(_votes);
        candidateVotes[votedIndex]++;
    }

    function getVotes() external view onlyOwner returns (uint256[] memory) {
        return candidateVotes;
    }

    function checkValidVotes(
        uint256[] memory _votes
    ) internal pure returns (uint) {
        for (uint i = 0; i < _votes.length; i++) {
            // return first non-negative index
            if (_votes[i] > 0) return i;
        }

        revert InvalidVoteDistribution();
    }
}
