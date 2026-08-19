const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ElectionFactory", function () {
  let factory;
  let owner, user1, user2, router;
  
  const mockElectionInfo = {
    name: "Test Election",
    description: "Test Description",
    startTime: Math.floor(Date.now() / 1000) + 3600,
    endTime: Math.floor(Date.now() / 1000) + 7200,
  };

  const mockCandidates = [
    { candidateID: 0, name: "Option 1", description: "Option 1" },
    { candidateID: 1, name: "Option 2", description: "Option 2" }
  ];

  beforeEach(async function () {
    [owner, user1, user2, router] = await ethers.getSigners();

    const ElectionFactory = await ethers.getContractFactory("ElectionFactory");
    factory = await ElectionFactory.deploy(router.address);
    await factory.waitForDeployment();
  });

  it("Should set the right owner", async function () {
    expect(await factory.factoryOwner()).to.equal(owner.address);
  });

  it("Should initialize with zero elections", async function () {
    expect(await factory.electionCount()).to.equal(0);
    const openElections = await factory.getOpenElections();
    expect(openElections.length).to.equal(0);
  });

  describe("Election Creation", function () {
    it("Should create a new election", async function () {
      await factory.createElection(mockElectionInfo, mockCandidates, 0, 0);
      expect(await factory.electionCount()).to.equal(1);
      
      const openElections = await factory.getOpenElections();
      expect(openElections.length).to.equal(1);
    });

    it("Should allow multiple elections creation", async function () {
      await factory.createElection(mockElectionInfo, mockCandidates, 0, 0);
      await factory.createElection(mockElectionInfo, mockCandidates, 0, 0);
      
      expect(await factory.electionCount()).to.equal(2);
      const openElections = await factory.getOpenElections();
      expect(openElections.length).to.equal(2);
    });
  });

  describe("Election Deletion", function () {
    beforeEach(async function () {
      await factory.createElection(mockElectionInfo, mockCandidates, 0, 0);
    });

    it("Should allow owner to delete their election", async function () {
      await factory.deleteElection(0);
      const openElections = await factory.getOpenElections();
      expect(openElections.length).to.equal(0);
    });

    it("Should not allow non-owner to delete election", async function () {
      await expect(
        factory.connect(user1).deleteElection(0)
      ).to.be.revertedWithCustomError(factory, "OnlyOwner");
    });
  });

  describe("Whitelisted Contracts Management", function () {
    const mockChainSelector = 1;
    const mockContractAddress = "0x1234567890123456789012345678901234567890";

    it("Should allow owner to add whitelisted contract", async function () {
      await factory.addWhitelistedContract(mockChainSelector, mockContractAddress);
    });

    it("Should allow owner to remove whitelisted contract", async function () {
      await factory.addWhitelistedContract(mockChainSelector, mockContractAddress);
      await factory.removeWhitelistedContract(mockChainSelector);
    });

    it("Should not allow non-owner to add whitelisted contract", async function () {
      await expect(
        factory.connect(user1).addWhitelistedContract(mockChainSelector, mockContractAddress)
      ).to.be.revertedWithCustomError(factory, "OwnerRestricted");
    });
  });
});