// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;
import {Errors} from "./Errors.sol";
interface IResultCalculator is Errors {
    function getResults(
        bytes calldata returnData,
        uint _resultType
    ) external returns (uint[] memory);
}
