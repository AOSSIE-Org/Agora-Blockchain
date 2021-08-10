// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import './User.sol';

contract MainContract {
    uint public userId = 0;
    struct UserAuth {
        address publicAddress;
        address contractAddress;
    }
    mapping (uint => UserAuth) public Users;

    event userCreated(UserAuth user);

    // Public function to check the registration of users (public address)
    function isRegistered(address _publicAddress) public view returns (uint256[2] memory) {
        uint256[2] memory result = [uint256(0), uint256(0)];
        for(uint i = 0; i < userId; i++) {
            if(_publicAddress == Users[i].publicAddress) {
                result[0] = 1;
                result[1] = i;
                return result;
            }
        }
        return result;
    }

    function createUser (string memory name) public {
        require((isRegistered(msg.sender))[0] == 0, "User already registered!");
        User user = new User(userId, name, msg.sender);
        Users[userId] = UserAuth(msg.sender, address(user));
        emit userCreated(Users[userId]);
        userId++;
    }
}
