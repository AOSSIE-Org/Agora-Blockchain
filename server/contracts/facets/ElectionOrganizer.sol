// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import './votingApp/Election.sol';
import './votingApp/ElectionStorage.sol';
import '../libraries/LibDiamond.sol';
import './ElectionFactory.sol';

contract ElectionOrganizer {

    // ------------------------------------------------------------------------------------------------------
    //                                              STATE
    // ------------------------------------------------------------------------------------------------------
    
    struct OrganizerInfo{
        uint organizerID;
        string name;
        address publicAddress;
    }
    OrganizerInfo[] organizers;
    mapping(address => OrganizerInfo) organizerWithAddress;
    mapping(uint => OrganizerInfo) organizerWithID;
    uint organizerCount=100;

    mapping(address => bool) organizerAuthStatus;

    // ------------------------------------------------------------------------------------------------------
    //                                          DEPENDENCIES
    // ------------------------------------------------------------------------------------------------------

    ElectionStorage electionStorage;
    ElectionFactory electionFactory;

    // ------------------------------------------------------------------------------------------------------
    //                                              EVENTS
    // ------------------------------------------------------------------------------------------------------

    event CreatedElection(address election);
    event CandidateAdded(address election, Election.Candidate candidate);

    // ------------------------------------------------------------------------------------------------------
    //                                            MODIFIERS
    // ------------------------------------------------------------------------------------------------------

    modifier onlyOrganizer() {
        require(organizerAuthStatus[msg.sender],"Only accessible by users regisetered as organizers");
        _;
    }

    modifier onlyCorrespondingOrganizer(address _organizer) {
        require(msg.sender == _organizer, "Only accessible by the corresponding election organizer");
        _;
    }

    // // ------------------------------------------------------------------------------------------------------
    // //                                            CONSTRUCTOR
    // // ------------------------------------------------------------------------------------------------------

    // constructor() {
    //     organizerCount = 100;
    //     electionStorage = new ElectionStorage();
    //     electionFactory = new ElectionFactory();
    // }

    // ------------------------------------------------------------------------------------------------------
    //                                            FUNCTIONS
    // ------------------------------------------------------------------------------------------------------

    function electionOrganizerInit() external {
        electionStorage = new ElectionStorage();
    }

    function getElectionStorage() public view returns(address) {
        return address(electionStorage);
    }

    function getElectionFactory() public view returns(address) {
        return LibDiamond.addressStorage().diamond;        
    }

    function addElectionOrganizer(OrganizerInfo memory _organizerInfo) external {
        uint id = organizerCount + 1;
        _organizerInfo.organizerID = id;
        organizers.push(_organizerInfo);
        organizerWithAddress[_organizerInfo.publicAddress] = _organizerInfo;
        organizerWithID[_organizerInfo.organizerID] = _organizerInfo;
        organizerAuthStatus[_organizerInfo.publicAddress] = true;
        organizerCount++;
    }

    function getElectionOrganizers() public view returns(OrganizerInfo[] memory) {
        return organizers;
    }
    
    function getElectionOrganizerByID(uint _organizerID) public view returns(OrganizerInfo memory) {
        return organizerWithID[_organizerID];
    }

    function getElectionOrganizerByAddress(address _address) public view returns(OrganizerInfo memory) {
        return organizerWithAddress[_address];
    }

    function createElection(Election.ElectionInfo memory _electionInfo, uint _ballotType, uint _resultCalculatorType) public onlyOrganizer returns (address){
        address electionFactoryAddress = LibDiamond.addressStorage().diamond;
        uint id = electionStorage.getElectionCount() + 1;
        _electionInfo.electionID = id;
        ElectionFactory(electionFactoryAddress).getElectionFromFactory(_electionInfo, _ballotType, _resultCalculatorType, msg.sender, address(this));
        // save in ElectionStorage
        address _election = address(LibDiamond.electionStorage().election);
        electionStorage.addElection(_election, msg.sender);
        emit CreatedElection(_election);
    }

    function getElections() public view returns(address[] memory) {
        return electionStorage.getElections();
    }

    function getElectionByID(uint _electionID) public view returns(address) {
        return electionStorage.getElectionByID(_electionID);
    }
    
    // function getElectionByStatus(uint _status) public view returns(Election) {
    //     return electionStorage.getElectionByStatus(_status);
    // }

    function getElectionsOfOrganizer() public view returns(address[] memory) {
        return electionStorage.getElectionsOfOrganizer(msg.sender);
    }

    function addCandidate(Election _election, Election.Candidate memory _candidate)public onlyCorrespondingOrganizer(_election.getElectionOrganizer()) {
        _election.addCandidate(_candidate);
        emit CandidateAdded(address(_election),_candidate);
    }
    
    function getResult(Election _election) public returns(uint[] memory) {
        return _election.getResult();
    }    
}