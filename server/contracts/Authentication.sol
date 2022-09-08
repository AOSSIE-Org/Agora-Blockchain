// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import './ElectionOrganizer.sol';
import './Voter.sol';

contract Authentication {

    /*
        This contract would be to register users on the app.
        Essentially it authenticates a public address to be an election organizer, who can:
            -> who can initiate elections
            -> see election statistics            
    */

    // ------------------------------------------------------------------------------------------------------
    //                                              STATE
    // ------------------------------------------------------------------------------------------------------

    // Tells if a user is authenticated or not;
    mapping(address => bool)userAuthStatus;

    // ------------------------------------------------------------------------------------------------------
    //                                          DEPENDENCIES
    // ------------------------------------------------------------------------------------------------------

    ElectionOrganizer electionOrganizer;
    Voter voter;

    // ------------------------------------------------------------------------------------------------------
    //                                            CONSTRUCTOR
    // ------------------------------------------------------------------------------------------------------

    constructor() {
        electionOrganizer = new ElectionOrganizer();
        voter = new Voter();
    }

    // ------------------------------------------------------------------------------------------------------
    //                                            FUNCTIONS
    // ------------------------------------------------------------------------------------------------------

    function createUser(ElectionOrganizer.OrganizerInfo memory _organizerInfo) public {
        require(getAuthStatus(_organizerInfo.publicAddress) == false, "User already registered");
        userAuthStatus[_organizerInfo.publicAddress] = true;
        electionOrganizer.addElectionOrganizer(_organizerInfo);
    }

    function getElectionOrganizerContract() public view returns(address) {
        return address(electionOrganizer);
    }

    function getVoterContract() public view returns(address) {
        return address(voter);
    }

    function getAuthStatus(address _user) public view returns(bool) {
        return userAuthStatus[_user];
    }

}