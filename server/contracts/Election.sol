// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import './ballot/Ballot.sol';
import './resultCalculator/ResultCalculator.sol';


contract Election {

    // ------------------------------------------------------------------------------------------------------
    //                                              STATE
    // ------------------------------------------------------------------------------------------------------

    struct ElectionInfo {
        uint electionID;
        string name;
        string description;
        uint startDate;
        uint endDate;
        // Election type: 0 for invite based 1 for open
        // bool electionType;
    }
    ElectionInfo electionInfo;

    struct Candidate {
        uint candidateID;
        string name;
        string description;
    }
    Candidate[] candidates;
    uint[] winners;
    mapping(uint=>Candidate)candidateWithID;
    uint candidateCount;

    address electionOrganizer;
    address electionOrganizerContract;

    uint voterCount;

    enum Status {
        active,
        pending,
        closed
    }

    bool resultDeclared;

    // ------------------------------------------------------------------------------------------------------
    //                                          DEPENEDENCIES
    // ------------------------------------------------------------------------------------------------------
    
    Ballot ballot;
    ResultCalculator resultCalculator;

    // ------------------------------------------------------------------------------------------------------
    //                                              EVENTS
    // ------------------------------------------------------------------------------------------------------

    event CandidateAdded(address election, address ballot, Candidate candidate);
    event VoteCasted(address ballot, Candidate candidate, uint weight);
    event ListWinners(uint[] winners);

    // ------------------------------------------------------------------------------------------------------
    //                                            MODIFIERS
    // ------------------------------------------------------------------------------------------------------

    modifier onlyOrganizerContract() {
        require(msg.sender == electionOrganizerContract,"Must be called from the election organizer contract");
        _;
    }    

    modifier onlyOrganizer() {
        require(msg.sender == electionOrganizer,"Caller must be the election organizer");
        _;
    }

    
    // ------------------------------------------------------------------------------------------------------
    //                                            CONSTRUCTOR
    // ------------------------------------------------------------------------------------------------------

    constructor(ElectionInfo memory _electionInfo, Ballot _ballot, ResultCalculator _resultCalculator,address _electionOrganizer, address _electionOrganizerContract) {
        
        electionOrganizer = _electionOrganizer;
        electionOrganizerContract = _electionOrganizerContract;
        electionInfo = _electionInfo;
        ballot = _ballot;
        resultCalculator = _resultCalculator;
        // if(block.timestamp < _electionInfo.startDate) {
        //     status = Status.pending;
        // } else {
        //     status = Status.active;
        // }
        candidateCount = 1000;
        voterCount = 0;
        resultDeclared = false;

    }

    // ------------------------------------------------------------------------------------------------------
    //                                            FUNCTIONS
    // ------------------------------------------------------------------------------------------------------

    function getStatus() public view returns (Status) {

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

    function getBallot() public onlyOrganizer view returns(address) {
        return address(ballot);
    }

    function getResultCalculator() public onlyOrganizer view returns(address) {
        return address(resultCalculator);
    }

    function getElectionInfo() public view returns(ElectionInfo memory){
        return electionInfo;
    }

    function getElectionOrganizer() public view returns (address) {
        return electionOrganizer;
    }
    
    //Add candidate to election as well as ballot
    function addCandidate(Candidate memory _candidate) external onlyOrganizerContract {
        require(getStatus() == Status.pending,"Cannot add candidates after election has started");
        uint id = candidateCount + 1;
        _candidate.candidateID = id;
        candidates.push(_candidate);
        ballot.addCandidate(_candidate.candidateID);
        candidateWithID[_candidate.candidateID]=_candidate;
        candidateCount++;
        emit CandidateAdded(address(this),address(ballot),_candidate);
    }
    
    function getCandidateCount() public view returns(uint) {
        return candidateCount;
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getCandidateByID(uint _candidateID) public view returns (Candidate memory) {
        return candidateWithID[_candidateID];
    }

    function getVoterCount() external view returns(uint){
        return voterCount;
    }

    function getVoteStatus(address _voter) external view returns(bool){
        return ballot.getVoteStatus(_voter);
    }

    // only after election ends
    function getWinners() public view returns(uint[] memory) {
        require(resultDeclared == true,"Results aren't declared yet");
        return winners;
    }
    
    // Performs vote in ballot and updates voterCount
    /*
        In invite based elections, a condidition to check if voter is authenticated

    */
    function vote(address _voter, uint _candidateID, uint weight) external {
        require(getStatus() == Status.active, "Election needs to be active to vote");
        // if (electionInfo.electionType==0) {
        //     require(isAuthenticated(msg.Sender),"Voter must be authenticated to cast vote");
        // }
        ballot.vote(_voter,_candidateID, weight);
        voterCount++;
        emit VoteCasted(address(ballot),candidateWithID[_candidateID],weight);
    }

    // function getTimeStamps()public;
    //                  ->this can be depracated, since time stamps are easily available from ElectionInfo
    

    function getResult() external returns(uint[] memory){
        require(getStatus() == Status.closed, "Results are declared only after the election ends");
        if (resultDeclared == false) {
            winners = resultCalculator.getResult(ballot, voterCount);
            resultDeclared = true;
            emit ListWinners(winners);
            return winners;
        }
        else {
            return getWinners();
        }
    }

}