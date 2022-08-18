// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import '../Election.sol';
import '../resultCalculator/ResultCalculator.sol';

abstract contract Ballot {
    
    uint[] candidates;

    mapping(address=>bool)voteStatus;

    function addCandidate(uint _candidate)public {
        candidates.push(_candidate);
    }

    function getCandidates()public view returns(uint[] memory){
        return candidates;
    }

    function getVoteStatus(address _voter) public view returns(bool) {
        return voteStatus[_voter];
    }

    function vote(address _voter, uint _candidate, uint _weight)public virtual;
    
    /*
    Here the weight resembles the preference for preferential voting, in which case the function returns 
    the votes of a candidate in a particular preference.

    Else it just returns the vote count or score count.
    */
    function getVoteCount(uint _candidate, uint _weight)public virtual view returns(uint);

}