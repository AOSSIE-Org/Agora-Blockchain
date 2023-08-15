// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import '../Election.sol';

contract ElectionStorage {

    // ------------------------------------------------------------------------------------------------------
    //                                              STATE
    // ------------------------------------------------------------------------------------------------------

    address[] elections;
    address[] openBasedElections;
    mapping(address => address[]) inviteBasedElections;
    //election => (organizer =>  bool)
    mapping(address => mapping(address => bool)) isOrganizerAddedToElection;
    // mapping(Election.Status=>address[]) electionsWithStatus;
    // mapping(address=>address[]) electionsOfOrganizer;
    // mapping(uint => address) electionWithID;
    uint electionCount;

    // // ------------------------------------------------------------------------------------------------------
    // //                                            CONSTRUCTOR
    // // ------------------------------------------------------------------------------------------------------

    // constructor() {
    //     electionCount = 1000;
    // }

    // ------------------------------------------------------------------------------------------------------
    //                                            FUNCTIONS
    // ------------------------------------------------------------------------------------------------------

    function getElectionCount() public view returns(uint){
        return electionCount;
    }

    function getOpenBasedElections() public view returns(address[] memory) {
        return openBasedElections;
    }

    function getInviteBasedElections(address _organizer) public view returns (address[] memory){
        return inviteBasedElections[_organizer];
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

    // function getElectionByID(uint _electionID) public view returns(address) {
    //     return electionWithID[_electionID];
    // }

    // function getElectionsOfOrganizer(address _organizer)public view returns(address[] memory){
    //     return electionsOfOrganizer[_organizer];
    // }
    
    // function addElection(address election, address _organizer)external{
    //     Election _election = Election(election);
    //     electionCount++;
    //     elections.push(address(_election));
    //     electionsOfOrganizer[_organizer].push(address(_election));
    //     electionWithID[_election.getElectionInfo().electionID] = address(_election);
    // }

    function addElection(address election, address _organizer)external{
        Election _election = Election(election);
        electionCount++;
        bool _electionType = _election.getElectionInfo().electionType;
        if(_electionType == true){
            openBasedElections.push(address(_election));
        }
        else{
            inviteBasedElections[_organizer].push(address(_election));
            isOrganizerAddedToElection[election][_organizer] = true;
        }
    }

    function addOrganizerToInviteBasedElection(address _organizer, address _election) external{
        require(isOrganizerAddedToElection[_election][_organizer] == false, "Organizer already added to this election");
        isOrganizerAddedToElection[_election][_organizer] = true;
    }
}