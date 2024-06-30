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

      await electionInstance.connect(voter1).userVote([0]); // Vote for Candidate 3 (index 2)
      const userVoted = await electionInstance.userVoted(voter1.address);
      expect(userVoted).to.equal(true);

      await expect(
        electionInstance.connect(voter1).userVote([0])
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

      await electionInstance.connect(voter1).userVote([2]); // Vote for Candidate 3
      await electionInstance.connect(voter2).userVote([2]); // Vote for Candidate 3
      await electionInstance.connect(voter3).userVote([1]); // Vote for Candidate 2
      await electionInstance.connect(voter4).userVote([1]); // Vote for Candidate 2
      await electionInstance.connect(voter5).userVote([1]); // Vote for Candidate 2
      await time.increase(3600); // Move time forward to end the election
      await electionInstance.getResult();
      const winnerId = await electionInstance.winner();
      expect(winnerId).to.equal(1); // Candidate 2 is the winner
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

  describe("General Voting Algorithm Tests", function () {
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

      await electionInstance.connect(voter1).userVote([0]); // Vote for Candidate 1
      await electionInstance.connect(voter2).userVote([1]); // Vote for Candidate 2
      await electionInstance.connect(voter3).userVote([0]); // Vote for Candidate 1

      await time.increase(3600); // Move time forward to end the election

      await electionInstance.getResult();
      const winner = await electionInstance.winner();

      expect(winner).to.equal(0); // Candidate 1 is the winner due to more votes
    });
  });

  describe("Ranked Voting Algorithm Tests", function () {
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

  describe("IRV Voting Algorithm Tests", function () {
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

  describe("Borda Voting Algorithm Tests", function () {
    it("Test with multiple voters and candidates", async function () {
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
        name: "Borda Count Election",
        description: "This is a Borda Count test election",
      };
      const ballotType = 4; // Borda Count
      const resultType = 4; // Borda Count

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
      await electionInstance.connect(voter6).userVote([4, 0, 3, 1, 2]); // Voter 6's vote

      await time.increase(3600); // Move time forward to end the election

      await electionInstance.getResult();
      const winner = await electionInstance.winner();

      expect(winner).to.equal(1); // Candidate 1 is the winner
    });
  });

  describe("Quadratic Voting Algorithm Tests", function () {
    it("Test with multiple voters and candidates", async function () {
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
        name: "Quadratic Election",
        description: "This is a Quadratic test election",
      };
      const ballotType = 5; // Quadratic
      const resultType = 5; // Quadratic

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

      await ethers.provider.send("evm_increaseTime", [120]); // Move time forward to make the election active

      // Multiple voters submit their votes
      // A, B, C, D, E
      // 0, 1, 2, 3, 4
      // Each voter has 100 credits to distribute, in quadratic voting
      await electionInstance.connect(voter1).userVote([0, 25, 0, 25, 50]); // Voter 1's vote
      await electionInstance.connect(voter2).userVote([0, 50, 0, 50, 0]); // Voter 2's vote
      await electionInstance.connect(voter3).userVote([25, 0, 25, 0, 50]); // Voter 3's vote
      await electionInstance.connect(voter4).userVote([50, 25, 0, 25, 0]); // Voter 4's vote
      await electionInstance.connect(voter5).userVote([25, 25, 25, 25, 0]); // Voter 5's vote
      await electionInstance.connect(voter6).userVote([0, 0, 50, 25, 25]); // Voter 6's vote

      await ethers.provider.send("evm_increaseTime", [3600]); // Move time forward to end the election

      await electionInstance.getResult();
      const winner = await electionInstance.winner();

      // The expected winner index would be the candidate with the highest total votes
      expect(winner).to.equal(3);
    });
  });

  describe("Score Voting Algorithm Tests", function () {
    it("Test 1 with multiple voters and candidates", async function () {
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
        name: "Score Election",
        description: "This is a Score test election",
      };
      const ballotType = 6; // Score
      const resultType = 6; // Score

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

      await ethers.provider.send("evm_increaseTime", [120]); // Move time forward to make the election active

      // Multiple voters submit their votes
      // A, B, C, D, E
      // 0, 1, 2, 3, 4
      // Each voter gives a score out of 10 to each candidate
      await electionInstance.connect(voter1).userVote([8, 7, 5, 6, 10]); // Voter 1's vote
      await electionInstance.connect(voter2).userVote([9, 8, 6, 7, 5]); // Voter 2's vote
      await electionInstance.connect(voter3).userVote([6, 10, 8, 5, 7]); // Voter 3's vote
      await electionInstance.connect(voter4).userVote([7, 5, 9, 8, 6]); // Voter 4's vote
      await electionInstance.connect(voter5).userVote([10, 6, 7, 9, 8]); // Voter 5's vote
      await electionInstance.connect(voter6).userVote([5, 9, 10, 6, 8]); // Voter 6's vote

      await ethers.provider.send("evm_increaseTime", [3600]); // Move time forward to end the election

      await electionInstance.getResult();
      const winner = await electionInstance.winner();

      // The expected winner index would be the candidate with the highest total scores
      expect(winner).to.equal(0);
    });

    it("Test 2 with different scores and multiple candidates", async function () {
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
        name: "Score Election",
        description: "This is another Score test election",
      };
      const ballotType = 6; // Score
      const resultType = 6; // Score

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

      await ethers.provider.send("evm_increaseTime", [120]); // Move time forward to make the election active

      // Multiple voters submit their votes
      // A, B, C, D, E
      // 0, 1, 2, 3, 4
      // Each voter gives a score out of 10 to each candidate
      await electionInstance.connect(voter1).userVote([6, 9, 5, 8, 7]); // Voter 1's vote
      await electionInstance.connect(voter2).userVote([7, 8, 6, 10, 5]); // Voter 2's vote
      await electionInstance.connect(voter3).userVote([8, 5, 9, 6, 7]); // Voter 3's vote
      await electionInstance.connect(voter4).userVote([10, 7, 10, 9, 6]); // Voter 4's vote
      await electionInstance.connect(voter5).userVote([10, 6, 8, 7, 9]); // Voter 5's vote
      await electionInstance.connect(voter6).userVote([9, 10, 7, 5, 8]); // Voter 6's vote

      await ethers.provider.send("evm_increaseTime", [3600]); // Move time forward to end the election

      await electionInstance.getResult();
      const winner = await electionInstance.winner();

      // The expected winner index would be the candidate with the highest total scores
      expect(winner).to.equal(0);
    });
  });

  describe("Kemeny-Young Voting Algorithm Tests", function () {
    it("Test with three voters and three candidates", async function () {
      const { electionFactory, voter1, voter2, voter3 } = await loadFixture(
        deployElectionFactoryFixture
      );

      const electionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 60,
        endTime: Math.floor(Date.now() / 1000) + 3600,
        name: "Kemeny-Young Election",
        description: "This is a Kemeny-Young test election",
      };
      const ballotType = 7; // Kemeny-Young
      const resultType = 7; // Kemeny-Young

      await electionFactory.createElection(
        electionInfo,
        ballotType,
        resultType
      );

      const openElections = await electionFactory.getOpenElections();
      const Election = await ethers.getContractFactory("Election");
      const electionInstance = Election.attach(openElections[0]);

      await electionInstance.addCandidate("Candidate A");
      await electionInstance.addCandidate("Candidate B");
      await electionInstance.addCandidate("Candidate C");

      await ethers.provider.send("evm_increaseTime", [120]); // Move time forward to make the election active

      // Voters submit their rankings
      await electionInstance.connect(voter1).userVote([0, 1, 2]); // A > B > C
      await electionInstance.connect(voter2).userVote([1, 2, 0]); // B > C > A
      await electionInstance.connect(voter3).userVote([1, 0, 2]); // B > A > C

      await ethers.provider.send("evm_increaseTime", [3600]); // Move time forward to end the election

      await electionInstance.getResult();
      const winner = await electionInstance.winner();

      // The expected winner index would be the candidate with the highest Kemeny-Young score
      expect(winner).to.equal(0);
    });
    it("Test with five voters and four candidates", async function () {
      const { electionFactory, voter1, voter2, voter3, voter4, voter5 } =
        await loadFixture(deployElectionFactoryFixture);

      const electionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 60,
        endTime: Math.floor(Date.now() / 1000) + 3600,
        name: "Kemeny-Young Election",
        description: "This is a Kemeny-Young test election",
      };
      const ballotType = 7; // Kemeny-Young
      const resultType = 7; // Kemeny-Young

      await electionFactory.createElection(
        electionInfo,
        ballotType,
        resultType
      );

      const openElections = await electionFactory.getOpenElections();
      const Election = await ethers.getContractFactory("Election");
      const electionInstance = Election.attach(openElections[0]);

      await electionInstance.addCandidate("Candidate A");
      await electionInstance.addCandidate("Candidate B");
      await electionInstance.addCandidate("Candidate C");
      await electionInstance.addCandidate("Candidate D");

      await ethers.provider.send("evm_increaseTime", [120]); // Move time forward to make the election active

      // Voters submit their votes
      await electionInstance.connect(voter1).userVote([0, 1, 2, 3]); // Voter 1: A > B > C > D
      await electionInstance.connect(voter2).userVote([3, 2, 1, 0]); // Voter 2: D > C > B > A
      await electionInstance.connect(voter3).userVote([1, 0, 3, 2]); // Voter 3: B > A > D > C
      await electionInstance.connect(voter4).userVote([2, 3, 0, 1]); // Voter 4: C > D > A > B
      await electionInstance.connect(voter5).userVote([0, 3, 2, 1]); // Voter 5: A > D > C > B

      await ethers.provider.send("evm_increaseTime", [3600]); // Move time forward to end the election

      await electionInstance.getResult();
      const winner = await electionInstance.winner();

      // The expected winner index would be the candidate with the highest Kemeny-Young score
      expect(winner).to.equal(0); // Adjust this based on the actual Kemeny-Young calculation
    });
  });

  describe("Schulze Voting Algorithm Tests", function () {
    it("Test with three voters and three candidates", async function () {
      const { electionFactory, voter1, voter2, voter3 } = await loadFixture(
        deployElectionFactoryFixture
      );

      const electionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 60,
        endTime: Math.floor(Date.now() / 1000) + 3600,
        name: "Schulze Election",
        description: "This is a Schulze test election",
      };
      const ballotType = 8; // Schulze
      const resultType = 8; // Schulze

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

      await ethers.provider.send("evm_increaseTime", [120]); // Move time forward to make the election active

      // Voters submit their votes in preference ranking: [B, C, A] -> [1, 2, 0]
      await electionInstance.connect(voter1).userVote([1, 2, 0]); // Voter 1
      await electionInstance.connect(voter2).userVote([1, 0, 2]); // Voter 2
      await electionInstance.connect(voter3).userVote([2, 1, 0]); // Voter 3

      await ethers.provider.send("evm_increaseTime", [3600]); // Move time forward to end the election

      await electionInstance.getResult();
      const winner = await electionInstance.winner();

      expect(winner).to.equal(1);
    });

    it("Test with five voters and four candidates", async function () {
      const { electionFactory, voter1, voter2, voter3, voter4, voter5 } =
        await loadFixture(deployElectionFactoryFixture);

      const electionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 60,
        endTime: Math.floor(Date.now() / 1000) + 3600,
        name: "Schulze Election",
        description: "This is a Schulze test election",
      };
      const ballotType = 8; // Schulze
      const resultType = 8; // Schulze

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

      await ethers.provider.send("evm_increaseTime", [120]); // Move time forward to make the election active

      // Adjusting votes to prefer Candidate 3 (index 2) more
      await electionInstance.connect(voter1).userVote([2, 1, 3, 0]); // Voter 1 prefers Candidate 3
      await electionInstance.connect(voter2).userVote([0, 2, 3, 1]); // Voter 2 prefers Candidate 3
      await electionInstance.connect(voter3).userVote([1, 3, 2, 0]); // Voter 3 prefers Candidate 3
      await electionInstance.connect(voter4).userVote([0, 3, 2, 1]); // Voter 4 prefers Candidate 3
      await electionInstance.connect(voter5).userVote([2, 0, 3, 1]); // Voter 5 prefers Candidate 3

      await ethers.provider.send("evm_increaseTime", [3600]); // Move time forward to end the election

      await electionInstance.getResult();
      const winner = await electionInstance.winner();

      expect(winner).to.equal(2); // Candidate 3 (index 2) should be the winner
    });
  });
});
