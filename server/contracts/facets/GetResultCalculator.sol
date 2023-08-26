// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

//Import ResultCalculators
import './votingApp/resultCalculator/ResultCalculator.sol';
import './votingApp/resultCalculator/GeneralResults.sol';
import './votingApp/resultCalculator/Oklahoma.sol';
import './votingApp/resultCalculator/BordaResult.sol';
import './votingApp/resultCalculator/SchulzeResult.sol';
import './votingApp/resultCalculator/IRVResult.sol';
import './votingApp/resultCalculator/KemenyYoungResult.sol';
// New ResultCalculators here

import '../libraries/LibDiamond.sol';

contract GetResultCalculator {

    // ------------------------------------------------------------------------------------------------------
    //                                          DEPENDENCIES
    // ------------------------------------------------------------------------------------------------------

    ResultCalculator _resultCalculator;

    // // ------------------------------------------------------------------------------------------------------
    // //                                            CONSTRUCTOR
    // // ------------------------------------------------------------------------------------------------------

    // constructor() {
    //     electionOrganizerContract = msg.sender;
    // }

    /*
        Each ballot has specific result calculation algorithms
        So the algorithms specific to the ballots are indexed from 1
         
            For GeneralBallot, say there are algorithms: GeneralResults and Moore
            GeneralResults would be 1
            Moore would be 2

            For PreferenceBallot, now Oklahoma would be 1 again

        Ballot Types and ResultCalcultors

            1 : GeneralBallot
                1 : GeneralResults
                2 : Moore
            
            2 : PreferenceBallot
                1 : Oklahoma
            
            3 : ScoreBallot

            // add new Ballots and ResultCalculators here
    */

    // ------------------------------------------------------------------------------------------------------
    //                                            FUNCTIONS
    // ------------------------------------------------------------------------------------------------------

    function getNewResultCalculator(uint _ballotType) external {
        // GeneralBallot
        if (_ballotType == 1) {
            _resultCalculator = new GeneralResults();
        }
        // PreferenceBallot
        else if (_ballotType == 2) {
            _resultCalculator = new Oklahoma();
        }
        // ScoreBallot
        // else if (_ballotType == 3) {
        //     getScoreResultCalculator(_resultCalculatorType);
        // }
        else if (_ballotType == 4) {
            _resultCalculator = new BordaResult();
        }
        else if (_ballotType == 5) {
            _resultCalculator = new SchulzeResult();
        }
        else if (_ballotType == 4) {
            _resultCalculator = new IRVResult();
        }
        else if (_ballotType == 4) {
            _resultCalculator = new KemenyYoungResult();
        }
        // New Ballots here
        else {
            _resultCalculator = new GeneralResults();
        }
        LibDiamond.electionStorage().resultCalculator = _resultCalculator;
    }
}