// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;


// Import Ballots
import './ballot/Ballot.sol';
import './ballot/GeneralBallot.sol';
import './ballot/PreferenceBallot.sol';
import './ballot/BordaBallot.sol';
//New Ballot

contract GetBallot {

    // ------------------------------------------------------------------------------------------------------
    //                                          DEPENDENCIES
    // ------------------------------------------------------------------------------------------------------

    Ballot ballot;

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

    function getBallot(uint _ballotType) external returns(Ballot) {
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
        else if (_ballotType == 4) {
            ballot = new BordaBallot();
        }
        // New Ballots here
        else {
            ballot = new GeneralBallot();
        }

        return ballot;
    }
}