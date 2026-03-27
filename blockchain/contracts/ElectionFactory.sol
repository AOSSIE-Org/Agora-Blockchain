// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Election} from "./Election.sol";
import {BallotGenerator} from "./ballots/BallotGenerator.sol";
import {ResultCalculator} from "./resultCalculators/ResultCalculator.sol";

import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract ElectionFactory is CCIPReceiver {
    error OnlyOwner();
    error OwnerRestricted();
    error NotWhitelistedSender();
    error InvalidCandidatesLength();
    error IncompatibleBallotResultType();
    error InvalidElectionTime();

    struct CCIPVote {
        address election;
        address user;
        uint[] voteArr;
    }

    uint public electionCount;
    address public factoryOwner;
    address[] public openBasedElections;
    // address[] public inviteBasedElections;

    BallotGenerator private ballotGenerator;
    address private immutable resultCalculator;
    address private immutable electionGenerator;

    mapping(uint election => address owner) private electionOwner;
    mapping(address owner => address[] election) private userElection;
    mapping(uint64 sourceChain => address senderContract)
        private approvedSenderContracts;

    event MessageReceived(
        bytes32 indexed messageId,
        uint64 indexed sourceChainSelector,
        address sender
    );

    /// initializes the contract with the router address.
    constructor(address router) CCIPReceiver(router) {
        factoryOwner = msg.sender;
        electionGenerator = address(new Election());
        ballotGenerator = new BallotGenerator();
        resultCalculator = address(new ResultCalculator());
    }

    modifier onlyOwner() {
        if (msg.sender != factoryOwner) revert OwnerRestricted();
        _;
    }

    function createElection(
        Election.ElectionInfo memory _electionInfo,
        Election.Candidate[] memory _candidates,
        uint _ballotType,
        uint _resultType
    ) external {
        if (_candidates.length < 2) revert InvalidCandidatesLength();
        if (_electionInfo.startTime >= _electionInfo.endTime) revert InvalidElectionTime();
        if (_electionInfo.startTime < block.timestamp) revert InvalidElectionTime();
        _validateBallotResultCompat(_ballotType, _resultType);

        address electionAddress = Clones.clone(electionGenerator);
        address _ballot = ballotGenerator.generateBallot(
            _ballotType,
            electionAddress
        );
        Election election = Election(electionAddress);
        election.initialize(
            _electionInfo,
            _candidates,
            _resultType,
            electionCount,
            _ballot,
            msg.sender,
            resultCalculator
        );
        electionCount++;
        electionOwner[openBasedElections.length] = msg.sender;
        openBasedElections.push(address(election));
    }

    // Validates that ballot type and result type are compatible
    function _validateBallotResultCompat(uint _ballotType, uint _resultType) internal pure {
        // BallotType 1 (General) -> ResultType 1 or 2
        // BallotType 2 (Ranked) -> ResultType 1 or 2
        // BallotType 3 (IRV) -> ResultType 3
        // BallotType 4 (Schulze) -> ResultType 4
        // BallotType 5 (Quadratic) -> ResultType 5
        // BallotType 6 (Score) -> ResultType 6
        // BallotType 7 (KemenyYoung) -> ResultType 7
        // BallotType 8 (Moore) -> ResultType 8
        if (_ballotType == 1 || _ballotType == 2) {
            if (_resultType != 1 && _resultType != 2) revert IncompatibleBallotResultType();
        } else if (_ballotType >= 3 && _ballotType <= 8) {
            if (_resultType != _ballotType) revert IncompatibleBallotResultType();
        } else {
            revert IncompatibleBallotResultType();
        }
    }

    function deleteElection(uint _electionId) external {
        if (electionOwner[_electionId] != msg.sender) revert OnlyOwner();
        uint lastElement = openBasedElections.length - 1;
        if (_electionId != lastElement) {
            openBasedElections[_electionId] = openBasedElections[lastElement];
            electionOwner[_electionId] = electionOwner[lastElement];
        }
        openBasedElections.pop();
        delete electionOwner[lastElement];
    }

    function addWhitelistedContract(
        uint64 _sourceChainSelector,
        address _contractAddress
    ) external onlyOwner {
        approvedSenderContracts[_sourceChainSelector] = _contractAddress;
    }

    function removeWhitelistedContract(
        uint64 _sourceChainSelector
    ) external onlyOwner {
        approvedSenderContracts[_sourceChainSelector] = address(0);
    }

    function ccipVote(CCIPVote memory _vote) internal {
        Election _election = Election(_vote.election);
        _election.ccipVote(_vote.user, _vote.voteArr);
    }

    // any2EvmMessage.messageId shows the address of senderContract
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
        if (
            approvedSenderContracts[any2EvmMessage.sourceChainSelector] !=
            abi.decode(any2EvmMessage.sender, (address))
        ) revert NotWhitelistedSender();

        CCIPVote memory _vote = abi.decode(any2EvmMessage.data, (CCIPVote));
        ccipVote(_vote);

        emit MessageReceived(
            any2EvmMessage.messageId,
            any2EvmMessage.sourceChainSelector, // fetch the source chain identifier
            abi.decode(any2EvmMessage.sender, (address)) // abi-decoding of the sender address,
        );
    }

    function getOpenElections() external view returns (address[] memory) {
        return openBasedElections;
    }
}
