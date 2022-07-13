// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Ballot.sol';
import '../Candidate.sol';

contract GeneralBallot is Ballot {

    mapping(Candidate=>uint)votes;
    function vote(Candidate _candidate, uint weight)public override{
        weight = 1;
        votes[_candidate]+=1;
    }
    
}