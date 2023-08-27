// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import './ResultCalculator.sol';
import '../ballot/Ballot.sol';

contract Oklahoma is ResultCalculator {

    // ------------------------------------------------------------------------------------------------------
    //                                              STATE
    // ------------------------------------------------------------------------------------------------------
    
    // candidate id to vote count
    mapping (uint => uint) votesOfCandidate;
    uint[] winners;
    uint[] candidates;
    uint candidateCount;
    uint requiredMajority;

    // ------------------------------------------------------------------------------------------------------
    //                                           DEPENCENCIES
    // ------------------------------------------------------------------------------------------------------

    Ballot ballot;

    // ------------------------------------------------------------------------------------------------------
    //                                            FUNCTIONS
    // ------------------------------------------------------------------------------------------------------

    function getResult(Ballot _ballot, uint _voterCount) external override returns(uint[] memory) {
        // uint[] memory canididates = _ballot.getCandidates();
        winners = new uint[](0);
        ballot = _ballot;
        requiredMajority = _voterCount / 2;
        candidates = ballot.getCandidates();
        candidateCount = candidates.length;

        // updateVotes(candidates, 1);

        uint preference;
        uint leading;
        for (preference = 1; preference < candidateCount; preference++) {
            updateVotes(preference);
            leading = getLeadingCandidate();
            if (votesOfCandidate[leading]>requiredMajority) {
                break;
            }
        }
        winners.push(leading);
        return winners;
    }

    function updateVotes(uint _preference) internal {

        uint i;
        uint voteCount;
        for (i = 0; i < candidateCount; i++) {
            voteCount = ballot.getVoteCount(candidates[i],_preference);
            votesOfCandidate[candidates[i]] += voteCount / _preference;
        }   
    }

    function getLeadingCandidate() internal view returns(uint){
        uint i;
        uint voteCount;
        uint max;
        uint leading;
        for (i = 0; i < candidateCount; i++) {
            voteCount = votesOfCandidate[candidates[i]];
            if (voteCount > max) {
                max = voteCount;
                leading = candidates[i];
            }
        }
        return leading;
    }


}