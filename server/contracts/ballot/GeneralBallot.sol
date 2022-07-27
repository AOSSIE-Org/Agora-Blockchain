// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Ballot.sol';
import '../Candidate.sol';

contract GeneralBallot is Ballot {

    mapping(Candidate=>uint) public votes;

    function vote(Candidate _candidate, uint _weight)public override{
        _weight = 1;
        votes[_candidate]+=1;
    }    

    function getVoteCount(Candidate _candidate, uint _weight)public override view returns(uint){
        _weight = 1; 
        return votes[_candidate];
    }
    
}