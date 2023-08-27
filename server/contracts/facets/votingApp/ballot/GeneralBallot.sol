// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Ballot.sol';
import '../../Election.sol';

contract GeneralBallot is Ballot {

    // ------------------------------------------------------------------------------------------------------
    //                                              STATE
    // ------------------------------------------------------------------------------------------------------

    // candidateID => vote count
    mapping(uint=>uint) public votes;

    // ------------------------------------------------------------------------------------------------------
    //                                            FUNCTIONS
    // ------------------------------------------------------------------------------------------------------

    function vote(address _voter, uint _candidate, uint _weight,uint[] memory voteArr)external override{
        _weight = 1;
        require(voteStatus[_voter]==false,"Voter already voted");
        votes[_candidate]+=1;
        voteStatus[_voter] = true;
    }    

    function getVoteCount(uint _candidate, uint _weight)external override view returns(uint){
        _weight = 1; 
        return votes[_candidate];
    }
  
       function getVoteArr() external override returns(uint[][] memory  ){
        uint [][] memory arr;
        return arr;
    }
    
}