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
    function generateBallot(
        uint _ballotType,
        address _electionAddress
    ) public returns (address) {
        if (_ballotType == 1) {
            // General Ballot
            return address(new GeneralBallot(_electionAddress));
        }
        if (_ballotType == 2) {
            // Ranked Ballot
            return address(new RankedBallot(_electionAddress));
        }
        if (_ballotType == 3) {
            // IRV Ballot
            return address(new IRV(_electionAddress));
        }
        if (_ballotType == 4) {
            // Schulze Ballot
            return address(new SchulzeBallot(_electionAddress));
        }
        if (_ballotType == 5) {
            // Quadratic Ballot
            return address(new QuadraticBallot(_electionAddress));
        }
        if (_ballotType == 6) {
            // Score Ballot
            return address(new ScoreBallot(_electionAddress));
        }
        if (_ballotType == 7) {
            // KemenyYoung Ballot
            return address(new KemenyYoungBallot(_electionAddress));
        }
        return address(new GeneralBallot(_electionAddress));
    }
}
