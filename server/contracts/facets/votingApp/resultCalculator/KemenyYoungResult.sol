// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import './ResultCalculator.sol';
import '../ballot/Ballot.sol';

contract KemenyYoungResult is ResultCalculator {
    
    uint[] winners;
    uint minValue = 1000;

    // ------------------------------------------------------------------------------------------------------
    //                                            FUNCTIONS
    // ------------------------------------------------------------------------------------------------------

    function swap(uint[] memory arr, uint i, uint j) internal pure {
        uint temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    
    function permute(uint[][] memory Votes, uint[] memory arr, uint l, uint r) internal {
        if (l == r) {
            uint currVal = 0;
            for(uint i=0; i<arr.length; i++){
                for(uint j=i+1; j<arr.length; j++){
                    currVal += (Votes[arr[j]][arr[i]]);
                }
            }
            if(currVal <= minValue){
                winners = arr;
                minValue = currVal;
            }

        } 
        else {
            for (uint i = l; i <= r; i++) {
                swap(arr, l, i);
                permute(Votes, arr, l + 1, r);
                swap(arr, l, i);
            }
        }
    }

    function getResult(Ballot _ballot, uint _voterCount)external override returns (uint[] memory) {
        _voterCount;
        winners = new uint[](0);
        uint[] memory candidates = _ballot.getCandidates();
        uint[][] memory Votes = _ballot.getVoteArr();
        uint candidateCount = candidates.length;

        uint[] memory arr = new uint[](candidateCount);
        for(uint i=0; i<candidateCount; i++){
            arr[i] = i;
        }        
        permute(Votes, arr, 0, candidateCount-1);

        for(uint i=0; i<candidateCount; i++){
            winners[i] = candidates[winners[i]];
        }

        return winners;  
    }
}