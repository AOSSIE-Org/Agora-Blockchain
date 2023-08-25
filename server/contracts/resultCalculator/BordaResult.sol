// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import './ResultCalculator.sol';
import '../ballot/Ballot.sol';


contract BordaResult is  ResultCalculator{
        uint[] public winners;

        function borda(uint[][] memory _votes, uint[] memory _candidates) public returns (uint[] memory) {
            uint256[] memory tally = new uint256[](_candidates.length);
            for (uint i = 0; i < _candidates.length; i+=1) {
            tally[i] = 0;
        }
        for (uint i = 0; i < _votes.length; i++) {
            for (uint j = 0; j < _candidates.length; j++) {
            tally[j] += _candidates.length + 1 - _votes[i][j];
            }
        }

        uint threshold = 0;

        for (uint i = 0; i < _candidates.length; i++) {
            if (tally[i] == threshold) {
            winners.push(i);
        }
        if (tally[i] > threshold) {
            threshold = tally[i];
            delete winners;
            winners.push(i);
            }
        }
            return winners;
    }
    function getResult(Ballot _ballot, uint _voterCount)external override returns(uint[] memory) {
      
       uint[][] memory _votes =  _ballot.getVoteArr();
       uint [] memory _candidates  = _ballot.getCandidates();
         uint [] memory  arr  = borda(_votes,_candidates) ;



        return  arr;
    }
}