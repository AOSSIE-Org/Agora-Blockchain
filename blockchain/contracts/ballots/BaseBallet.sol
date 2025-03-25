// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interface/IBallot.sol";

abstract contract BaseBallot is IBallot {
    address public immutable electionContract;  // Immutable for security
    uint public totalCandidates;

    modifier onlyOwner() {
        if (msg.sender != electionContract) revert OwnerPermissioned();
        _;
    }

    constructor(address _electionAddress) {
        electionContract = _electionAddress;
    }

    function init(uint _totalCandidates) external virtual onlyOwner {
        totalCandidates = _totalCandidates;
        _afterInit();  // Hook for child contracts
    }

    function _afterInit() internal virtual {}
}