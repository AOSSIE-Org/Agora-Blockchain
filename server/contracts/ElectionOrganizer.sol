// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Election.sol';
import './ballot/Ballot.sol';
import './ElectionStorage.sol';

contract ElectionOrganizer {
    
    struct OrganizerInfo{
        uint organizerID;
        string name;
        address publicAddress;
    }

    mapping(address => OrganizerInfo)organizers;

    event CreatedElection(address election);
    event CandidateAdded(address election, Election.Candidate candidate);

    function addOrganizer(OrganizerInfo memory _organizerInfo, address _organizer) public {
        organizers[_organizer] = _organizerInfo;
    }


    function createElection(Election.ElectionInfo memory _electionInfo,Ballot _ballot, ResultCalculator _resultCalculator)public{

        Election election = new Election(_electionInfo,_ballot,_resultCalculator,msg.sender);
        emit CreatedElection(address(election));
        // save in ElectionStorage
    }
    
    function addCandidate(Election _election,Election.Candidate memory _candidate)public{
        _election.addCandidate(_candidate);
        emit CandidateAdded(address(_election),_candidate);
    }
    
    function getResult(Election _election)public{
        _election.getResult();
        // emit ResultsDeclared(address(_election),_election.getWinners());
    }
    
}