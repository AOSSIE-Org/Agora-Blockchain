//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "./ResultCalculator.sol";
import "../ballot/Ballot.sol";

contract SchulzeResult is ResultCalculator {
    uint[] winners;


    function maxElement(uint a, uint b) internal pure returns (uint) {
        return a > b ? a : b;
    }

    function minElement(uint a, uint b) internal pure returns (uint) {
        return a < b ? a : b;
    }

<<<<<<< HEAD:server/contracts/resultCalculator/SchulzeResult.sol
    function getWinner(uint[] memory data, uint[] memory candidates) public pure returns(uint[] memory) {
        uint[] memory res = new uint[](data.length);
        uint currIndex = 0;
        uint globalMax = 10000;
        for(uint i=0; i<candidates.length; i++){
            if(currIndex >= candidates.length) break;
            uint currMax = 0;
            for(uint j=0; j<candidates.length; j++){
                if(data[j] < globalMax && data[j] > currMax){
                    currMax = data[j];
                }
            }
            globalMax = currMax;
            for(uint j=0; j<candidates.length; j++){
                if(currIndex >= candidates.length) break;
                if(data[j] == currMax){
                    res[currIndex] = candidates[j];
                    currIndex++;
                }
            }
        }
        return res;
=======
    function getWinner(uint[] memory data, uint[] memory candidates) internal {
        winners = new uint[](0);
        uint globalMax = 0;
        for(uint i=0; i<candidates.length; i++){
            if(data[i] > globalMax) {
                globalMax = data[i];
            }
        }

        for(uint i=0; i<candidates.length; i++){
            winners.push(candidates[i]);
        }
>>>>>>> localDiamondFix:server/contracts/facets/votingApp/resultCalculator/SchulzeResult.sol
    }

    function getResult(Ballot _ballot, uint _voterCount) external override returns (uint[] memory) {
        uint[] memory candidates = _ballot.getCandidates();
        uint[][] memory votes = _ballot.getVoteArr();
        uint len = candidates.length;
        winners = new uint[](len);
        _voterCount;

        for(uint i=0; i<len; i++){
            winners[i] = 1000;
        }
        uint[][] memory path = new uint[][](len);
        for(uint i=0; i<len; i++){
            path[i] = new uint[](len);
        }

        for(uint i=0; i<len; i++){
            for(uint j=0; j<len; j++){
                path[i][j] = 0;
            }
        }
                
        for (uint i = 0; i < len; i++) {
            for (uint j = 0; j < len; j++) {
                if (i != j) {
                    if(votes[i][j] > votes[j][i]){
                        path[i][j] = votes[i][j];
                    }
                    else{
                        path[i][j] = 0;
                    }
                }
            }
        }

        uint mini = 0;
        uint maxi = 0;
        for (uint i = 0; i < len; i++) {
            for (uint j = 0; j < len; j++) {
                if (i != j) {
                    for (uint k = 0; k < len; k++) {
                        if (i != k && j != k){
                                mini = 0;
                                mini = minElement(path[j][i], path[i][k]);
                                maxi = maxElement(mini, path[j][k]);

                                path[j][k] = maxi;
                        }
                    }
                }
            }
        }

        uint[] memory tempWinner = new uint[](candidates.length);
        for(uint i=0; i<candidates.length; i++){
            tempWinner[i] = 10000;
        }


        for(uint i =0; i<len; i++){
            for(uint j=0; j<len; j++){
                if(i != j){
                    if(path[j][i] > path[i][j]){
                        tempWinner[i] = tempWinner[i] -1;
                    }
                }
            }
        }

<<<<<<< HEAD:server/contracts/resultCalculator/SchulzeResult.sol
        winners = getWinner(tempWinner, candidates);        
=======
        getWinner(tempWinner, candidates);        
>>>>>>> localDiamondFix:server/contracts/facets/votingApp/resultCalculator/SchulzeResult.sol
        return winners;
    }
}