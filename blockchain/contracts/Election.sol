// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IBallot} from "./ballots/interface/IBallot.sol";
import {IResultCalculator} from "./resultCalculators/interface/IResultCalculator.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract Election is Initializable {
    error OwnerPermissioned();
    error AlreadyVoted();
    error GetVotes();
    error ElectionIncomplete();
    error ElectionInactive();

    mapping(address user => bool isVoted) public userVoted;

    struct ElectionInfo {
        uint startTime;
        uint endTime;
        string name;
        string description;
        // Election type: 0 for invite based 1 for open
    }

    struct Candidate {
        uint candidateID; // remove candidateId its not needed
        string name;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert OwnerPermissioned();
        _;
    }

    ElectionInfo public electionInfo;

    address public factoryContract;
    address public owner;

    uint public winner;
    uint public resultType;

    bool private ballotInitialized;

    IBallot private ballot;
    IResultCalculator private resultCalculator;

    Candidate[] public candidates;

    function initialize(
        ElectionInfo memory _electionInfo,
        uint _resultType,
        address _ballot,
        address _owner,
        address _resultCalculator
    ) external initializer {
        electionInfo = _electionInfo;
        resultType = _resultType;
        owner = _owner;
        factoryContract = msg.sender;
        ballot = IBallot(_ballot);
        resultCalculator = IResultCalculator(_resultCalculator);
    }

    function userVote(uint[] memory voteArr) external {
        if (
            block.timestamp < electionInfo.startTime ||
            block.timestamp > electionInfo.endTime
        ) revert ElectionInactive();
        if (userVoted[msg.sender]) revert AlreadyVoted();
        if (ballotInitialized == false) {
            ballot.init(candidates.length);
            ballotInitialized = true;
        }
        ballot.vote(voteArr);
        userVoted[msg.sender] = true;
    }

    function ccipVote(address user, uint[] memory _voteArr) external {
        if (
            block.timestamp < electionInfo.startTime ||
            block.timestamp > electionInfo.endTime
        ) revert ElectionInactive();
        if (userVoted[user]) revert AlreadyVoted();
        if (ballotInitialized == false) {
            ballot.init(candidates.length);
            ballotInitialized = true;
        }
        if (msg.sender != factoryContract) revert OwnerPermissioned();
        userVoted[user] = true;
        ballot.vote(_voteArr);
    }

    function addCandidate(string calldata _name) external onlyOwner {
        //not allowed after election starts
        Candidate memory newCandidate = Candidate(candidates.length, _name);
        candidates.push(newCandidate);
    }

    function removeCandidate(uint _id) external onlyOwner {
        //not allowed after election starts
        candidates[_id] = candidates[candidates.length - 1];
        candidates[_id].candidateID = _id;
        candidates.pop();
    }

    function getCandidateList() external view returns (Candidate[] memory) {
        return candidates;
    }

    function getResult() external returns (uint) {
        if (block.timestamp < electionInfo.endTime) revert ElectionIncomplete();
        bytes memory payload = abi.encodeWithSignature("getVotes()");

        (bool success, bytes memory allVotes) = address(ballot).staticcall(
            payload
        );
        if (!success) revert GetVotes();

        uint _winner = resultCalculator.getResults(allVotes, resultType);
        winner = _winner;
        return _winner;
    }
}
