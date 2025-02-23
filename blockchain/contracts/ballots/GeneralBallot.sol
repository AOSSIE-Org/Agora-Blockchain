// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interface/IBallot.sol";

contract GeneralBallot is IBallot {
    error InvalidVoteArrayLength();
    error InvalidVoteDistribution();

    address public electionContract;

    uint private totalCandidate;
    uint[] private candidateVotes;

    modifier onlyOwner() {
        if (msg.sender != electionContract) revert OwnerPermissioned();
        _;
    }

    constructor(address _electionAddress) {
        electionContract = _electionAddress;
    }

    function init(uint _totalCandidate) external onlyOwner {
        totalCandidate = _totalCandidate;
        candidateVotes = new uint[](_totalCandidate);
    }

    //just a sigle vote in arr [1]
    function vote(uint256[] memory _votes) external onlyOwner {
        if (_votes.length != 1) revert InvalidVoteArrayLength();
        checkValidVotes(_votes[0]);
        candidateVotes[_votes[0]]++;
    }

    function getVotes() external view onlyOwner returns (uint256[] memory) {
        return candidateVotes;
    }

    function checkValidVotes(uint256 _vote) internal view {
        if (_vote >= totalCandidate) revert InvalidVoteDistribution();
    }
}
