// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './ElectionOrganizer.sol';

contract Authentication {

    /*
        This contract would be to register users on the app.
        Essentially it authenticates a public address to be an election organizer, who can:
            -> who can initiate elections
            -> see election statistics            
    */

    // Tells if a user is authenticated or not;
    mapping(address => bool)userAuthStatus;

    function getAuthStatus(address _user) public view returns(bool) {
        return userAuthStatus[_user];
    }

}
