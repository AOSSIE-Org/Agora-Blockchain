//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
// pragma experimental ABIEncoderV2;

import { Semaphore } from './Semaphore.sol';

contract VotingProcess{
    uint public id;
    string public name;
    string public description;
    uint startDate;
    uint endDate;
    
    bytes[] public proposals;

    mapping (bytes => uint256) public votesPerProposal;

    bytes winningProposal;


    enum Status {
        active,
        pending,
        closed
    }

    struct VoteProposal {
        bytes proposal;
        uint256 numberOfVotes;
    }

    function getStatus() public view returns (Status) {

        if(block.timestamp < startDate) {
            return Status.pending;
        } 
        
        else if(block.timestamp < endDate) {
            return Status.active;
        } 
        
        else {
            return Status.closed;
        }
    }

    function getProposals() view public returns (bytes[] memory){
        return proposals;
    }

    function getVotesPerProposal() view public returns (VoteProposal[] memory){
        uint256 i = 0;
        VoteProposal[] memory returnVotes = new VoteProposal[](proposals.length);

        for(i; i < proposals.length; i++){
            returnVotes[i] = VoteProposal({
                proposal: proposals[i],
                numberOfVotes: votesPerProposal[proposals[i]]
            });
        }
        return returnVotes;
    }
    function getWinningProposal() view public returns (VoteProposal memory){

    require(getStatus() == Status.closed, "Results are declared only after the election ends");

        uint256 i = 0;
        VoteProposal memory winningVote;
        winningVote.numberOfVotes = 0;

        for(i; i < proposals.length; i++){
            if(votesPerProposal[proposals[i]] > winningVote.numberOfVotes){
                winningVote.proposal = proposals[i];
                winningVote.numberOfVotes = votesPerProposal[proposals[i]];
            }
        }
        return winningVote;
    }
    function getStartDate() view public returns (uint){
        return startDate;
    }
    function getEndDate() view public returns (uint){
        return endDate;
    }

    function vote(bytes memory signal) public {
        require(getStatus() == Status.active, "Election needs to be active to vote");
        votesPerProposal[signal] += 1;
    }
    function addProposal(bytes memory _proposal) public {
        require(getStatus() == Status.pending, "Election needs to be pending to add proposals");
        proposals.push(_proposal);
    }

    constructor(
        uint _id,
        string memory _name,
        string memory _description,
        uint _startDate,
        uint _endDate
    ) public{
        id = _id;
        name = _name;
        description = _description;
        startDate = _startDate;
        endDate = _endDate;
    }
}