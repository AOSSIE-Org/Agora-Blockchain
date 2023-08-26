// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './votingApp/Election.sol';

contract Voter{
    
    // ------------------------------------------------------------------------------------------------------
    //                                              STATE
    // ------------------------------------------------------------------------------------------------------

    address voter;
    
    event VoteCasted(address election, uint canidateID, uint weight);

    // ------------------------------------------------------------------------------------------------------
    //                                            FUNCTIONS
    // ------------------------------------------------------------------------------------------------------

    function castVote(Election _election,uint _candidateID, uint _weight,uint[] memory voteArr ) public {
        require(_election.getVoteStatus(msg.sender)==false,"Already voted");
        _election.vote(msg.sender,_candidateID, _weight,voteArr);
        emit VoteCasted(address(_election),_candidateID,_weight);

        /* 
            Based on the type of ballot, the vote status of the voter should be set:
                For GeneralBallot, after one vote
                For other Ballots, after all votes have been submitted
        */

    }

}