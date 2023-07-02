// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Ballot.sol';

/*

Voters can vote for 1 or more candidates (even all).
Each vote is a score in a given range - set when the contract is created

*/

contract ScoreBallot is Ballot{

    // ------------------------------------------------------------------------------------------------------
    //                                              STATE
    // ------------------------------------------------------------------------------------------------------
   
    mapping(uint=>uint)scores;
    uint scoreRange;

    mapping (address => mapping (uint => bool))voterCandidateVoteStatus;
    
    mapping (address => uint)voterVoteCount;
    
    // ------------------------------------------------------------------------------------------------------
    //                                           CONSTRUCTOR
    // ------------------------------------------------------------------------------------------------------

    // constructor(uint _scoreRange){
    //     scoreRange = _scoreRange;
    // }

    // ------------------------------------------------------------------------------------------------------
    //                                            FUNCTIONS
    // ------------------------------------------------------------------------------------------------------



    function vote(address _voter, uint _candidate, uint _score,uint[] memory voteArr) override external {
        require(voteStatus[_voter]==false,"Voter already voted");
        require(voterCandidateVoteStatus[_voter][_candidate]==false,"Voter already voted for this candidate");
        require(voterVoteCount[_voter]<candidates.length,"Max votes already casted by voter");
        
        scores[_candidate]+=_score;

        voterVoteCount[_voter]+=1;
        voterCandidateVoteStatus[_voter][_candidate]=true;
        if(voterVoteCount[_voter]==candidates.length) {
            voteStatus[_voter]=true;
        }
    }
    function getVoteCount(uint _candidate, uint _weight)external override view returns(uint){
        _weight = 1;
        return scores[_candidate];
    }
      function getVoteArr() external override returns(uint[][] memory  ){
        uint [][] memory arr;
        return arr;
    }
}