// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Election.sol';
import './Candidate.sol';

contract Voter{
    struct VoterInfo {
        uint voterID;
        bool voterAuth;
    }
    
    mapping (Election => Candidate[]) electionVotes;
    mapping (Election => bool) voteStatus;
    
    VoterInfo voterInfo;


    constructor(VoterInfo memory _voterInfo){
        voterInfo=_voterInfo;
    }
    // function addElectionVote(Election,Candidate)public virtual;
    // function castVote(Election)public virtual;
    // function isAuthenticated()public virtual;
}