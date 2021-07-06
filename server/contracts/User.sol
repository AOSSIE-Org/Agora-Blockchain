// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import './Election.sol';

contract User {
    address public userPublicAddress;

    constructor(address _userPublicAddress) public {
	userPublicAddress = _userPublicAddress;
    }
    event electionCreated(address election);
    uint public electionId = 0;
    uint public electionCount=0;
    mapping (uint => address) public Elections;

    function createElection (string[] memory _nda, uint[] memory _se) public  {
	require(msg.sender == userPublicAddress, "Can't create election using other's contract");
        Election election = new Election(_nda, _se);
        electionId++;
        electionCount++;
        Elections[electionId] = address(election);
        emit electionCreated(Elections[electionId]);
    }

}
