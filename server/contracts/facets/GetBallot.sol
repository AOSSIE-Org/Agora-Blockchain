// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;


// Import Ballots
import './votingApp/ballot/Ballot.sol';
import './votingApp/ballot/GeneralBallot.sol';
import './votingApp/ballot/PreferenceBallot.sol';
import './votingApp/ballot/BordaBallot.sol';
import './votingApp/ballot/Schulze.sol';
import './votingApp/ballot/InstantRunOff.sol';
import './votingApp/ballot/KemenyYoung.sol';
//New Ballot

import '../libraries/LibDiamond.sol';

contract GetBallot {

    // ------------------------------------------------------------------------------------------------------
    //                                          DEPENDENCIES
    // ------------------------------------------------------------------------------------------------------

    Ballot _ballot;

    // ------------------------------------------------------------------------------------------------------
    //                                              STATE
    // ------------------------------------------------------------------------------------------------------

    address electionOrganizerContract;

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


    function getNewBallot(uint _ballotType) external {
        /*
            1: GenralBallot
            2: PreferenceBallot
            3: ScoreBallot
            // new Ballots
            default: GeneralBallot
        */
        if (_ballotType == 1) {
            _ballot = new GeneralBallot();
        }
        else if (_ballotType == 2) {
            _ballot = new PreferenceBallot();
        }
        else if (_ballotType == 3) {
            // ballot = new ScoreBallot();
        }
        else if (_ballotType == 4) {
            _ballot = new BordaBallot();
        }
        else if (_ballotType == 5) {
            _ballot = new SchulzeBallot();
        }
        else if (_ballotType == 6) {
            _ballot = new IRV();
        }
        else if (_ballotType == 7) {
            _ballot = new KemenyYoung();
        }
        // New Ballots here
        else {
            _ballot = new GeneralBallot();
        }
        LibDiamond.electionStorage().ballot = _ballot;
    }
}