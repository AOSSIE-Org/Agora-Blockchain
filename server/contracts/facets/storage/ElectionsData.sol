//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ElectionsData {
    bytes32 constant ELECTIONS_DATA_POSITION =
        keccak256("diamond.standard.elections.data.storage");

    struct Elections {
        address[] elections;
        address[] openBasedElections;
        mapping(address => address[]) inviteBasedElections;
        //election => (organizer =>  bool)
        mapping(address => mapping(address => bool)) isOrganizerAddedToElection;
        //election => organizer
        mapping(address => address) electionOrganizer;
        uint electionCount;
    }

    function electionsStorage() internal pure returns (Elections storage ds) {
        bytes32 position = ELECTIONS_DATA_POSITION;
        assembly {
            ds.slot := position
        }
    }
}
