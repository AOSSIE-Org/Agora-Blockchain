// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Ballot.sol';
import '../../Election.sol';

contract KemenyYoung is Ballot {

    // ------------------------------------------------------------------------------------------------------
    //                                              STATE
    // ------------------------------------------------------------------------------------------------------
    
    uint[][] Votes;

    // ------------------------------------------------------------------------------------------------------
    //                                            FUNCTIONS
    // ------------------------------------------------------------------------------------------------------

    function vote(address _voter, uint _candidate, uint _weight, uint[] memory voteArr) external override {
        require(voteStatus[_voter] == false, "Voter already voted");
        _candidate;
        uint len = voteArr.length;
        if(Votes.length == 0){
            for(uint i=0; i<len; i++){
                uint[] memory arr = new uint[](len);
                Votes.push(arr);
            }
        }
        for(uint i=0; i<len; i++){
            for(uint j=i+1; j<len; j++){
                Votes[voteArr[i]][voteArr[j]] += _weight;
            }
        }
        voteStatus[_voter] = true;
    }  

    function getVoteCount(uint _candidate, uint _weight) external override pure returns(uint){
        _weight;
        _candidate;
        return uint(1);
    }

    function getVoteArr() external view override returns(uint[][] memory){
        return Votes;
    }    
}