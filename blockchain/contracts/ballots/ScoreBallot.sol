// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interface/IBallot.sol";

contract ScoreBallot is IBallot {
    error OwnerPermissioned();
    error InvalidScore(uint score);
    address public electionContract;

    uint[] private candidateScores;
    uint public constant maxScore = 10;

    modifier onlyOwner() {
        if (msg.sender != electionContract) revert OwnerPermissioned();
        _;
    }

    constructor(address _electionAddress) {
        electionContract = _electionAddress;
    }

    function init(uint totalCandidate) external onlyOwner {
        candidateScores = new uint[](totalCandidate);
    }

    // Assign scores on index
    function vote(uint[] memory voteArr) external onlyOwner {
        uint totalCandidates = candidateScores.length;
        require(
            voteArr.length == totalCandidates,
            "Votes don't match the candidates"
        );

        for (uint i = 0; i < totalCandidates; i++) {
            uint preference = voteArr[i];
            if (preference > maxScore) {
                revert InvalidScore(preference);
            }
            candidateScores[i] += preference;
        }
    }

    function getVotes() external view onlyOwner returns (uint256[] memory) {
        return candidateScores;
    }
}
