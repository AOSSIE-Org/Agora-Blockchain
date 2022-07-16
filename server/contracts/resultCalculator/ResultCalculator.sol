// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import '../ballot/Ballot.sol';
import '../Candidate.sol';

interface ResultCalculator {

    function getResult(Ballot,uint) external returns(Candidate[] memory);
    
}

// uint is voter count