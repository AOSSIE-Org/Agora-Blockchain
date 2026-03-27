// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {GeneralResult} from "./GeneralResult.sol";
import {IRVResult} from "./IRVResult.sol";
import {IResultCalculator} from "./interface/IResultCalculator.sol";
import {CopelandResult} from "./KemenyYoungResult.sol";
import {SchulzeResult} from "./SchulzeResult.sol";
import {MooreResult} from "./MooreResult.sol";

contract ResultCalculator is
    GeneralResult,
    IRVResult,
    IResultCalculator,
    CopelandResult,
    SchulzeResult,
    MooreResult
{
    error InvalidResultType();

    function getResults(
        bytes calldata returnData,
        uint _resultType
    ) external pure returns (uint[] memory) {
        if (_resultType == 1 || _resultType == 2) {
            return calculateGeneralResult(returnData);
        } else if (_resultType == 3) {
            return calculateIRVResult(returnData);
        } else if (_resultType == 4) {
            return calculateSchulzeResult(returnData);
        } else if (_resultType == 5) {
            return calculateGeneralResult(returnData);
        } else if (_resultType == 6) {
            return calculateGeneralResult(returnData);
        } else if (_resultType == 7) {
            return calculateCopelandResult(returnData);
        } else if (_resultType == 8) {
            return calculateMooreResult(returnData);
        } else {
            revert InvalidResultType();
        }
    }
}
