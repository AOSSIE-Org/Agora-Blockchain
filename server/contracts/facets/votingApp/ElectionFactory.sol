// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import './Election.sol';
import './GetBallot.sol';
import './ballot/Ballot.sol';
import './GetResultCalculator.sol';
import './resultCalculator/ResultCalculator.sol';

contract ElectionFactory {

    // ------------------------------------------------------------------------------------------------------
    //                                          DEPENDENCIES
    // ------------------------------------------------------------------------------------------------------

    Ballot ballot;
    ResultCalculator resultCalculator;
    GetBallot contractGetBallot;
    GetResultCalculator contractGetResultCalculator;

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

    function init() external {
        electionOrganizerContract = msg.sender;
    }


    function getElection(Election.ElectionInfo memory _electionInfo, uint _ballotType, uint _resultCalculatorType, address _electionOrganizer, address _electionOrganizerContract) external onlyOrganizerContract returns(Election) {
        Election election;
        ballot = contractGetBallot.getBallot(_ballotType);
        resultCalculator = contractGetResultCalculator.getResultCalculator(_ballotType, _resultCalculatorType);
        election = new Election();
        election.init(_electionInfo, ballot, resultCalculator, _electionOrganizer, _electionOrganizerContract, _ballotType);
        return election;
    }
}