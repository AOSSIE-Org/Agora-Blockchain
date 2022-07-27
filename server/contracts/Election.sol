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
        // Election type: 0 for invite based 1 for open
        // bool electionType;
    }
    ElectionInfo public electionInfo;
    
    address electionOrganizer;

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

    //Events
    event CandidateAdded(address election, address ballot, address candidate);
    event VoteCasted(address ballot, address candidate, uint weight);
    event ListWinners(Candidate[] winners);

    //Modifiers
    modifier onlyOrganizer() {
        require(msg.sender == electionOrganizer,"Caller must be the election organizer");
        _;
    }    

    //Constructor
    constructor(ElectionInfo memory _electionInfo, Ballot _ballot, ResultCalculator _resultCalculator){
        
        electionOrganizer = address(msg.sender);
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

    // Authentication
    // function isAuthenticated(Voter _voter) public returns(bool){}


    function getElectionInfo() public view returns(ElectionInfo memory){
        return electionInfo;
    }
    
    //Add candidate to election as well as ballot
    function addCandidate(Candidate _candidate) onlyOrganizer public {
        candidates.push(_candidate);
        ballot.addCandidate(_candidate);
        emit CandidateAdded(address(this),address(ballot),address(_candidate));
    }
    
    function getCandidates() public view returns (Candidate[] memory){
        return candidates;
    }

    function getVoterCount() public view returns(uint){
        return voterCount;
    }

    // only after election ends
    function getWinners()onlyOrganizer public view returns(Candidate[] memory){
        return winners;
    }
    
    // Performs vote in ballot and updates voterCount
    /*
        In invite based elections, a condidition to check if voter is authenticated

    */
    function vote(Candidate _candidate, uint weight) public {
        // if (electionInfo.electionType==0) {
        //     require(isAuthenticated(msg.Sender),"Voter must be authenticated to cast vote");
        // }
        ballot.vote(_candidate, weight);
        voterCount++;
        emit VoteCasted(address(ballot),address(_candidate),weight);
    }

    // function getTimeStamps()public;
    //                  ->this can be depracated, since time stamps are easily available from ElectionInfo
    

    function getResult() onlyOrganizer public {
        winners = resultCalculator.getResult(ballot, voterCount);
        emit ListWinners(winners);
    }

}