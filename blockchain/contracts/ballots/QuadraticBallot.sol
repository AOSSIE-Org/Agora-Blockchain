// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interface/IBallot.sol";

contract QuadraticBallot is IBallot {
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
    // Quadratic voting: voteArr[i] = number of votes for candidate i.
    // Cost = sum of voteArr[i]^2 for all i. Total cost must not exceed 100 credits.
    function vote(uint[] memory voteArr) external onlyOwner {
        uint totalCandidates = candidateVotes.length;
        if (voteArr.length != totalCandidates) revert VoteInputLength();
        if (!checkCreditsQuadratic(voteArr)) revert IncorrectCredits();

        for (uint i = 0; i < totalCandidates; i++) {
            candidateVotes[i] += voteArr[i];
        }
    }

    function getVotes() external view onlyOwner returns (uint256[] memory) {
        return candidateVotes;
    }

    function checkCreditsQuadratic(
        uint[] memory voteArr
    ) internal pure returns (bool) {
        uint totalCredits = 100;
        uint usedCredits = 0;
        for (uint i = 0; i < voteArr.length; i++) {
            // Quadratic cost: N votes costs N^2 credits
            usedCredits += voteArr[i] * voteArr[i];
        }
        return usedCredits <= totalCredits && usedCredits > 0;
    }
}
