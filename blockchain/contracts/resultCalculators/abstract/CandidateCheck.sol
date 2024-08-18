// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {Errors} from "../interface/Errors.sol";

abstract contract Candidatecheck is Errors {
    function checkEdgeCases(
        uint candidatesLength
    ) internal pure returns (uint[] memory) {
        if (candidatesLength == 0) {
            revert NoWinner();
        } else {
            uint[] memory singleWinner = new uint[](1);
            singleWinner[0] = 0;
            return singleWinner;
        }
    }
}
