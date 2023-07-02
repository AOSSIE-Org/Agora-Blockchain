// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

//Import ResultCalculators
import './resultCalculator/ResultCalculator.sol';
import './resultCalculator/GeneralResults.sol';
import './resultCalculator/Oklahoma.sol';
import './resultCalculator/BordaResult.sol';
// New ResultCalculators here

contract GetResultCalculator {

    // ------------------------------------------------------------------------------------------------------
    //                                          DEPENDENCIES
    // ------------------------------------------------------------------------------------------------------

    ResultCalculator resultCalculator;

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

    function getResultCalculator(uint _ballotType, uint _resultCalculatorType) external returns(ResultCalculator) {
        // GeneralBallot
        _resultCalculatorType;
        if (_ballotType == 1) {
            resultCalculator = new GeneralResults();
        }
        // PreferenceBallot
        else if (_ballotType == 2) {
            resultCalculator = new Oklahoma();
        }
        // ScoreBallot
        // else if (_ballotType == 3) {
        //     getScoreResultCalculator(_resultCalculatorType);
        // }
        else if (_ballotType == 4) {
            resultCalculator = new BordaResult();
        }
        // New Ballots here
        else {
            resultCalculator = new GeneralResults();
        }
        return resultCalculator;
    }
}