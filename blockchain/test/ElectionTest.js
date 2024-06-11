const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("ElectionFactory and Election Contracts", function () {
  async function deployElectionFactoryFixture() {
    const [
      owner,
      otherAccount,
      voter1,
      voter2,
      voter3,
      voter4,
      voter5,
      voter6,
      voter7,
      voter8,
    ] = await ethers.getSigners();

    const BallotGenerator = await ethers.getContractFactory("BallotGenerator");
    const ResultCalculator = await ethers.getContractFactory(
      "ResultCalculator"
    );
    const Election = await ethers.getContractFactory("Election");
    const ElectionFactory = await ethers.getContractFactory("ElectionFactory");

    const ballotGenerator = await BallotGenerator.deploy();
    const resultCalculator = await ResultCalculator.deploy();
    const election = await Election.deploy();
    const electionFactory = await ElectionFactory.deploy(
      "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"
    );

    return {
      electionFactory,
      election,
      ballotGenerator,
      resultCalculator,
      owner,
      otherAccount,
      voter1,
      voter2,
      voter3,
      voter4,
      voter5,
      voter6,
      voter7,
      voter8,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { electionFactory, owner } = await loadFixture(
        deployElectionFactoryFixture
      );
      expect(await electionFactory.factoryOwner()).to.equal(owner.address);
    });
  });

  describe("Election Creation and Initialization", function () {
    it("Should create an election and initialize it", async function () {
      const { electionFactory, owner } = await loadFixture(
        deployElectionFactoryFixture
      );

      const electionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 60, // start in 1 minute
        endTime: Math.floor(Date.now() / 1000) + 3600, // end in 1 hour
        name: "Test Election",
        description: "This is a test election",
      };
      const ballotType = 1; // General
      const resultType = 1; // General

      await electionFactory.createElection(
        electionInfo,
        ballotType,
        resultType
      );

      const openElections = await electionFactory.getOpenElections();
      expect(openElections.length).to.equal(1);

      const Election = await ethers.getContractFactory("Election");
      const electionInstance = Election.attach(openElections[0]);
      const fetchedElectionInfo = await electionInstance.electionInfo();

      expect(fetchedElectionInfo.name).to.equal(electionInfo.name);
      expect(fetchedElectionInfo.description).to.equal(
        electionInfo.description
      );
    });
  });

  describe("Candidate Management", function () {
    it("Should add and remove candidates", async function () {
      const { electionFactory, owner } = await loadFixture(
        deployElectionFactoryFixture
      );

      const electionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 60,
        endTime: Math.floor(Date.now() / 1000) + 3600,
        name: "Test Election",
        description: "This is a test election",
      };
      const ballotType = 1; // General
      const resultType = 1; // General

      await electionFactory.createElection(
        electionInfo,
        ballotType,
        resultType
      );

      const openElections = await electionFactory.getOpenElections();
      const Election = await ethers.getContractFactory("Election");
      const electionInstance = Election.attach(openElections[0]);

      await electionInstance.addCandidate("Candidate 1");
      await electionInstance.addCandidate("Candidate 2");

      let candidates = await electionInstance.getCandidateList();
      expect(candidates.length).to.equal(2);

      await electionInstance.removeCandidate(0);
      candidates = await electionInstance.getCandidateList();
      expect(candidates.length).to.equal(1);
    });
  });

  describe("Voting Process", function () {
    it("Should allow voting and ensure only one vote per user", async function () {
      const { electionFactory, voter1, voter2 } = await loadFixture(
        deployElectionFactoryFixture
      );

      const electionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 60,
        endTime: Math.floor(Date.now() / 1000) + 3600,
        name: "Test Election",
        description: "This is a test election",
      };
      const ballotType = 1; // General
      const resultType = 1; // General

      await electionFactory.createElection(
        electionInfo,
        ballotType,
        resultType
      );

      const openElections = await electionFactory.getOpenElections();
      const Election = await ethers.getContractFactory("Election");
      const electionInstance = Election.attach(openElections[0]);

      await electionInstance.addCandidate("Candidate 1");
      await electionInstance.addCandidate("Candidate 2");

      await time.increase(120); // Move time forward to make the election active

      await electionInstance.connect(voter1).userVote([0, 1]); // Vote for Candidate 3 (index 2)
      const userVoted = await electionInstance.userVoted(voter1.address);
      expect(userVoted).to.equal(true);

      await expect(
        electionInstance.connect(voter1).userVote([0, 1])
      ).to.be.revertedWith("User Voted");
    });
  });

  describe("Result Calculation", function () {
    it("Should calculate results for General voting algorithm", async function () {
      const { electionFactory, voter1, voter2, voter3, voter4, voter5 } =
        await loadFixture(deployElectionFactoryFixture);

      const electionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 60,
        endTime: Math.floor(Date.now() / 1000) + 3600,
        name: "Test Election",
        description: "This is a test election",
      };
      const ballotType = 1; // General
      const resultType = 1; // General

      await electionFactory.createElection(
        electionInfo,
        ballotType,
        resultType
      );

      const openElections = await electionFactory.getOpenElections();
      const Election = await ethers.getContractFactory("Election");
      const electionInstance = Election.attach(openElections[0]);

      await electionInstance.addCandidate("Candidate 1");
      await electionInstance.addCandidate("Candidate 2");
      await electionInstance.addCandidate("Candidate 3");

      await time.increase(120); // Move time forward to make the election active

      await electionInstance.connect(voter1).userVote([0, 0, 1]); // Vote for Candidate 3
      await electionInstance.connect(voter2).userVote([0, 0, 1]); // Vote for Candidate 3
      await electionInstance.connect(voter3).userVote([0, 1, 0]);
      await electionInstance.connect(voter4).userVote([0, 1, 0]);
      await electionInstance.connect(voter5).userVote([0, 1, 0]);
      await time.increase(3600); // Move time forward to end the election
      await electionInstance.getResult();
      const winnerId = await electionInstance.winner();
      expect(winnerId).to.equal(1); // Candidate 3 is the winner
    });

    it("Should calculate results for Ranked voting algorithm", async function () {
      const { electionFactory, voter1, voter2, voter3 } = await loadFixture(
        deployElectionFactoryFixture
      );

      const electionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 60,
        endTime: Math.floor(Date.now() / 1000) + 3600,
        name: "Test Election",
        description: "This is a test election",
      };
      const ballotType = 2; // Ranked
      const resultType = 2; // Ranked

      await electionFactory.createElection(
        electionInfo,
        ballotType,
        resultType
      );

      const openElections = await electionFactory.getOpenElections();
      const Election = await ethers.getContractFactory("Election");
      const electionInstance = Election.attach(openElections[0]);

      await electionInstance.addCandidate("Candidate 1");
      await electionInstance.addCandidate("Candidate 2");
      await electionInstance.addCandidate("Candidate 3");

      await time.increase(120); // Move time forward to make the election active

      await electionInstance.connect(voter1).userVote([1, 2, 0]); // Rank: B > C > A
      await electionInstance.connect(voter2).userVote([2, 1, 0]); // Rank: C > B > A
      await electionInstance.connect(voter3).userVote([1, 2, 0]); // Rank: B > A > C

      await time.increase(3600); // Move time forward to end the election

      await electionInstance.getResult();
      const winner = await electionInstance.winner();

      expect(winner).to.equal(1); // Candidate B is the winner
    });

    it("Should calculate results for IRV voting algorithm", async function () {
      const { electionFactory, voter1, voter2, voter3 } = await loadFixture(
        deployElectionFactoryFixture
      );

      const electionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 60,
        endTime: Math.floor(Date.now() / 1000) + 3600,
        name: "Test Election",
        description: "This is a test election",
      };
      const ballotType = 3; // IRV
      const resultType = 3; // IRV

      await electionFactory.createElection(
        electionInfo,
        ballotType,
        resultType
      );

      const openElections = await electionFactory.getOpenElections();
      const Election = await ethers.getContractFactory("Election");
      const electionInstance = Election.attach(openElections[0]);

      await electionInstance.addCandidate("Candidate 1");
      await electionInstance.addCandidate("Candidate 2");
      await electionInstance.addCandidate("Candidate 3");

      await time.increase(120); // Move time forward to make the election active

      await electionInstance.connect(voter1).userVote([1, 2, 0]); // Rank: B > C > A
      await electionInstance.connect(voter2).userVote([1, 2, 0]); // Rank: B > C > A
      await electionInstance.connect(voter3).userVote([2, 1, 0]); // Rank: C > B > A

      await time.increase(3600); // Move time forward to end the election

      await electionInstance.getResult();
      const winner = await electionInstance.winner();

      expect(winner).to.equal(1); // Candidate B is the winner
    });
  });

  describe("General Voting Algorithm - Additional Tests", function () {
    it("Should handle ties correctly", async function () {
      const { electionFactory, voter1, voter2, voter3 } = await loadFixture(
        deployElectionFactoryFixture
      );

      const electionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 60,
        endTime: Math.floor(Date.now() / 1000) + 3600,
        name: "Tie Election",
        description: "This is a tie test election",
      };
      const ballotType = 1; // General
      const resultType = 1; // General

      await electionFactory.createElection(
        electionInfo,
        ballotType,
        resultType
      );

      const openElections = await electionFactory.getOpenElections();
      const Election = await ethers.getContractFactory("Election");
      const electionInstance = Election.attach(openElections[0]);

      await electionInstance.addCandidate("Candidate 1");
      await electionInstance.addCandidate("Candidate 2");

      await time.increase(120); // Move time forward to make the election active

      await electionInstance.connect(voter1).userVote([1, 0]); // Vote for Candidate 1
      await electionInstance.connect(voter2).userVote([0, 1]); // Vote for Candidate 2
      await electionInstance.connect(voter3).userVote([1, 0]); // Vote for Candidate 1

      await time.increase(3600); // Move time forward to end the election

      await electionInstance.getResult();
      const winner = await electionInstance.winner();

      expect(winner).to.equal(0); // Candidate 1 is the winner due to more votes
    });
  });

  describe("Ranked Voting Algorithm - Additional Tests", function () {
    it("Should handle multiple rankings correctly", async function () {
      const { electionFactory, voter1, voter2, voter3, voter4, voter5 } =
        await loadFixture(deployElectionFactoryFixture);

      const electionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 60,
        endTime: Math.floor(Date.now() / 1000) + 3600,
        name: "Ranked Election",
        description: "This is a ranked test election",
      };
      const ballotType = 2; // Ranked
      const resultType = 2; // Ranked

      await electionFactory.createElection(
        electionInfo,
        ballotType,
        resultType
      );

      const openElections = await electionFactory.getOpenElections();
      const Election = await ethers.getContractFactory("Election");
      const electionInstance = Election.attach(openElections[0]);

      await electionInstance.addCandidate("Candidate 1");
      await electionInstance.addCandidate("Candidate 2");
      await electionInstance.addCandidate("Candidate 3");

      await time.increase(120); // Move time forward to make the election active

      await electionInstance.connect(voter1).userVote([0, 1, 2]); // Rank: A > B > C
      await electionInstance.connect(voter2).userVote([1, 2, 0]); // Rank: B > C > A
      await electionInstance.connect(voter3).userVote([2, 0, 1]); // Rank: C > A > B
      await electionInstance.connect(voter4).userVote([0, 2, 1]); // Rank: A > C > B
      await electionInstance.connect(voter5).userVote([2, 1, 0]); // Rank: C > B > A

      await time.increase(3600); // Move time forward to end the election

      await electionInstance.getResult();
      const winner = await electionInstance.winner();

      expect(winner).to.equal(2); // Candidate C is the winner
    });
  });

  describe("IRV Voting Algorithm - Additional Tests", function () {
    it("Test 1", async function () {
      const { electionFactory, voter1, voter2, voter3, voter4, voter5 } =
        await loadFixture(deployElectionFactoryFixture);

      const electionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 60,
        endTime: Math.floor(Date.now() / 1000) + 3600,
        name: "IRV Election",
        description: "This is an IRV test election",
      };
      const ballotType = 3; // IRV
      const resultType = 3; // IRV

      await electionFactory.createElection(
        electionInfo,
        ballotType,
        resultType
      );

      const openElections = await electionFactory.getOpenElections();
      const Election = await ethers.getContractFactory("Election");
      const electionInstance = Election.attach(openElections[0]);

      await electionInstance.addCandidate("Candidate 1");
      await electionInstance.addCandidate("Candidate 2");
      await electionInstance.addCandidate("Candidate 3");

      await time.increase(120); // Move time forward to make the election active

      await electionInstance.connect(voter1).userVote([0, 1, 2]); // Rank: A > B > C
      await electionInstance.connect(voter2).userVote([1, 2, 0]); // Rank: B > C > A
      await electionInstance.connect(voter3).userVote([2, 0, 1]); // Rank: C > A > B
      await electionInstance.connect(voter4).userVote([0, 2, 1]); // Rank: A > C > B
      await electionInstance.connect(voter5).userVote([2, 1, 0]); // Rank: C > B > A

      await time.increase(3600); // Move time forward to end the election

      await electionInstance.getResult();
      const winner = await electionInstance.winner();

      expect(winner).to.equal(2); // Candidate C is the winner
    });
    it("Test 2 with multiple voters and candidates", async function () {
      const {
        electionFactory,
        voter1,
        voter2,
        voter3,
        voter4,
        voter5,
        voter6,
      } = await loadFixture(deployElectionFactoryFixture);

      const electionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 60,
        endTime: Math.floor(Date.now() / 1000) + 3600,
        name: "IRV Election",
        description: "This is an IRV test election",
      };
      const ballotType = 3; // IRV
      const resultType = 3; // IRV

      await electionFactory.createElection(
        electionInfo,
        ballotType,
        resultType
      );

      const openElections = await electionFactory.getOpenElections();
      const Election = await ethers.getContractFactory("Election");
      const electionInstance = Election.attach(openElections[0]);

      await electionInstance.addCandidate("Candidate 1");
      await electionInstance.addCandidate("Candidate 2");
      await electionInstance.addCandidate("Candidate 3");
      await electionInstance.addCandidate("Candidate 4");
      await electionInstance.addCandidate("Candidate 5");

      await time.increase(120); // Move time forward to make the election active

      // Multiple voters submit their votes
      // A, B, C, D, E
      // 0, 1, 2, 3, 4
      await electionInstance.connect(voter1).userVote([1, 2, 0, 3, 4]); // Voter 1's vote
      await electionInstance.connect(voter2).userVote([2, 0, 3, 1, 4]); // Voter 2's vote
      await electionInstance.connect(voter3).userVote([1, 3, 2, 0, 4]); // Voter 3's vote
      await electionInstance.connect(voter4).userVote([3, 2, 0, 4, 1]); // Voter 4's vote
      await electionInstance.connect(voter5).userVote([1, 4, 0, 2, 3]); // Voter 5's vote
      await electionInstance.connect(voter6).userVote([4, 0, 3, 1, 2]); // Voter 5's vote

      await time.increase(3600); // Move time forward to end the election

      await electionInstance.getResult();
      const winner = await electionInstance.winner();

      expect(winner).to.equal(3); // Candidate 4 is the winner
    });
  });
});
