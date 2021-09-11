// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

contract Election {
    // Election details
    struct ElectionInfo {
        uint id;
        string name;
        string description;
        string algorithm;
        uint sdate;
        uint edate;
        uint voterCount;
        address electionOrganiser;
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

    // To keep account of candidate id
    uint public candidatesCount = 0;

    // Iniitializing election contract
    constructor (uint _id, string[] memory _nda, uint[] memory _se, address _electionOrganiser) {
        electionInfo = ElectionInfo(_id, _nda[0], _nda[1], _nda[2], _se[0], _se[1], 0, _electionOrganiser);
        if(block.timestamp < _se[0]) {
            status = Status.pending;
        } else {
            status = Status.active;
        }
    }

    function getTimestamps() public view returns (uint[2] memory) {
        uint[2] memory result = [uint256(0), uint256(0)];
        result[0] = block.timestamp;
        result[1] = electionInfo.sdate;
        return result;
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
        require(msg.sender == electionInfo.electionOrganiser, "Only organiser can add candidates");
        require(block.timestamp <= electionInfo.edate, "Candidates can only be added before election has started");
        candidates.push(Candidate(candidatesCount, _name, _about, 0));
        candidatesCount++;
    }

    // Casting votes (only when election is active)
    function vote(uint _candidate) public {
        require(!voters[msg.sender], "Voter has already Voted!");
        require(_candidate < candidatesCount && _candidate >= 0, "Invalid candidate to Vote!");
        require(getStatus() != Status.closed, "Election closed");
        require(getStatus() != Status.pending, "Election not yet started");
        voters[msg.sender] = true;
        candidates[_candidate].voteCount++;
        electionInfo.voterCount++;
    }

    // Get winner details
    function getWinnerDetails() public view returns (Candidate[] memory) {
        require(block.timestamp > electionInfo.edate, "Results can only be declared after election ends.");
        Candidate[] memory winnerDetails = new Candidate[](candidates.length);
        uint maxVote = 0;
        uint winnerCount = 0;
        for(uint i = 0; i < candidatesCount; i++) {
            if(candidates[i].voteCount > maxVote) {
                // Remove existing winners if new max vote is found
                maxVote = candidates[i].voteCount;
                winnerDetails = new Candidate[](candidates.length);
                winnerCount = 0;
                winnerDetails[winnerCount] = candidates[i];
                winnerCount++;
            } else if(candidates[i].voteCount == maxVote) {
                // Push to existing winner array if same max vote is found
                winnerDetails[winnerCount] = candidates[i];
                winnerCount++;
            }
        }
        return winnerDetails;
    }

    function getElectionDetails() public view returns (ElectionDetail memory) {
        ElectionDetail memory electionDetail = ElectionDetail(electionInfo, candidates);
        return electionDetail; 
    }
}