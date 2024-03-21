//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract VotingProcess {
    uint public id;
    string public name;
    string public description;
    uint public startDate;
    uint public endDate;


    uint canidateCounter;
    bytes32[] public candidates;
    mapping(uint256 =>bytes32) public candidateIdToCandidate;
    mapping(bytes32 => uint256) public votesPerCandidate;

    enum Status { Pending, Active, Closed }
    Status public currentStatus;

    address private owner;

    event CandidateAdded(bytes32 candidate);
    event Voted(bytes32 candidate);
    event ElectionStatusChanged(Status newStatus);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier inStatus(Status requiredStatus) {
        currentStatus=getStatus();
        require(currentStatus == requiredStatus, "Invalid election status");
        _;
    }


    constructor(
        uint _id,
        string memory _name,
        string memory _description,
        uint _startDate,
        uint _endDate
    ) {
        require(_endDate > _startDate, "End date must be after start date");
        owner = msg.sender;
        id = _id;
        name = _name;
        description = _description;
        startDate = _startDate;
        endDate = _endDate;
        currentStatus = Status.Pending;
        canidateCounter=0;
    }

    function getStatus() public view returns (Status) {
        if (block.timestamp < startDate) {
            return Status.Pending;
        } else if (block.timestamp >= startDate && block.timestamp < endDate) {
            return Status.Active;
        } else {
            return Status.Closed;
        }
    }

    function getCandidates() public view returns (bytes32[] memory) {
        return candidates;
    }

    function getVotesPerCandidate() public view returns (bytes32[] memory, uint256[] memory) {
        uint256[] memory votes = new uint256[](candidates.length);
        for (uint256 i = 0; i < candidates.length; i++) {
            votes[i] = votesPerCandidate[candidates[i]];
        }
        return (candidates, votes);
    }

    function getWinningCandidate() public inStatus(Status.Closed) returns (bytes32 candidate, uint256 votes) {
        uint256 highestVoteCount = 0;
        bytes32 winningCandidate;
        for (uint256 i = 0; i < candidates.length; i++) {
            if (votesPerCandidate[candidates[i]] > highestVoteCount) {
                winningCandidate = candidates[i];
                highestVoteCount = votesPerCandidate[candidates[i]];
            }
        }
        return (winningCandidate, highestVoteCount);
    }

    function getStartDate() public view returns (uint) {
        return startDate;
    }

    function getEndDate() public view returns (uint) {
        return endDate;
    }

    // remove election status for testing.
    function vote(uint256 candidateId) public  {
        bytes32 candidate = candidateIdToCandidate[candidateId];
        require(votesPerCandidate[candidate] < type(uint256).max, "Vote count overflow");
        votesPerCandidate[candidate] += 1;
        emit Voted(candidate);
    }

    // remove election status for testing.
    function addCandidate(bytes32 candidate) public onlyOwner {
        candidates.push(candidate);
        candidateIdToCandidate[canidateCounter]=candidate;
        canidateCounter++;
        emit CandidateAdded(candidate);
    }
}
