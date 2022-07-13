// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Ballot.sol';
import '../Candidate.sol';

/*

Voters can vote for 1 or more candidates (even all).
They can vote

*/

contract ScoreBallot is Ballot{
    mapping(Candidate=>uint)scores;
    function vote(Candidate _candidate, uint score) public override{
        scores[_candidate]+=score;
    }
}