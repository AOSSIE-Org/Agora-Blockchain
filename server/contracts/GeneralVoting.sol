// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './VotingSystem.sol';
import './Election.sol';
contract GeneralVoting is VotingSystem{
    
    function vote(Election election,Candidate[] memory candidates)public{
        // election.voteCount[candidates[0]]++;
        election.addVote(candidates[0]);
    }

}