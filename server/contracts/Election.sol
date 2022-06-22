// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Candidate.sol';
import './VotingSystem.sol';
import './ResultCalculator.sol';


contract Election {
    struct ElectionInfo {
        uint electionID;
        string name;
        string description;
        uint startDate;
        uint endDate;
        address electionOrganizer;
        Candidate[] candidates;
        Candidate winner;
    }
    ElectionInfo public electionInfo;

    enum Status {
        active,
        pending,
        closed
    }
    Status status;
    
    VotingSystem public votingSystem;
    ResultCalculator public resultCalculator;

    constructor(ElectionInfo memory _electionInfo, VotingSystem _votingSystem, ResultCalculator _resultCalculator){
        
        electionInfo = _electionInfo;
        
        votingSystem = _votingSystem;
        
        resultCalculator = _resultCalculator;
        
        if(block.timestamp < _electionInfo.startDate) {
            status = Status.pending;
        } else {
            status = Status.active;
        }
    }

    function getStatus()public view returns (Status){

        if(block.timestamp < electionInfo.startDate) {
            return Status.pending;
        } 
        
        else if(block.timestamp < electionInfo.endDate) {
            return Status.active;
        } 
        
        else {
            return Status.closed;
        }
    }

    // function setVotingSystem(VotingSystem _votingSystem) public {
    //     votingSystem = _votingSystem;
    // } 

    function getElectionInfo() public view returns(ElectionInfo memory){
        return electionInfo;
    }

    function addCandidate(Candidate _candidate)public {
        electionInfo.candidates.push(_candidate);
    }
    
    function getCandidates() public view returns (Candidate[] memory){
        return electionInfo.candidates;
    }
    
    // function getTimeStamps()public;
    //                  ->this can be depracated, since time stamps are easily available from ElectionInfo
    // function vote(VotingSystem votingSystem)public;
    // function getResults(ResultCalculator resultCalculator)public;

}


/*
Each new algorithm will look like:
    -> [optional] an implementation of VotingSystem
    -> [optional] an implementation of ResultCalculator
    -> but one of the above for sure

So during instantiation of a new election, one implementation of VotingSystem and one of ResultCalculator needs to be passed
*/