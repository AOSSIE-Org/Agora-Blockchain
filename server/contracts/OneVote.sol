//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
// pragma experimental ABIEncoderV2;

import { VotingProcess } from './VotingProcess.sol';
import { Semaphore } from './Semaphore.sol';
import './Election.sol';
import './ElectionStorage.sol';
import './ElectionFactory.sol';

contract OneVote {
    mapping(uint => VotingProcess) public votingProcesses;
    mapping(uint256 => bool)userAuthStatus;
    uint processCounter;

    uint256[] public identityCommitments;

    // A mapping of all signals broadcasted
    mapping (uint256 => bytes) public signalIndexToSignal;

    // A mapping between signal indices to external nullifiers
    mapping (uint256 => uint256) public signalIndexToExternalNullifier;

    mapping (uint232 => bytes[]) public signalsForNullifier;

    // The next index of the `signalIndexToSignal` mapping
    uint256 public nextSignalIndex = 0;

    Semaphore public semaphore;

    event SignalBroadcastByClient(uint256 indexed signalIndex);


    function getNextSignalIndex() public view returns (uint256) {
        return nextSignalIndex;
    }

    function getIdentityCommitments() public view returns (uint256 [] memory) {
        return identityCommitments;
    }

    function getIdentityCommitment(uint256 _index) public view returns (uint256) {
        return identityCommitments[_index];
    }

    event IdentityCommitment(uint256 indexed identityCommitment);

    function insertIdentityAsClient(uint256 _leaf) public {
        semaphore.insertIdentity(_leaf);
        identityCommitments.push(_leaf);
        userAuthStatus[_leaf] = true;
        emit IdentityCommitment(_leaf);
    }
    function getAuthStatus(uint256 _leaf) public view returns(bool) {
        return userAuthStatus[_leaf];
    }

    function addExternalNullifier(uint232 _externalNullifier) public {
        semaphore.addExternalNullifier(_externalNullifier);
    }

    constructor(Semaphore _semaphore) public {
        semaphore = _semaphore;
    }

    event Rooot(uint256 root);

    function vote(
        bytes memory _signal,
        uint256[8] memory _proof,
        uint256 _root,
        uint256 _nullifiersHash,
        uint232 _externalNullifier  //processId
    ) public {
        // bool exist = false;
        // bytes[] memory proposals = votingProcesses[_externalNullifier].getProposals();
        // for(uint i = 0; i < proposals.length; i ++){
        //     bytes memory proposal = proposals[i];
        //     if (keccak256(abi.encodePacked((_signal))) == keccak256(abi.encodePacked((proposal)))){
        //         exist = true;
        //         break;
        //     }
        // }
        // require(exist == true, "You need to choose one of the voting options!");

        uint256 signalIndex = nextSignalIndex;

        // store the signal
        signalIndexToSignal[nextSignalIndex] = _signal;

        // map the the signal index to the given external nullifier
        signalIndexToExternalNullifier[nextSignalIndex] = _externalNullifier;

        signalsForNullifier[_externalNullifier].push(_signal);

        votingProcesses[_externalNullifier].vote(_signal);

        // increment the signal index
        nextSignalIndex ++;

        emit Rooot(_root);

        // broadcast the signal
        semaphore.broadcastSignal(_signal, _proof, _root, _nullifiersHash, _externalNullifier);

        emit SignalBroadcastByClient(signalIndex);
    }

    /*
     * Returns the external nullifier which a signal at _index broadcasted to
     * @param _index The index to use to look up the signalIndexToExternalNullifier mapping
     */
    function getExternalNullifierBySignalIndex(uint256 _index) public view returns (uint256) {
        return signalIndexToExternalNullifier[_index];
    }

    function getSignalBySignalIndex(uint256 _index) public view returns (bytes memory) {
        return signalIndexToSignal[_index];
    }

    struct ProcessDTO {
        uint id;
        string name;
        string description;
        bytes[] proposals;
        uint startDate;
        uint endDate;
    }

    function createVotingProcess(
        string memory _name,
        string memory _description,
        bytes[] memory _proposals,
        uint _startDate,
        uint _endDate
    ) public {
        require(_proposals.length > 1, "There need to be at least 2 proposals");
        //add new voting proposal
        VotingProcess vp = new VotingProcess(processCounter, _name, _description, _proposals, _startDate, _endDate);

        addExternalNullifier(uint232(processCounter));

        votingProcesses[processCounter] = vp;
        processCounter += 1;
    }

    function getProcesses() public view returns(ProcessDTO[] memory){
        uint256 i = 0;
        ProcessDTO[] memory returnProcesses = new ProcessDTO[](processCounter);

        for(i; i < processCounter; i++){
            returnProcesses[i] = ProcessDTO({
                id: votingProcesses[i].id(),
                name: votingProcesses[i].name(),
                description: votingProcesses[i].description(),
                proposals: votingProcesses[i].getProposals(),
                startDate: votingProcesses[i].getStartDate(),
                endDate: votingProcesses[i].getEndDate()
            });
        }

        return returnProcesses;
    }

    function getProcess(uint id) public view returns (ProcessDTO memory){
        VotingProcess votingProcess = votingProcesses[id];
        return ProcessDTO({
            id: votingProcess.id(),
            name: votingProcess.name(),
            description: votingProcess.description(),
            proposals: votingProcess.getProposals(),
            startDate: votingProcess.getStartDate(),
            endDate: votingProcess.getEndDate()
        });
    }

    function getRoots() public view returns (uint256[10] memory){
        return semaphore.getRoots();
    }

    function getRootHistory(uint256 id) public view returns (bool){
        return semaphore.rootHistory(id);
    }

}