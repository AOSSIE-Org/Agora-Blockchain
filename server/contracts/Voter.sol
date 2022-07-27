// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Election.sol';
import './Candidate.sol';

contract Voter{
    
    address voter;
    
    struct VoterInfo {
        uint voterID;
        bool voterAuth;
    }
    VoterInfo public voterInfo;
    
    mapping (Election => bool) voteStatus;

    modifier onlyVoter() {
        require(msg.sender==voter,"Not a valid voter");
        _;
    }

    event VoteCasted(address election, address candidate, uint weight);

    constructor(VoterInfo memory _voterInfo){
        voter = msg.sender;
        voterInfo=_voterInfo;
    }

    function setVoteStatus(Election _election) public {
        voteStatus[_election]=true;
    }

    function castVote(Election _election,Candidate _candidate, uint _weight) onlyVoter public {
        require(voteStatus[_election]==false,"Already voted");
        _election.vote(_candidate, _weight);
        emit VoteCasted(address(_election),address(_candidate),_weight);

        /* 
            Based on the type of ballot, the vote status of the voter should be set:
                For GeneralBallot, after one vote
                For other Ballots, after all votes have been submitted
        */

    }

}