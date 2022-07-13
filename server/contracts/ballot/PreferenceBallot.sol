// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
import './Ballot.sol';
import '../Candidate.sol';

contract PreferenceBallot is Ballot{
    mapping (Candidate=>uint[])preferences;
    function vote(Candidate _candidate, uint preference) public override{
        // votes[_candidate] += preference;
        preferences[_candidate].push(preference);
    }
}