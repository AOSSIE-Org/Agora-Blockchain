// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Election.sol';

contract Candidate {
    struct CandidateInfo {
        uint candidateID;
        string name;
        // uint voteCount;
    }
    CandidateInfo candidateInfo;
    
    // map candidates to elections
    // mapping(CandidateInfo => Election) candidate_election;

    // function addVote() public{
    //     candidateInfo.voteCount++;
    // }

    constructor(CandidateInfo memory _candidateInfo){
        candidateInfo = _candidateInfo;
    }
}