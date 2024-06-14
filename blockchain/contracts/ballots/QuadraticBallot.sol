// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interface/IBallot.sol";

contract QuadraticBallot is IBallot {
    error OwnerPermissioned();

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
        require(
            voteArr.length == totalCandidates,
            "Votes don't match the candidates"
        );

        require(checkCreditsQuadratic(voteArr), "Incorrect credits given");

        for (uint i = 0; i < totalCandidates; i++) {
            // voteArr[i] is the credits alloted per candidate
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
        for (uint i = 0; i < voteArr.length; i++) {
            totalCredits = totalCredits - voteArr[i];
        }
        return totalCredits == 0;
    }
}
