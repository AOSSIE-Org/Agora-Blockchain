// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

contract Election {
    // Public address of election creator
    address public electionOrganiser;

    // Election details
    string public name;
    string public description;
    string public algorithm;
    uint public sdate;
    uint public edate;

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

    // Mapping for candidates and voters
    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;

    Candidate[] public winnerDetails;

    // To keep account of candidate id
    uint public candidatesCount = 0;

    // Iniitializing election contract
    constructor (string[] memory _nda, uint[] memory _se) {
        electionOrganiser = msg.sender;
        name = _nda[0];
        description = _nda[1];
        algorithm = _nda[2];
        sdate = _se[0];
        edate = _se[1];
        if(block.timestamp < _se[0]) {
            status = Status.pending;
        } else {
            status = Status.active;
        }
    }

    // To get status of election
    function getStatus() public view returns (Status) {
        if(block.timestamp < sdate) {
            return Status.pending;
        } else if(block.timestamp < edate) {
            return Status.active;
        } else {
            return Status.closed;
        }
    }
    
    // Adding candidates before election started (only by organiser)
    function addCandidate(string memory _name, string memory _about) public {
        require(msg.sender == electionOrganiser, "Only organiser can add candidates");
        require(getStatus() == Status.pending, "Candidates can only be added before election has started");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _about, 0);
    }

    // Casting votes (only when election is active)
    function vote(uint _candidate) public {
        require(!voters[msg.sender], "Voter has already Voted!");
        require(_candidate <= candidatesCount && _candidate >= 1, "Invalid candidate to Vote!");
        require(getStatus() == Status.active, "Election closed");
        voters[msg.sender] = true;
        candidates[_candidate].voteCount++;
    }

    // Calculate results
    function calculateResults() public {
        require(msg.sender == electionOrganiser, "Only organiser can call this function");
        require(getStatus() == Status.closed, "Election not yet closed.");
        uint maxVote = 0;
        for(uint i = 1; i <= candidatesCount; i++) {
            if(candidates[i].voteCount >= maxVote) {
                if(candidates[i].voteCount > maxVote) {
                    // Remove existing winners if new max vote is found
                    maxVote = candidates[i].voteCount;
                    delete winnerDetails;
                    winnerDetails.push(candidates[i]);
                } else {
                    // Push to existing winner array if same max vote is found
                    winnerDetails.push(candidates[i]);
                }
            }
        }
    }

    // Get winner details
    function getWinnerDetails() public view returns (Candidate[] memory) {
        return winnerDetails;
    }
}