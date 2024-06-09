// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interface/IBallot.sol";

contract IRV is IBallot {
    error OwnerPermissioned();

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

    function vote(uint[] memory voteArr) external onlyOwner {
        require(
            totalCandidates == voteArr.length,
            "Votes don't match the candidates"
        );

        votes.push(voteArr);
    }

    function getVotes() external view returns (uint256[][] memory) {
        return votes;
    }
}
