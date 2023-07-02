// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import '../Election.sol';
import '../resultCalculator/ResultCalculator.sol';

abstract contract Ballot {

    // ------------------------------------------------------------------------------------------------------
    //                                              STATE
    // ------------------------------------------------------------------------------------------------------
    uint[] candidates;

    mapping(address=>bool)voteStatus;

    // ------------------------------------------------------------------------------------------------------
    //                                            FUNCTIONS
    // ------------------------------------------------------------------------------------------------------

    function addCandidate(uint _candidate)external {
        candidates.push(_candidate);
    }

    function getCandidates()external view returns(uint[] memory){
        return candidates;
    }

    function getVoteStatus(address _voter) external view returns(bool) {
        return voteStatus[_voter];
    }

    function vote(address _voter, uint _candidate, uint _weight,uint[] memory voteArr)external virtual;
    
    /*
    Here the weight resembles the preference for preferential voting, in which case the function returns 
    the votes of a candidate in a particular preference.

    Else it just returns the vote count or score count.
    */
    function getVoteCount(uint _candidate, uint _weight)external virtual view returns(uint);
    function getVoteArr() external virtual  returns(uint [][] memory votes);

}