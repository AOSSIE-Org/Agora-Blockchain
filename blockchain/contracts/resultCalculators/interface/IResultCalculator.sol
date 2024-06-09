// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IResultCalculator {
    function getResults(
        bytes calldata returnData,
        uint _resultType
    ) external returns (uint);
}
