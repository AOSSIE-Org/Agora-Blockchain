// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

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

    function createElection (string[] memory _nda, uint[] memory _se) public {
	    require(msg.sender == info.publicAddress, "Can't create election using other's contract");
        Election election = new Election(electionId, _nda, _se, msg.sender);
        Elections[electionId] = address(election);
        emit electionCreated(Elections[electionId]);
        electionId++;
    }

    function getInfo() public view returns (Info memory) {
        return info;
    }

    function getStatistics() public view returns(uint[] memory) {

        uint[] memory _statistics = new uint[](4); //Creating an array of analytics

        /**
        * The index-value pair is:
        * 0 - total elections
        * 1 - active elections
        * 2 - closed elections
        * 4 - pending elections
        */

        //Set the electionId as the total number of elections held
        _statistics[0] = electionId;

        //Iterate over the map of elections and check their status
        for(uint i = 0; i < electionId; i++){
            Election election = Election(Elections[i]);
            Election.Status status = election.getStatus();

            if(status == Election.Status.active){
                _statistics[1] += 1;
            }else if(status == Election.Status.closed){
                _statistics[2] += 1;
            }else{
                _statistics[3] += 1;
            }
        }

        return _statistics;
    }
}
