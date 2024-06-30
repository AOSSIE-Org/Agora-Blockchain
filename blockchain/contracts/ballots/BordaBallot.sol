// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interface/IBallot.sol";
import "./interface/Errors.sol";
contract BordaBallot is IBallot, Errors {
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
        votes.push(voteArr);
    }

    function getVotes() external view returns (uint256[][] memory) {
        return votes;
    }
}
