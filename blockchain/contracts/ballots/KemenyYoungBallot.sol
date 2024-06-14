// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interface/IBallot.sol";

contract KemenyYoungBallot is IBallot {
    error OwnerPermissioned();
    address public electionContract;

    uint[][] private votes;

    modifier onlyOwner() {
        if (msg.sender != electionContract) revert OwnerPermissioned();
        _;
    }

    constructor(address _electionAddress) {
        electionContract = _electionAddress;
    }

    function init(uint totalCandidates) external onlyOwner {
        // Initialize the votes array for the number of candidates
        votes = new uint[][](totalCandidates);
        for (uint i = 0; i < totalCandidates; i++) {
            votes[i] = new uint[](totalCandidates);
        }
    }

    function vote(uint[] memory voteArr) external onlyOwner {
        uint totalCandidates = votes.length;
        require(
            voteArr.length == totalCandidates,
            "Votes don't match the candidates"
        );

        // Store the ranking for this voter
        for (uint i = 0; i < totalCandidates; i++) {
            for (uint j = i + 1; j < totalCandidates; j++) {
                if (voteArr[i] < voteArr[j]) {
                    votes[voteArr[i]][voteArr[j]] += 1;
                } else {
                    votes[voteArr[j]][voteArr[i]] += 1;
                }
            }
        }
    }

    function getVotes() external view onlyOwner returns (uint256[][] memory) {
        return votes;
    }
}
