// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Errors} from "./Errors.sol";
interface IBallot is Errors {
    function init(uint) external;

    // Eg 3 candidates A,B,C contest , then if i want to vote C in general ballot my voteArr will be [0,0,1] and if i want to rank them in ranked & irv as B > C >A . [1,2,0]

    function vote(uint[] memory) external;
}
