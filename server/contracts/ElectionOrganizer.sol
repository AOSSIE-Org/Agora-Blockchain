// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Election.sol';
import './Candidate.sol';
import './VotingSystem.sol';
import './ElectionStorage.sol';

contract ElectionOrganizer {
    struct OrganizerInfo{
        string name;
        uint organizerID;
        address publicAddress;
    }

    
    constructor(string memory _name, uint _organizerID, address _publicAddress){

        OrganizerInfo memory organizerInfo;
        organizerInfo.name=_name;
        organizerInfo.organizerID = _organizerID;
        organizerInfo.publicAddress= _publicAddress;
    
    }

    function createElection(Election.ElectionInfo memory _electionInfo,VotingSystem _votingSystem, ResultCalculator _resultCalculator)public{

        Election election = new Election(_electionInfo,_votingSystem,_resultCalculator);
        
        // election.setVotingSystem(_votingSystem);
        // save in ElectionStorage
    }
    
    
    // function addCandidate(Election _election, Candidate _candidate) ->requires to call Candidate() once. Discuss once, may not be required
    function addCandidate(Election _election,Candidate.CandidateInfo memory _candidateInfo)public{
    
        Candidate candidate = new Candidate(_candidateInfo);
        
        // _election.electionInfo.candidates.push(candidate);
        // election.getElectionInfo()
        
        _election.addCandidate(candidate);
    }
    
    // function getResult(Election)public;
    
}