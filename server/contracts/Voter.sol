// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Election.sol';
import './Candidate.sol';

contract Voter{
    
    struct VoterInfo {
        uint voterID;
        bool voterAuth;
    }
    
    mapping (Election => bool) voteStatus;
    
    VoterInfo public voterInfo;


    constructor(VoterInfo memory _voterInfo){
        voterInfo=_voterInfo;
    }

    function castVote(Election election,Candidate candidate, uint weight)public{
        election.vote(candidate, weight);
    }

}