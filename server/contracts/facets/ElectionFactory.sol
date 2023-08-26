// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import './votingApp/Election.sol';
import './votingApp/ballot/Ballot.sol';
import './votingApp/resultCalculator/ResultCalculator.sol';
import '../libraries/LibDiamond.sol';
import './GetBallot.sol';
import './GetResultCalculator.sol';

contract ElectionFactory {

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

    function getElectionFromFactory(Election.ElectionInfo memory _electionInfo, uint _ballotType, uint _resultCalculatorType, address _electionOrganizer, address _electionOrganizerContract) external  {
        Election _election;
        address diamond = LibDiamond.addressStorage().diamond;
        GetBallot(diamond).getNewBallot(_ballotType);
        GetResultCalculator(diamond).getNewResultCalculator(_ballotType);   
        LibDiamond.ElectionStorage memory es = LibDiamond.electionStorage();     
        _election = new Election(_electionInfo, es.ballot, es.resultCalculator, _electionOrganizer, _electionOrganizerContract, _ballotType);
        LibDiamond.electionStorage().election = _election;
    }

}