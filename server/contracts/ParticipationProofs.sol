// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IParticipationProofs} from "./interfaces/IParticipationProofs.sol";

contract ParticipationProofs is IParticipationProofs {
    // Mapping to store participation status of voters
    mapping(address => bool) private _hasVoted;

    // Event to log participation proof
    event ProofLogged(address indexed voter, uint256 timestamp);

    function recordProof(
        address voter,
        bytes[] memory proposal,
        uint256 timestamp
    ) external override {
        require(!_hasVoted[voter], "Voter has already participated.");
        _hasVoted[voter] = true;

        emit ProofLogged(voter, timestamp);
    }

    function hasParticipated(
        address voter
    ) external view override returns (bool) {
        return _hasVoted[voter];
    }
}
