// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import '../Election.sol';
import '../Candidate.sol';

interface VotingSystem {
    function vote(Election,Candidate[] memory) external;
}