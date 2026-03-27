// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interface/IBallot.sol";

contract IRV is IBallot {
    address public electionContract;

    uint private totalCandidates;
    uint[][] private votes;

    modifier onlyOwner() {
        if (msg.sender != electionContract) revert OwnerPermissioned();
        _;
    }

    constructor(address _electionAddress) {
        electionContract = _electionAddress;
    }

    function init(uint _totalCandidates) external onlyOwner {
        totalCandidates = _totalCandidates;
    }

    // voting as preference candidate
    function vote(uint[] memory voteArr) external onlyOwner {
        if (totalCandidates != voteArr.length) revert VoteInputLength();
        _validatePermutation(voteArr, totalCandidates);
        votes.push(voteArr);
    }

    function getVotes() external view onlyOwner returns (uint256[][] memory) {
        return votes;
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
