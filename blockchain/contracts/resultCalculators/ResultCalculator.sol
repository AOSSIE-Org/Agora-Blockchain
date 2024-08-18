// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {GeneralResult} from "./GeneralResult.sol";
import {IRVResult} from "./IRVResult.sol";
import {IResultCalculator} from "./interface/IResultCalculator.sol";
import {KemenyYoungResult} from "./KemenyYoungResult.sol";
import {SchulzeResult} from "./SchulzeResult.sol";
import {MooreResult} from "./MooreResult.sol";

contract ResultCalculator is
    GeneralResult,
    IRVResult,
    IResultCalculator,
    KemenyYoungResult,
    SchulzeResult,
    MooreResult
{
    function getResults(
        bytes calldata returnData,
        uint _resultType
    ) external pure returns (uint[] memory) {
        //add pure here
        if (_resultType < 3) {
            // Result for General & Ranked Ballot
            return calculateGeneralResult(returnData);
        } else if (_resultType == 3) {
            // Result for IRV Ballot
            return calculateIRVResult(returnData);
        } else if (_resultType == 4) {
            // Result for Schulze Ballot
            return calculateSchulzeResult(returnData);
        } else if (_resultType == 5) {
            // Result for Quadratic Ballot
            return calculateGeneralResult(returnData);
        } else if (_resultType == 6) {
            // Result for Score Ballot
            return calculateGeneralResult(returnData);
        } else if (_resultType == 7) {
            // Result for KemenyYoung Ballot
            return calculateKemenyYoungResult(returnData);
        } else if (_resultType == 8) {
            // Result for Moore's Ballot
            return calculateMooreResult(returnData);
        } else {
            return calculateGeneralResult(returnData);
        }
    }
}
