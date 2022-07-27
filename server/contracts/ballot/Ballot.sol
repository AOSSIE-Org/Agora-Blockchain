// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import '../Candidate.sol';
import '../resultCalculator/ResultCalculator.sol';

abstract contract Ballot {
    
    Candidate[] candidates;

    function addCandidate(Candidate _candidate)public {
        candidates.push(_candidate);
    }

    function getCandidates()public view returns(Candidate[] memory){
        return candidates;
    }

    function vote(Candidate _candidate, uint _weight)public virtual;

    /*
    Here the weight resembles the preference for preferential voting, in which case the function returns 
    the votes of a candidate in a particular preference.

    Else it just returns the vote count or score count.
    */
    function getVoteCount(Candidate _candidate, uint _weight)public virtual view returns(uint);

}