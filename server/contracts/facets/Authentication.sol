// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "./ElectionOrganizer.sol";
import "./Voter.sol";
import "./storage/AuthData.sol";

contract Authentication is AuthData {
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
    // mapping(address => bool)userAuthStatus;
    // mapping(address => mapping(string => bool)) isloggedIn;

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
        electionOrganizer = ElectionOrganizer(_diamond);
        electionOrganizer.electionOrganizerInit();
        voter = Voter(_diamond);
    }

    function createUser(
        ElectionOrganizer.OrganizerInfo memory _organizerInfo,
        string memory hashedPassword
    ) public {
        require(
            getAuthStatus(_organizerInfo.publicAddress) == false,
            "User already registered"
        );
        AuthStorage storage _store = userStorage();
        _store.userAuthStatus[_organizerInfo.publicAddress] = true;
        electionOrganizer.addElectionOrganizer(_organizerInfo);
        _store.isloggedIn[_organizerInfo.publicAddress][hashedPassword] = true;
    }

    function getElectionOrganizerContract() public view returns (address) {
        return address(electionOrganizer);
    }

    function getVoterContract() public view returns (address) {
        return address(voter);
    }

    function getAuthStatus(address _user) public view returns (bool) {
        return authStatus(_user);
    }

    function getLoggedInStatus(
        address _user,
        string calldata hashedPassword
    ) public view returns (bool) {
        return loginStatus(_user, hashedPassword);
    }

    function getElectionOrganizer()
        public
        view
        returns (ElectionOrganizer.OrganizerInfo[] memory)
    {
        return electionOrganizer.getElectionOrganizers();
    }
}
