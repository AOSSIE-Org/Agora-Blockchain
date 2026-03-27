// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {GeneralBallot} from "./GeneralBallot.sol";
import {IRV} from "./IRV.sol";
import {RankedBallot} from "./RankedBallot.sol";
import {QuadraticBallot} from "./QuadraticBallot.sol";
import {ScoreBallot} from "./ScoreBallot.sol";
import {KemenyYoungBallot} from "./KemenyYoungBallot.sol";
import {SchulzeBallot} from "./SchulzeBallot.sol";
contract BallotGenerator {
    error InvalidBallotType();

    function generateBallot(
        uint _ballotType,
        address _electionAddress
    ) public returns (address) {
        if (_ballotType == 1) {
            return address(new GeneralBallot(_electionAddress));
        }
        if (_ballotType == 2) {
            return address(new RankedBallot(_electionAddress));
        }
        if (_ballotType == 3) {
            return address(new IRV(_electionAddress));
        }
        if (_ballotType == 4) {
            return address(new SchulzeBallot(_electionAddress));
        }
        if (_ballotType == 5) {
            return address(new QuadraticBallot(_electionAddress));
        }
        if (_ballotType == 6) {
            return address(new ScoreBallot(_electionAddress));
        }
        if (_ballotType == 7) {
            return address(new KemenyYoungBallot(_electionAddress));
        }
        if (_ballotType == 8) {
            return address(new GeneralBallot(_electionAddress));
        }
        revert InvalidBallotType();
    }
}
