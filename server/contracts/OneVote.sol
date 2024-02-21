//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


import {VotingProcess} from "./VotingProcess.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract OneVote {

    mapping(uint => VotingProcess) public votingProcesses;
    mapping(VotingProcess=>address) public votingProcessAdmins;
    mapping(uint256 => bool) public userAuthStatus; 
    uint private processCounter;
    uint256 private groupId;

    ISemaphore public semaphore;

    constructor(ISemaphore _semaphore,uint256 _groupId) {
        semaphore = ISemaphore(_semaphore);
         // We can increase merkle tree duration by adding a prameter here.
        groupId=_groupId;
        semaphore.createGroup(groupId,32,address(this));
    }

    function addVoter(uint256 identityCommitment) public {
        semaphore.addMember(groupId,identityCommitment);
        userAuthStatus[identityCommitment]=true;
    }

    function getUserAuthStatus(uint256 indentityCommitment) public view returns(bool){
        return userAuthStatus[indentityCommitment];
    }
 
    function vote(
        uint256 _vote,  // candidate id.
        uint256 nullifierHash,
        uint256 pollId,
        uint256 merkleTreeRoot,
        uint256[8] calldata proof
    ) public {
        semaphore.verifyProof(groupId,merkleTreeRoot,_vote,nullifierHash,pollId,proof);
        votingProcesses[pollId].vote(_vote);
    }

    function createVotingProcess(
        string memory _name,
        string memory _description,
        uint _startDate,
        uint _endDate
    ) public {
        address _votingProcessAdmin = msg.sender;
        processCounter += 1;
        VotingProcess vp = new VotingProcess(
            processCounter,
            _name,
            _description,
            _startDate,
            _endDate
        );
        votingProcesses[processCounter] = vp;
        votingProcessAdmins[vp]=_votingProcessAdmin;

    }

    function addCandidate(uint _processId, bytes32 candidate) public {
        votingProcesses[_processId].addCandidate(candidate);
    }

}
