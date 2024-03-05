// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IParticipationProofs {
    function recordProof(
        address voter,
        bytes[] memory proposal,
        uint256 timestamp
    ) external;

    function hasParticipated(address voter) external view returns (bool);
}
