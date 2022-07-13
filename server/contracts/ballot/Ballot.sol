// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import '../Candidate.sol';

abstract contract Ballot {
    Candidate[] candidtates;
    // mapping(Candidate=>uint)votes;

    function getCandidates()public view returns(Candidate[] memory){
        return candidtates;
    }

    function vote(Candidate _candidate, uint weight)public virtual;
}