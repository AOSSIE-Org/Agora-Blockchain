// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import './User.sol';

contract MainContract {
   uint public userId = 0;
   mapping (uint => address) public Users;
   event userCreated(address user);
   function createUser () public  {
       User user = new User(msg.sender);
       userId++;
       Users[userId] = address(user);
       emit userCreated(Users[userId]);
   }
}
