// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import '../ballot/Ballot.sol';


interface ResultCalculator {

    function getResult(Ballot _ballot,uint _voterCount) external returns(uint[] memory);
    
}