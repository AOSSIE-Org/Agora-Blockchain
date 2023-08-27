// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import './Ballot.sol';
import '../../Election.sol';

contract IRV is Ballot{
    uint[][] Votes;

    function vote(address _voter, uint _candidate, uint _score,uint[] memory voteArr) override external {
        _voter;
        _candidate;
        _score;
        require(voteStatus[_voter]==false,"Voter already voted");
        Votes.push(voteArr);
        voteStatus[_voter] = true;
    }
    function getVoteCount(uint _candidate, uint _weight) external override pure returns(uint){
        _weight = 1;
        _candidate;
        return uint(1);
    }
    function getVoteArr() external pure override returns(uint[][] memory  ){
        uint [][] memory arr;
        return arr;
    }
}