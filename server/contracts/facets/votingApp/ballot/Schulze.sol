// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;
import "./Ballot.sol";
import "../../Election.sol";

contract SchulzeBallot is Ballot {
    uint[][] votes;

    function vote(address _voter, uint _candidate, uint _weight, uint[] memory prefernceVote) external override {
        require(voteStatus[_voter] == false, "Voter already voted");
        _candidate;
        _weight;
        uint len = prefernceVote.length;
        if(votes.length == 0){
            for(uint i=0; i<len; i++){
                votes.push(new uint[](len));
            }
        } 

        for(uint i=0; i<len; i++){
            for(uint j=i+1; j<len; j++){
                if(prefernceVote[i] > prefernceVote[j]){
                    votes[i][j]++;
                }
                else if(prefernceVote[i] < prefernceVote[j]){
                    votes[j][i]++;
                }
            }
        }
        voteStatus[_voter] = true;
    }

    function getVoteCount(uint _candidate, uint _preference) external override view  returns (uint) {
        _preference;
        return votes[_candidate][1];
    }

    function getVoteArr() external override view  returns (uint[][] memory temp) {
        return votes;
    }

}