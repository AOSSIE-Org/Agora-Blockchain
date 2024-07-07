// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interface/IBallot.sol";
import "./interface/Errors.sol";
//  ranked have the same ballot as ...
contract RankedBallot is IBallot, Errors {
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

        for (uint i = 0; i < totalCandidates; i++) {
            // voteArr[i] is the candidate ID, i is the rank (0-based)
            candidateVotes[voteArr[i]] += totalCandidates - i - 1;
        }
    }

    function getVotes() external view onlyOwner returns (uint256[] memory) {
        return candidateVotes;
    }
}
