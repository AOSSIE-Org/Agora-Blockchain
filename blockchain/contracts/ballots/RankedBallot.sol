// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interface/IBallot.sol";

//  ranked have the same ballot as ...
contract RankedBallot is IBallot {
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

    function vote(uint[] memory voteArr) external onlyOwner {
        uint totalCandidates = candidateVotes.length;
        require(
            voteArr.length == totalCandidates,
            "Votes don't match the candidates"
        );

        require(checkCreditsRanked(voteArr), "Incorrect credits given");

        for (uint i = 0; i < totalCandidates; i++) {
            // voteArr[i] is the candidate ID, i is the rank (0-based)
            candidateVotes[voteArr[i]] += totalCandidates - i - 1;
        }
    }

    function getVotes() external view onlyOwner returns (uint256[] memory) {
        return candidateVotes;
    }

    function checkCreditsRanked(
        uint[] memory voteArr
    ) internal view returns (bool) {
        uint _candidates = candidateVotes.length;
        uint totalCredits = (_candidates * (_candidates + 1)) / 2 - _candidates;
        for (uint i = 0; i < voteArr.length; i++) {
            totalCredits = totalCredits - voteArr[i];
        }
        return totalCredits == 0;
    }
}
