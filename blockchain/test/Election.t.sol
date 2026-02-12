// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test, console} from 'forge-std/Test.sol';
import {ElectionFactory} from '../contracts/ElectionFactory.sol';
import {Election} from '../contracts/Election.sol';

contract ElectionTest is Test {
  ElectionFactory public factory;
  address public owner;
  address public voter1;
  address public voter2;
  address public voter3;
  address public voter4;
  address public voter5;
  address public router;

  Election.ElectionInfo public mockElectionInfo;
  Election.Candidate[] public mockCandidates;

  function setUp() public {
    owner = address(this);
    voter1 = makeAddr('voter1');
    voter2 = makeAddr('voter2');
    voter3 = makeAddr('voter3');
    voter4 = makeAddr('voter4');
    voter5 = makeAddr('voter5');
    router = makeAddr('router');

    factory = new ElectionFactory(router);

    mockElectionInfo = Election.ElectionInfo({
      name: 'Test Election',
      description: 'Test Description',
      startTime: block.timestamp + 60,
      endTime: block.timestamp + 3600
    });

    mockCandidates.push(
      Election.Candidate({
        candidateID: 1,
        name: 'candidate1',
        description: 'candidate1'
      })
    );
    mockCandidates.push(
      Election.Candidate({
        candidateID: 2,
        name: 'candidate2',
        description: 'candidate2s'
      })
    );
  }

  function createElectionAndGetInstance(
    uint ballotType,
    uint resultType
  ) internal returns (Election) {
    factory.createElection(
      mockElectionInfo,
      mockCandidates,
      ballotType,
      resultType
    );
    address[] memory openElections = factory.getOpenElections();
    return Election(openElections[openElections.length - 1]);
  }

  function test_CandidateManagement() public {
    Election election = createElectionAndGetInstance(1, 1);

    // Add candidates BEFORE election starts (electionStarted modifier requires timestamp <= startTime)
    election.addCandidate('Candidate 1', 'Description Test');
    election.addCandidate('Candidate 2', 'Description Test');

    Election.Candidate[] memory candidates = election.getCandidateList();
    // Initial 2 + 2 added = 4
    assertEq(candidates.length, 4);

    election.removeCandidate(0);
    candidates = election.getCandidateList();
    assertEq(candidates.length, 3);
  }

  function test_VotingProcess() public {
    Election election = createElectionAndGetInstance(1, 1);

    // Add candidates before start
    election.addCandidate('Candidate 1', 'Description Test');
    election.addCandidate('Candidate 2', 'Description Test');

    // Warp to active period
    vm.warp(mockElectionInfo.startTime + 10);

    // Voter 1 votes for candidate index 0 (which was initial candidate 1)
    uint[] memory vote = new uint[](1);
    vote[0] = 0;

    vm.prank(voter1);
    election.userVote(vote);

    assertTrue(election.userVoted(voter1));

    // Expect revert on double vote
    vm.prank(voter1);
    vm.expectRevert(Election.AlreadyVoted.selector);
    election.userVote(vote);
  }

  function test_ResultCalculation_General() public {
    Election election = createElectionAndGetInstance(1, 1);

    election.addCandidate('Candidate 1', 'Description Test'); // Index 2
    election.addCandidate('Candidate 2', 'Description Test'); // Index 3
    election.addCandidate('Candidate 3', 'Description Test'); // Index 4

    vm.warp(mockElectionInfo.startTime + 10);

    // Votes from JS test:
    // Voter1 -> [2] (Candidate 1 in added list, index 2 overall? No)
    // JS: candidates: initial (id1, id2), added (Cand1, Cand2, Cand3).
    // Total 5. Indices 0, 1, 2, 3, 4.
    // JS Test: voter1..5 vote for [2], [2], [1], [1], [1].
    // Index 2 is "Candidate 1". Index 1 is "candidate2" (initial).
    // Votes:
    // Index 2 got 2 votes.
    // Index 1 got 3 votes.
    // Winner should be Index 1.

    uint[] memory voteFor2 = new uint[](1);
    voteFor2[0] = 2;
    uint[] memory voteFor1 = new uint[](1);
    voteFor1[0] = 1;

    vm.prank(voter1);
    election.userVote(voteFor2);
    vm.prank(voter2);
    election.userVote(voteFor2);
    vm.prank(voter3);
    election.userVote(voteFor1);
    vm.prank(voter4);
    election.userVote(voteFor1);
    vm.prank(voter5);
    election.userVote(voteFor1);

    // End election
    vm.warp(mockElectionInfo.endTime + 1);

    election.getResult();
    uint[] memory winners = election.getWinners();

    assertEq(winners[0], 1);
  }

  function test_ResultCalculation_Ranked() public {
    Election election = createElectionAndGetInstance(2, 2);

    election.addCandidate('Candidate 1', 'Description Test');
    election.addCandidate('Candidate 2', 'Description Test');
    election.addCandidate('Candidate 3', 'Description Test');

    vm.warp(mockElectionInfo.startTime + 10);

    // Candidates: 0, 1, 2, 3, 4
    // JS Test votes:
    // v1: [3, 4, 2, 1, 0]
    // v2: [4, 1, 2, 3, 0]
    // v3: [4, 3, 2, 1, 0]

    uint[] memory v1 = new uint[](5);
    v1[0] = 3;
    v1[1] = 4;
    v1[2] = 2;
    v1[3] = 1;
    v1[4] = 0;
    uint[] memory v2 = new uint[](5);
    v2[0] = 4;
    v2[1] = 1;
    v2[2] = 2;
    v2[3] = 3;
    v2[4] = 0;
    uint[] memory v3 = new uint[](5);
    v3[0] = 4;
    v3[1] = 3;
    v3[2] = 2;
    v3[3] = 1;
    v3[4] = 0;

    vm.prank(voter1);
    election.userVote(v1);
    vm.prank(voter2);
    election.userVote(v2);
    vm.prank(voter3);
    election.userVote(v3);

    vm.warp(mockElectionInfo.endTime + 1);
    election.getResult();
    uint[] memory winners = election.getWinners();

    // JS says winner is 4.
    assertEq(winners[0], 4);
  }

  function test_ResultCalculation_IRV() public {
    Election election = createElectionAndGetInstance(3, 3);

    election.addCandidate('Candidate 1', 'Description Test');
    election.addCandidate('Candidate 2', 'Description Test');
    election.addCandidate('Candidate 3', 'Description Test');

    vm.warp(mockElectionInfo.startTime + 10);

    // JS Test votes:
    // v1: [1, 2, 0, 3, 4]
    // v2: [1, 2, 4, 0, 3]
    // v3: [2, 3, 1, 4, 0]

    uint[] memory v1 = new uint[](5);
    v1[0] = 1;
    v1[1] = 2;
    v1[2] = 0;
    v1[3] = 3;
    v1[4] = 4;
    uint[] memory v2 = new uint[](5);
    v2[0] = 1;
    v2[1] = 2;
    v2[2] = 4;
    v2[3] = 0;
    v2[4] = 3;
    uint[] memory v3 = new uint[](5);
    v3[0] = 2;
    v3[1] = 3;
    v3[2] = 1;
    v3[3] = 4;
    v3[4] = 0;

    vm.prank(voter1);
    election.userVote(v1);
    vm.prank(voter2);
    election.userVote(v2);
    vm.prank(voter3);
    election.userVote(v3);

    vm.warp(mockElectionInfo.endTime + 1);
    election.getResult();
    uint[] memory winners = election.getWinners();

    // JS says winner is 1. (Candidate 2 is winner? No, index 1 is 'candidate2' name 'candidate2')
    assertEq(winners[0], 1);
  }
  function test_ResultCalculation_Schulze() public {
    Election election = createElectionAndGetInstance(4, 4); // Type 4 = Schulze

    // Initial candidates from setUp are 2.
    // We want total 3.
    election.addCandidate('Candidate 3', 'Description Test');

    vm.warp(mockElectionInfo.startTime + 10);

    // JS inputs: [1, 2, 0], [1, 0, 2], [2, 1, 0]
    uint[] memory v1 = new uint[](3);
    v1[0] = 1;
    v1[1] = 2;
    v1[2] = 0;
    uint[] memory v2 = new uint[](3);
    v2[0] = 1;
    v2[1] = 0;
    v2[2] = 2;
    uint[] memory v3 = new uint[](3);
    v3[0] = 2;
    v3[1] = 1;
    v3[2] = 0;

    vm.prank(voter1);
    election.userVote(v1);
    vm.prank(voter2);
    election.userVote(v2);
    vm.prank(voter3);
    election.userVote(v3);

    vm.warp(mockElectionInfo.endTime + 1);
    election.getResult();
    uint[] memory winners = election.getWinners();

    // JS Expect: winner[0] == 1
    assertEq(winners[0], 1);
  }

  function test_ResultCalculation_KemenyYoung() public {
    Election election = createElectionAndGetInstance(7, 7); // Type 7 = KY

    // Initial 2. Add 1 more. Total 3.
    election.addCandidate('Candidate A', 'Test Description');

    vm.warp(mockElectionInfo.startTime + 10);

    // JS Votes: [0, 1, 2], [1, 2, 0], [1, 0, 2]
    uint[] memory v1 = new uint[](3);
    v1[0] = 0;
    v1[1] = 1;
    v1[2] = 2;
    uint[] memory v2 = new uint[](3);
    v2[0] = 1;
    v2[1] = 2;
    v2[2] = 0;
    uint[] memory v3 = new uint[](3);
    v3[0] = 1;
    v3[1] = 0;
    v3[2] = 2;

    vm.prank(voter1);
    election.userVote(v1);
    vm.prank(voter2);
    election.userVote(v2);
    vm.prank(voter3);
    election.userVote(v3);

    vm.warp(mockElectionInfo.endTime + 1);
    election.getResult();
    uint[] memory winners = election.getWinners();

    // JS Expect: winner[0] == 0
    assertEq(winners[0], 0);
  }
}
