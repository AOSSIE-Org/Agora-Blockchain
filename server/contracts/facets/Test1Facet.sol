// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import '../libraries/LibDiamond.sol';
import './GetBallot.sol';
import './votingApp/ballot/Ballot.sol';
import './GetResultCalculator.sol';
import './votingApp/resultCalculator/ResultCalculator.sol';
import './ElectionFactory.sol';

contract Test1Facet {
    function setReqBallot() external {
        GetBallot(LibDiamond.addressStorage().diamond).getNewBallot(2);
    }

    function getReqBallot() external view returns (Ballot){
        return LibDiamond.electionStorage().ballot;
    }

    function setReqResult() external {
        GetResultCalculator(LibDiamond.addressStorage().diamond).getNewResultCalculator(2);
    }

    function getReqResult() external view returns (ResultCalculator){
        return LibDiamond.electionStorage().resultCalculator;
    }

    function test1facetelection() external pure returns (LibDiamond.ElectionStorage memory){
        return LibDiamond.electionStorage();
    }
    function test1facetAddress() external pure returns (LibDiamond.AddressStorage memory){
        return LibDiamond.addressStorage();
    }
}