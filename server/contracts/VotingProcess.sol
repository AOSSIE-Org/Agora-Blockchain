//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
// pragma experimental ABIEncoderV2;

import { Semaphore } from './Semaphore.sol';

contract VotingProcess{
    uint public id;
    string public name;
    string public description;
    bytes[] public proposals;

    mapping (bytes => uint256) public votesPerProposal;

    bytes winningProposal;

    struct VoteProposal {
        bytes proposal;
        uint256 numberOfVotes;
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

    function vote(bytes memory signal) public {
        votesPerProposal[signal] += 1;
    }

    constructor(
        uint _id,
        string memory _name,
        string memory _description,
        bytes[] memory _proposals
    ) public{
        id = _id;
        name = _name;
        description = _description;
        proposals = _proposals;
    }
}