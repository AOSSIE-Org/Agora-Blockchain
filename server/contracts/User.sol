// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import './Election.sol';

contract User {
    struct Info {
        uint userId;
        string name;
        address publicAddress;
    }

    Info public info;

    constructor(uint _userId, string memory _name, address _publicAddress) {
	    info = Info(_userId, _name, _publicAddress);
    }

    event electionCreated(address election);

    uint public electionId = 0;
    mapping (uint => address) public Elections;

    function createElection (string[] memory _nda, uint[] memory _se) public  {
	    require(msg.sender == info.publicAddress, "Can't create election using other's contract");
        Election election = new Election(_nda, _se);
        electionId++;
        Elections[electionId] = address(election);
        emit electionCreated(Elections[electionId]);
    }
}
