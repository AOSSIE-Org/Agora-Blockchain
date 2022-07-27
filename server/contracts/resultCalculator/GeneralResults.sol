// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import './ResultCalculator.sol';
import '../Candidate.sol';
import '../ballot/Ballot.sol';

contract GeneralResults is ResultCalculator {
    
    Candidate[] public winners;

    function getResult(Ballot _ballot, uint _voterCount)public override returns(Candidate[]memory) {
        
        Candidate[] memory candidates = _ballot.getCandidates();
        uint candidateCount = candidates.length;
        uint winningVoteCount = 0;
        uint voteCount = 0;
        uint i;

        for(i = 0; i < candidateCount; i++){
            voteCount=_ballot.getVoteCount(candidates[i],1);
            if ( voteCount > winningVoteCount) {
                winningVoteCount = voteCount;
            }
            if (winningVoteCount > _voterCount/2) {
                winners.push(candidates[i]);
                return winners;
            }
        }

        for(i = 0; i < candidateCount; i++){
            voteCount=_ballot.getVoteCount(candidates[i],1);
            if (voteCount == winningVoteCount) {
                winners.push(candidates[i]);
            }
        }
        return winners;
    }

}