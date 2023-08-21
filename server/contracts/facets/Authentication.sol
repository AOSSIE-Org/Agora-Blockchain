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
    mapping(address => bool) isloggedIn;

    // ------------------------------------------------------------------------------------------------------
    //                                          DEPENDENCIES
    // ------------------------------------------------------------------------------------------------------

    ElectionOrganizer electionOrganizer;
    Voter voter;

    // ------------------------------------------------------------------------------------------------------
    //                                            CONSTRUCTOR
    // ------------------------------------------------------------------------------------------------------

    // constructor() {
    //     electionOrganizer = new ElectionOrganizer();
    //     voter = new Voter();
    // }

    // ------------------------------------------------------------------------------------------------------
    //                                            FUNCTIONS
    // ------------------------------------------------------------------------------------------------------

    function init(address _diamond) external {
        LibDiamond.addressStorage().diamond = _diamond;
        electionOrganizer =  ElectionOrganizer(_diamond);
        electionOrganizer.electionOrganizerInit();
        voter = Voter(_diamond);   
    }

    function createUser(ElectionOrganizer.OrganizerInfo memory _organizerInfo) public {
        require(getAuthStatus(_organizerInfo.publicAddress) == false, "User already registered");
        userAuthStatus[_organizerInfo.publicAddress] = true;
        electionOrganizer.addElectionOrganizer(_organizerInfo);
        isloggedIn[_organizerInfo.publicAddress] = true;
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

    function getLoggedInStatus(address _user) public view returns (bool) {
        return isloggedIn[_user];
    }

    function logout(address _user) public returns (bool) {
        require(userAuthStatus[_user] == true, 'User should authenticate before login');
        require(isloggedIn[_user] == true, 'User already Logged Out');
        isloggedIn[_user] = false;
        return isloggedIn[_user];
    }

    function login(address _user) public returns (bool){
        require(userAuthStatus[_user] == true, 'User should authenticate before login');
        require(isloggedIn[_user] == false, 'User already Logged In');
        isloggedIn[_user] = true;
        return isloggedIn[_user];
    }

    function getElectionOrganizer() public view returns(ElectionOrganizer.OrganizerInfo[] memory){
        return electionOrganizer.getElectionOrganizers();
    }
}
