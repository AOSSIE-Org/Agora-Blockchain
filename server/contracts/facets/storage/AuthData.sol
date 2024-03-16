//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuthData {
    bytes32 constant USER_AUTH_POSITION =
        keccak256("diamond.standard.userauth.storage");

    struct AuthStorage {
        mapping(address => bool) userAuthStatus;
        mapping(address => mapping(string => bool)) isloggedIn;
    }

    function userStorage() internal pure returns (AuthStorage storage ds) {
        bytes32 position = USER_AUTH_POSITION;
        assembly {
            ds.slot := position
        }
    }

    function authStatus(address _user) internal view returns (bool) {
        AuthStorage storage _store = userStorage();
        return _store.userAuthStatus[_user];
    }

    function loginStatus(
        address _user,
        string calldata _password
    ) internal view returns (bool) {
        AuthStorage storage _store = userStorage();
        return _store.isloggedIn[_user][_password];
    }
}
