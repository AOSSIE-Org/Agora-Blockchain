// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import './Election.sol';

contract ElectionStorage {

    // ------------------------------------------------------------------------------------------------------
    //                                              STATE
    // ------------------------------------------------------------------------------------------------------

    address[] elections;
    mapping(Election.Status=>address[]) electionsWithStatus;
    mapping(address=>address[]) electionsOfOrganizer;
    mapping(uint => address) electionWithID;

    uint electionCount;

    // ------------------------------------------------------------------------------------------------------
    //                                            CONSTRUCTOR
    // ------------------------------------------------------------------------------------------------------

    constructor() {
        electionCount = 1000;
    }

    // ------------------------------------------------------------------------------------------------------
    //                                            FUNCTIONS
    // ------------------------------------------------------------------------------------------------------

    function getElectionCount() public view returns(uint){
        return electionCount;
    }

    function getElections() public view returns(address[] memory) {
        return elections;
    }

    // function getElectionByStatus(uint _status) public view returns(Election) {
    //     /*
    //         1 : Active
    //         2 : Pending
    //         3 : Closed
    //     */
    //     // if (_status == 1) {
    //     //     
    //     // } 
    // }

    function getElectionByID(uint _electionID) public view returns(address) {
        return electionWithID[_electionID];
    }

    function getElectionsOfOrganizer(address _organizer)public view returns(address[] memory){
        return electionsOfOrganizer[_organizer];
    }
    function addElection(Election _election, address _organizer)external{
        electionCount++;
        elections.push(address(_election));
        electionsOfOrganizer[_organizer].push(address(_election));
        electionWithID[_election.getElectionInfo().electionID] = address(_election);
    }
}