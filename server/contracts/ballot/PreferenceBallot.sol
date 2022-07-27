// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Ballot.sol';
import '../Candidate.sol';

contract PreferenceBallot is Ballot{
    mapping (uint=> mapping (Candidate => uint)) votes;
    
    function vote(Candidate _candidate, uint _preference) public override{
        votes[_preference][_candidate]+=1;
    }
    
    function getVoteCount(Candidate _candidate, uint _weight) public override view returns(uint){
        return votes[_weight][_candidate];
    }
}