// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import './Election.sol';

// Import Ballots
import './ballot/Ballot.sol';
import './ballot/GeneralBallot.sol';
import './ballot/PreferenceBallot.sol';
// import './ballot/ScoreBallot.sol';
// New Ballots here

//Import ResultCalculators
import './resultCalculator/ResultCalculator.sol';
import './resultCalculator/GeneralResults.sol';
import './resultCalculator/Oklahoma.sol';
// New ResultCalculators here

contract ElectionFactory {

    // ------------------------------------------------------------------------------------------------------
    //                                          DEPENDENCIES
    // ------------------------------------------------------------------------------------------------------

    Ballot ballot;
    ResultCalculator resultCalculator;

    // ------------------------------------------------------------------------------------------------------
    //                                              STATE
    // ------------------------------------------------------------------------------------------------------

    address electionOrganizerContract;

    // ------------------------------------------------------------------------------------------------------
    //                                            MODIFIERS
    // ------------------------------------------------------------------------------------------------------

    modifier onlyOrganizerContract() {
        require(msg.sender == electionOrganizerContract,"Must be called from the election organizer contract");
        _;
    }  

    // ------------------------------------------------------------------------------------------------------
    //                                            CONSTRUCTOR
    // ------------------------------------------------------------------------------------------------------

    constructor() {
        electionOrganizerContract = msg.sender;
    }

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

    function getElection(Election.ElectionInfo memory _electionInfo, uint _ballotType, uint _resultCalculatorType, address _electionOrganizer, address _electionOrganizerContract) external onlyOrganizerContract returns(Election) {
        Election election;
        getBallot(_ballotType);
        getResultCalculator(_ballotType, _resultCalculatorType);
        election = new Election(_electionInfo,ballot,resultCalculator,_electionOrganizer,_electionOrganizerContract);
        return election;
    }

    function getBallot(uint _ballotType) internal returns(Ballot) {
        /*
            1: GenralBallot
            2: PreferenceBallot
            3: ScoreBallot
            // new Ballots
            default: GeneralBallot
        */
        if (_ballotType == 1) {
            ballot = new GeneralBallot();
        }
        else if (_ballotType == 2) {
            ballot = new PreferenceBallot();
        }
        else if (_ballotType == 3) {
            // ballot = new ScoreBallot();
        }
        // New Ballots here
        else {
            ballot = new GeneralBallot();
        }

        return ballot;
    }

    function getResultCalculator(uint _ballotType, uint _resultCalculatorType) internal returns(ResultCalculator) {
        // GeneralBallot
        if (_ballotType == 1) {
            getGeneralResultCalculator(_resultCalculatorType);
        }
        // PreferenceBallot
        else if (_ballotType == 2) {
            getPreferenceResultCalculator(_resultCalculatorType);
        }
        // ScoreBallot
        else if (_ballotType == 3) {
            getScoreResultCalculator(_resultCalculatorType);
        }
        // New Ballots here
        else {
            getGeneralResultCalculator(_resultCalculatorType);
        }

        return resultCalculator;
    }

    // ResultCalculator for GeneralBallot
    function getGeneralResultCalculator(uint _generalResultCalculatorType) internal {
        if (_generalResultCalculatorType == 1) {
            resultCalculator = new GeneralResults();
        }
        // new ResultCalculator for GeneralBallot here
        else {
            resultCalculator = new GeneralResults();
        }
    }

    // ResultCalculator for PreferenceBallot
    function getPreferenceResultCalculator(uint _preferenceResultCalculatorType) internal {
        if (_preferenceResultCalculatorType == 1) {
            resultCalculator = new Oklahoma();
        }
        // new ResultCalculator for PreferenceBallot here
        else {
            resultCalculator = new Oklahoma();
        }
    }

    // ResultCalculator for ScoreBallot
    function getScoreResultCalculator(uint _scoreResultCalculatorType) internal {
        // if (_scoreResultCalculatorType == 1) {
        //     resultCalculator = new ScoreResults();
        // }
        // // new ResultCalculator for ScoreBallot here
        // else {
        //     resultCalculator = new ScoreResults();
        // }
    }

    // New ResultCalculators here

}