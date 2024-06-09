// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {GeneralBallot} from "./GeneralBallot.sol";
import {IRV} from "./IRV.sol";
import {RankedBallot} from "./RankedBallot.sol";

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
        return address(new GeneralBallot(_electionAddress));
    }
}
