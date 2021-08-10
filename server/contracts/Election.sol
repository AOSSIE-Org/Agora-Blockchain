// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

contract Election {
    // Public address of election creator
    // address public electionOrganiser;

    // Election details
    struct ElectionInfo {
        uint id;
        string name;
        string description;
        string algorithm;
        uint sdate;
        uint edate;
    }

    ElectionInfo public electionInfo;

    // Enum for election status
    enum Status {active, pending, closed}
    Status public status;

    // Structure to store candidate details and vote count
    struct Candidate {
        uint id;
        string name;
        string about;
        uint voteCount;
    }

    struct ElectionDetail {
        ElectionInfo info;
        Candidate[] candidate;
    }

    // Mapping for candidates and voters
    Candidate[] public candidates;
    mapping(address => bool) public voters;

    //events
    event candidateAdded(Candidate candidate);
    event voted(uint candidateId);

    Candidate[] public winnerDetails;

    // To keep account of candidate id
    uint public candidatesCount = 0;

    // Iniitializing election contract
    constructor (uint _id, string[] memory _nda, uint[] memory _se) {
        // electionOrganiser = msg.sender;
        electionInfo = ElectionInfo(_id, _nda[0], _nda[1], _nda[2], _se[0], _se[1]);
        if(block.timestamp < _se[0]) {
            status = Status.pending;
        } else {
            status = Status.active;
        }
    }

    // To get status of election
    function getStatus() public view returns (Status) {
        if(block.timestamp < electionInfo.sdate) {
            return Status.pending;
        } else if(block.timestamp < electionInfo.edate) {
            return Status.active;
        } else {
            return Status.closed;
        }
    }

    // Adding candidates before election started (only by organiser)
    function addCandidate(string memory _name, string memory _about) public {
        //require(msg.sender == electionOrganiser, "Only organiser can add candidates");
        require(getStatus() == Status.pending, "Candidates can only be added before election has started");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _about, 0);
        emit candidateAdded(candidates[candidatesCount]);
    }

    // Casting votes (only when election is active)
    function vote(uint _candidate) public {
        // emit electionStatus(getStatus());
        require(!voters[msg.sender], "Voter has already Voted!");
        require(_candidate <= candidatesCount && _candidate >= 1, "Invalid candidate to Vote!");
        require(getStatus() != Status.closed, "Election closed");
        require(getStatus() != Status.pending, "Election not yet started");
        voters[msg.sender] = true;
        candidates[_candidate].voteCount++;
        emit voted(_candidate);
    }

    // Calculate results
    function calculateResults() private {
        // require(msg.sender == electionOrganiser, "Only organiser can call this function");
        require(getStatus() == Status.closed, "Election not yet closed.");
        uint maxVote = 0;
        for(uint i = 1; i <= candidatesCount; i++) {
            if(candidates[i].voteCount > maxVote) {
                // Remove existing winners if new max vote is found
                maxVote = candidates[i].voteCount;
                delete winnerDetails;
                winnerDetails.push(candidates[i]);
            } else if(candidates[i].voteCount == maxVote) {
                // Push to existing winner array if same max vote is found
                winnerDetails.push(candidates[i]);
            }
        }
    }

    // Get winner details
    function getWinnerDetails() public returns (Candidate[] memory) {
        require(block.timestamp > electionInfo.edate);
        if(winnerDetails.length == 0) {
            calculateResults();
        }
        return winnerDetails;
    }

    function getElectionDetails() public view returns (ElectionDetail memory) {
        ElectionDetail memory electionDetail = ElectionDetail(electionInfo, candidates);
        return electionDetail; 
    }
}
