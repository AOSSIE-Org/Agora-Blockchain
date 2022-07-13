// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Candidate.sol';
import './votingSystem/VotingSystem.sol';
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
    Candidate[] candidates;
    Candidate[] winners;
    mapping(Candidate => uint) public voteCount;

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
        candidates.push(_candidate);
    }
    
    function getCandidates() public view returns (Candidate[] memory){
        return candidates;
    }

    function addWinner(Candidate _candidate)public {
        winners.push(_candidate);
    }

    function getWinners()public view returns(Candidate[] memory){
        return winners;
    }
    
    
    function addVote(Candidate _candidate) public {
        voteCount[_candidate]++;
    }

    function getVoteCount(Candidate _candidate)public view returns(uint){
        return voteCount[_candidate];
    }


    function vote(Candidate[] memory _candidates)public{
        votingSystem.vote(this, _candidates);
    }

    // function getTimeStamps()public;
    //                  ->this can be depracated, since time stamps are easily available from ElectionInfo
    function getResult()public{
        resultCalculator.getResult(this);
    }

}


/*
Each new algorithm will look like:
    -> [optional] an implementation of VotingSystem
    -> [optional] an implementation of ResultCalculator
    -> but one of the above for sure

So during instantiation of a new election, one implementation of VotingSystem and one of ResultCalculator needs to be passed
*/