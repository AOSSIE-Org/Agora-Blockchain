// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interface/IBallot.sol";

contract SchulzeBallot is IBallot {
    address public electionContract;
    uint[][] private preferences;

    modifier onlyOwner() {
        if (msg.sender != electionContract) revert OwnerPermissioned();
        _;
    }

    constructor(address _electionAddress) {
        electionContract = _electionAddress;
    }

    function init(uint totalCandidates) external onlyOwner {
        preferences = new uint[][](totalCandidates);
        for (uint i = 0; i < totalCandidates; i++) {
            preferences[i] = new uint[](totalCandidates);
        }
    }

    function vote(uint[] memory voteArr) external onlyOwner {
        uint totalCandidates = preferences.length;
        if (voteArr.length != totalCandidates) revert VoteInputLength();
        _validatePermutation(voteArr, totalCandidates);
        for (uint i = 0; i < totalCandidates; i++) {
            for (uint j = i + 1; j < totalCandidates; j++) {
                preferences[voteArr[i]][voteArr[j]] += 1;
            }
        }
    }

    function getVotes() external view onlyOwner returns (uint[][] memory) {
        return preferences;
    }

    function _validatePermutation(uint[] memory arr, uint n) internal pure {
        bool[] memory seen = new bool[](n);
        for (uint i = 0; i < n; i++) {
            if (arr[i] >= n) revert InvalidVotePermutation();
            if (seen[arr[i]]) revert InvalidVotePermutation();
            seen[arr[i]] = true;
        }
    }
}
