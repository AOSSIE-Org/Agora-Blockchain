// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interface/IBallot.sol";

contract RankedBallot is IBallot {
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

    // voting as preference candidate
    function vote(uint[] memory voteArr) external onlyOwner {
        uint totalCandidates = candidateVotes.length;
        if (voteArr.length != totalCandidates) revert VoteInputLength();
        _validatePermutation(voteArr, totalCandidates);

        for (uint i = 0; i < totalCandidates; i++) {
            // voteArr[i] is the candidate ID, i is the rank (0-based)
            candidateVotes[voteArr[i]] += totalCandidates - i;
        }
    }

    function getVotes() external view onlyOwner returns (uint256[] memory) {
        return candidateVotes;
    }

    // Validates that voteArr is a valid permutation of [0, n-1]
    function _validatePermutation(uint[] memory arr, uint n) internal pure {
        bool[] memory seen = new bool[](n);
        for (uint i = 0; i < n; i++) {
            if (arr[i] >= n) revert InvalidVotePermutation();
            if (seen[arr[i]]) revert InvalidVotePermutation();
            seen[arr[i]] = true;
        }
    }
}
