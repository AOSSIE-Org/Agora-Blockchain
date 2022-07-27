// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Election.sol';
import './Candidate.sol';
import './ballot/Ballot.sol';
import './ElectionStorage.sol';

contract ElectionOrganizer {
    
    struct OrganizerInfo{
        uint organizerID;
        string name;
        address publicAddress;
    }
    OrganizerInfo organizerInfo;

    event CreatedElection(address election);
    event CandidateAdded(address election, address candidate);
    event ResultsDeclared(address election, Candidate[] winners);

    constructor(OrganizerInfo memory _organizerInfo){
        organizerInfo = _organizerInfo;
    }

    function createElection(Election.ElectionInfo memory _electionInfo,Ballot _ballot, ResultCalculator _resultCalculator)public{

        Election election = new Election(_electionInfo,_ballot,_resultCalculator);
        emit CreatedElection(address(election));
        // save in ElectionStorage
    }
    
    
    // function addCandidate(Election _election, Candidate _candidate) ->requires to call Candidate() once. Discuss once, may not be required
    function addCandidate(Election _election,Candidate.CandidateInfo memory _candidateInfo)public{
    
        Candidate candidate = new Candidate(_candidateInfo);
        _election.addCandidate(candidate);
        emit CandidateAdded(address(_election),address(candidate));
    }
    
    function getResult(Election _election)public{
        _election.getResult();
        emit ResultsDeclared(address(_election),_election.getWinners());
    }
    
}