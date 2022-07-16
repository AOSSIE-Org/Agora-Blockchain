// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Candidate.sol';
import './ballot/Ballot.sol';
import './resultCalculator/ResultCalculator.sol';


contract Election {

    struct ElectionInfo {
        uint electionID;
        string name;
        string description;
        uint startDate;
        uint endDate;
        address electionOrganizer;
    }
    ElectionInfo public electionInfo;

    Candidate[] candidates;
    Candidate[] winners;
    uint voterCount;


    enum Status {
        active,
        pending,
        closed
    }
    Status status;
    
    //Dependencies
    Ballot public ballot;
    ResultCalculator public resultCalculator;

    //Constructor
    constructor(ElectionInfo memory _electionInfo, Ballot _ballot, ResultCalculator _resultCalculator){
        
        electionInfo = _electionInfo;
        
        ballot = _ballot;
        
        resultCalculator = _resultCalculator;
        
        if(block.timestamp < _electionInfo.startDate) {
            status = Status.pending;
        } else {
            status = Status.active;
        }
        voterCount = 0;
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


    function getElectionInfo() public view returns(ElectionInfo memory){
        return electionInfo;
    }
    
    //Add candidate to election as well as ballot
    function addCandidate(Candidate _candidate)public {
        candidates.push(_candidate);
        ballot.addCandidate(_candidate);
    }
    
    function getCandidates() public view returns (Candidate[] memory){
        return candidates;
    }

    function getVoterCount() public view returns(uint){
        return voterCount;
    }


    function getWinners()public view returns(Candidate[] memory){
        return winners;
    }
    
    // Performs vote in ballot and updates voterCount
    function vote(Candidate _candidate, uint weight)public{
        ballot.vote(_candidate, weight);
        voterCount++;
    }

    // function getTimeStamps()public;
    //                  ->this can be depracated, since time stamps are easily available from ElectionInfo
    

    function getResult()public{
        winners = resultCalculator.getResult(ballot, voterCount);
    }

}

