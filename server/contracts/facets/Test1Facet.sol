// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Test2Facet.sol';

contract Test1Facet {
    event TestEvent(address something);
    string name;
    Test2Facet test2facet;

    function getName() external view returns (string memory){
        return name;
    }

    function setName(string memory _name) external {
        name = _name;
    }

    function getNewFacet() external returns (address) {
        test2facet = new Test2Facet();
        return address(test2facet);
    }

    function getString() external view returns (string memory){
        return test2facet.getString();
    }
}