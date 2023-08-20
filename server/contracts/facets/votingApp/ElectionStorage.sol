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
    //election => organizer
    mapping(address => address) electionOrganizer;
    uint electionCount;


    // mapping(Election.Status=>address[]) electionsWithStatus;
    // mapping(address=>address[]) electionsOfOrganizer;
    // mapping(uint => address) electionWithID;

    // // ------------------------------------------------------------------------------------------------------
    // //                                            CONSTRUCTOR
    // // ------------------------------------------------------------------------------------------------------

    // constructor() {
    //     electionCount = 1000;
    // }

    // ------------------------------------------------------------------------------------------------------
    //                                            FUNCTIONS
    // ------------------------------------------------------------------------------------------------------

    function getElectionOwner (address _election) public view returns(address) {
        return electionOrganizer[_election];
    }

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
        electionOrganizer[election] = _organizer;
    }

    function removeElection(address[] memory _elections, address  _election) public pure returns(address[] memory) {

    }

    function deleteElection (address _election) external {
        Election election = Election(_election);
        require(election.getStatus() == Election.Status.pending, "Cannot delete election after election has started");

        address[] memory oldElection = openBasedElections;
        uint len = oldElection.length;
        address[] memory newElection = new address[](len-1);
        uint newIndex = 0;
        uint currIndex = 0;
        bool electionFound =false;

        for(currIndex=0; currIndex<len; currIndex++){
            if(oldElection[currIndex] != _election){
                newElection[newIndex] = oldElection[currIndex];
                newIndex++;
            }
            else if(electionFound == false){
                _election = address(0);
                electionFound = true;
            }
        }

        require(electionFound, "Election not found");
        openBasedElections = newElection;
    }

    function addOrganizerToInviteBasedElection(address _addOrganizer, address _election) external {
        require(isOrganizerAddedToElection[_election][_addOrganizer] == false, "Organizer already added to this election");
        isOrganizerAddedToElection[_election][_addOrganizer] = true;
        inviteBasedElections[_addOrganizer].push(_election);
    }
}