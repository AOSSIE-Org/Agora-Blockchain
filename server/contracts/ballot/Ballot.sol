// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import '../Candidate.sol';
import '../resultCalculator/ResultCalculator.sol';

abstract contract Ballot {
    
    Candidate[] candidates;

    // constructor(Candidate[] memory _candidtates, ResultCalculator _resultCalculator){
    //     candidtates = _candidtates;
    //     resultCalculator = _resultCalculator;
    // }

    function addCandidate(Candidate _candidate)public {
        candidates.push(_candidate);
    }

    function getCandidates()public view returns(Candidate[] memory){
        return candidates;
    }

    function vote(Candidate _candidate, uint weight)public virtual;

    /*
    Here the weight resembles the preference for preferential voting, in which case the function returns 
    the votes of a candidate in a particular preference.

    Else it just returns the vote count or score count.
    */
    function getVoteCount(Candidate _candidate, uint weight)public virtual view returns(uint);

}