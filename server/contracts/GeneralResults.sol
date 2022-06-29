// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import './ResultCalculator.sol';
import './Election.sol';
import './Candidate.sol';

contract GeneralResults is ResultCalculator {
    
    function getResult(Election election)public{
        uint maxVotes = 0;
        uint i;
        uint candidatesCount = election.getCandidates().length;
        Candidate[] memory candidates = election.getCandidates();
        uint votes = 0;
        // mapping(uint => uint[])memory voteDistribution;
        // Candidate[] memory winners;
        for (i = 0; i<candidatesCount; i++){
            votes = election.getVoteCount(candidates[i]);
            if(votes>maxVotes){
                maxVotes=votes;
                // winners = new Candidate[](candidatesCount);
                // winners.push(candidates[i]);
            }
        }
        for(i = 0;i<candidatesCount;i++){
            votes = election.getVoteCount(candidates[i]);
            if(votes==maxVotes){
                election.addWinner(candidates[i]);
            }
        }
        //call getWinners from Election.sol
    }
}