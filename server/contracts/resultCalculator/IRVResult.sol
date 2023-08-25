//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "./ResultCalculator.sol";
import "../ballot/Ballot.sol";

contract IRVResult is ResultCalculator{

    mapping(uint => uint) first_choice_counts;    
    uint[] winners;

    function instant_runoff_voting (uint[] memory candidate, uint[][] memory votes, uint[] memory actualCandidate, uint candidateLen, uint votesLen) public returns (uint) {
        for(uint i=0; i<actualCandidate.length; i++){
            first_choice_counts[actualCandidate[i]] = 0;
        }
        
        for(uint i=0; i<votesLen; i++){
            first_choice_counts[votes[i][0]]++;
        }

        for(uint i=0; i<candidateLen; i++){
            if(first_choice_counts[candidate[i]] > (votesLen/2)){
                return candidate[i];
            }
        }

        uint loser = candidate[0];
        for(uint i=1; i<candidate.length; i++){
            if(first_choice_counts[candidate[i]] < first_choice_counts[loser]){
                loser = candidate[i];
            }
        }

        //Remove the least first choice candidate.
        int deleteIndex = -1;
        for(uint i=0; i<candidateLen; i++){
            if(loser == candidate[i]){
                deleteIndex = int(i);
                break;
            }
        }

        if(deleteIndex != -1){
            for(uint i=uint(deleteIndex); i<candidateLen-1; i++){
                candidate[i] = candidate[i+1];
            }
            candidateLen--;
        }
        return instant_runoff_voting(candidate, votes, actualCandidate, candidateLen, votesLen);
    }

    function getResult(Ballot _ballot, uint _voterCount) external override returns (uint[] memory) {
        _voterCount;
        winners = new uint[](0);
        uint[] memory actualCandidate = _ballot.getCandidates();
        uint[][] memory Votes = _ballot.getVoteArr();
        uint res = instant_runoff_voting(actualCandidate, Votes, actualCandidate, actualCandidate.length, Votes.length);
        winners.push(res);
        return winners;
    }
}