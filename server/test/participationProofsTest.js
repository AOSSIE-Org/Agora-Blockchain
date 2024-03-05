const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ParticipationProofs", function () {
  it("Should record a proof of participation when a vote is cast", async function () {
    // Deploy the ParticipationProofs contract
    const ParticipationProofs = await ethers.getContractFactory(
      "ParticipationProofs"
    );
    const participationProofs = await ParticipationProofs.deploy();
    await participationProofs.deployed();

    // Simulate casting a vote and recording the proof of participation
    const [voter] = await ethers.getSigners();

    // Example proposal data as bytes; replace with actual expected data
    const proposalData = [ethers.utils.formatBytes32String("Example Proposal")];

    // Record the proof of participation
    const tx = await participationProofs.recordProof(
      voter.address,
      proposalData,
      Date.now()
    );

    // Wait for the transaction to be mined
    await tx.wait();

    // Assert that the proof of participation was recorded
    expect(await participationProofs.hasParticipated(voter.address)).to.equal(
      true
    );
  });
});
