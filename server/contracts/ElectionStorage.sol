// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Election.sol';

contract ElectionStorage {
    Election[] contracts;
    mapping(Election.Status=>Election[]) activeElections;
    mapping(address=>Election[]) addressToElections;  // change name
    function addContract(Election _contract)public{
        contracts.push(_contract);
    }
}