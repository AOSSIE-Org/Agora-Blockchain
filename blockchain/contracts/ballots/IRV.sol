// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./BaseBallot.sol";  // Changed from IBallot to BaseBallot

contract IRV is BaseBallot {
    uint[][] private votes;

    // Constructor removed - inherited from BaseBallot
    // init() removed - handled by BaseBallot

    function vote(uint[] memory voteArr) external onlyOwner {
        if (totalCandidates != voteArr.length) revert VoteInputLength();
        votes.push(voteArr);
    }

    function getVotes() external view onlyOwner returns (uint256[][] memory) {
        return votes;
    }
}