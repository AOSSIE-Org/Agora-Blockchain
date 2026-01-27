const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Election — Negative & Boundary Lifecycle Tests", function () {
async function deployElectionFixture(startOffset, endOffset) {
  const [owner, voter, other] = await ethers.getSigners();

  const now = (await ethers.provider.getBlock("latest")).timestamp;

  const Election = await ethers.getContractFactory("Election");
  const election = await Election.deploy();
  await election.waitForDeployment();

  const electionInfo = {
    startTime: now + startOffset,
    endTime: now + endOffset,
    name: "Test Election",
    description: "Test Description",
  };

  const candidates = [
    { candidateID: 0, name: "A", description: "A" },
    { candidateID: 1, name: "B", description: "B" },
  ];

  await election.initialize(
    electionInfo,
    candidates,
    0,          // resultType
    0,          // electionId
    ethers.ZeroAddress, // ballot (unused in negative tests)
    owner.address,
    ethers.ZeroAddress  // resultCalculator (unused)
  );

  return { election, owner, voter, other, now };
}
it("reverts userVote before election start", async function () {
  const { election, voter } = await deployElectionFixture(1000, 2000);

  await expect(
    election.connect(voter).userVote([0])
  ).to.be.revertedWithCustomError(election, "ElectionInactive");
});
it("reverts userVote after election end", async function () {
  const { election, voter, now } = await deployElectionFixture(10, 20);

  await ethers.provider.send("evm_setNextBlockTimestamp", [now + 30]);
  await ethers.provider.send("evm_mine");

  await expect(
    election.connect(voter).userVote([0])
  ).to.be.revertedWithCustomError(election, "ElectionInactive");
});
it("reverts when user votes twice", async function () {
  const { election, voter } = await deployElectionFixture(0, 1000);

  const latest = await ethers.provider.getBlock("latest");
  await ethers.provider.send("evm_setNextBlockTimestamp", [latest.timestamp + 1]);
  await ethers.provider.send("evm_mine");

  await expect(
    election.connect(voter).userVote([0])
  ).to.be.reverted;

  await expect(
    election.connect(voter).userVote([0])
  ).to.be.reverted;
});

it("reverts addCandidate after election start", async function () {
  const { election, owner, now } = await deployElectionFixture(5, 1000);

  await ethers.provider.send("evm_setNextBlockTimestamp", [now + 10]);
  await ethers.provider.send("evm_mine");

  await expect(
    election.connect(owner).addCandidate("X", "X")
  ).to.be.revertedWithCustomError(election, "ElectionInactive");
});
it("reverts removeCandidate with invalid candidate id", async function () {
  const { election, owner } = await deployElectionFixture(1000, 2000);

  await expect(
    election.connect(owner).removeCandidate(99)
  ).to.be.revertedWithCustomError(election, "InvalidCandidateID");
});
it("reverts getResult before election end", async function () {
  const { election } = await deployElectionFixture(0, 1000);

  await expect(
    election.getResult()
  ).to.be.revertedWithCustomError(election, "ElectionIncomplete");
});
});
