// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {GeneralResult} from "./GeneralResult.sol";
import {IRVResult} from "./IRVResult.sol";
import {IResultCalculator} from "./interface/IResultCalculator.sol";

contract ResultCalculator is GeneralResult, IRVResult, IResultCalculator {
    function getResults(
        bytes calldata returnData,
        uint _resultType
    ) external pure returns (uint) {
        //add pure here
        if (_resultType < 3) {
            // Result for General & Ranked Ballot
            return calculateGeneralResult(returnData);
        } else if (_resultType == 3) {
            // Result for IRV Ballot
            return calculateIRVResult(returnData);
        } else {
            return calculateGeneralResult(returnData);
        }
    }
}
