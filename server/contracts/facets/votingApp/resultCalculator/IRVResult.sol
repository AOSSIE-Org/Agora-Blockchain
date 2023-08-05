//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "./ResultCalculator.sol";
import "../ballot/Ballot.sol";

contract IRVResult is ResultCalculator{

    mapping(uint => uint) firstChoiceCount;    
    mapping(uint => uint) lastChoiceCount;    
    uint[] winners;


    function getResult(Ballot _ballot, uint _voterCount) external override returns (uint[] memory) {
        _voterCount;
        winners = new uint[](0);
        uint[] memory candidate = _ballot.getCandidates();
        uint[] memory potentialwinners = candidate;
        for(uint i=0; i<candidate.length; i++){
            potentialwinners[i] = 1;
        }
        uint[][] memory votes = _ballot.getVoteArr();
        uint castedVoteLen = votes.length;
        uint potentialCandidateCount = candidate.length;
        uint candidateLength = candidate.length;

       while(potentialCandidateCount > 0){
            if(potentialCandidateCount == 1) {
                for(uint i=0; i<candidateLength; i++){
                    if(potentialwinners[i] == 1){
                        winners.push(candidate[i]);
                        return winners;
                    }
                }
            }

            for(uint i=0; i<candidateLength; i++){
                firstChoiceCount[candidate[i]] = 0;
                lastChoiceCount[candidate[i]] = 0;
            }

            uint loserIndex = candidate.length+2;
            uint highLastRankChoice = 0;
            for(uint i=0; i<candidateLength; i++){
                if(potentialwinners[i] == 1){
                    for(uint j=0; j<castedVoteLen; j++){
                        if(votes[j][i] == 1){
                            firstChoiceCount[candidate[i]]++;
                        }
                        if(votes[j][i] == potentialCandidateCount){
                            lastChoiceCount[candidate[i]]++;
                        }
                    }

                    if(firstChoiceCount[candidate[i]]*2 > castedVoteLen){
                        winners.push(candidate[i]);
                        return winners;
                    }
                    if(lastChoiceCount[candidate[i]] > highLastRankChoice){
                        highLastRankChoice = lastChoiceCount[candidate[i]];
                    }
                }
            }

            uint highLastRankCount = 0;
            uint leastFirstRankChoice = votes.length+2;
            uint leastFirstRankCount = 0;
            for(uint i=0; i<candidateLength; i++){
                if(potentialwinners[i] == 1){
                    if(lastChoiceCount[candidate[i]] == highLastRankChoice){
                        highLastRankCount++;
                    }
                    if(firstChoiceCount[candidate[i]] < leastFirstRankChoice){
                        leastFirstRankChoice = firstChoiceCount[candidate[i]];
                        leastFirstRankCount = 1;
                        loserIndex = i;
                    }
                    else if(firstChoiceCount[candidate[i]] == leastFirstRankChoice){
                        leastFirstRankCount++;
                    }
                }
            }

            if(leastFirstRankCount == potentialCandidateCount){
                for(uint i=0; i<candidate.length; i++){
                    if(potentialwinners[i] == 1){
                        winners.push(candidate[i]);
                    }
                }
                return winners;
            }

            potentialwinners[loserIndex] = 0;
            potentialCandidateCount--;
            for(uint i=0; i<castedVoteLen; i++){
                uint loserRank = votes[i][loserIndex];
                for(uint j=0; j<candidateLength; j++){
                    if(potentialwinners[j] == 1 && votes[i][j] > loserRank){
                        votes[i][j]--;
                    }
                }
            }
        }
        return winners;
    }
}