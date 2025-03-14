const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers')
const {
  deployElectionFactoryFixture,
} = require('../fixtures/ElectionFactoryFixture')
const { expect } = require('chai')
const { keccak256, toUtf8Bytes } = require('ethers')

describe('ElectionFactory', function () {
  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const { electionFactory, owner } = await loadFixture(
        deployElectionFactoryFixture
      )
      expect(await electionFactory.factoryOwner()).to.equal(owner.address)
    })
    it('Should set the ccip receiver router', async function () {
      const { electionFactory, owner, mockRouter } = await loadFixture(
        deployElectionFactoryFixture
      )
      expect(await electionFactory.getRouter()).to.equal(mockRouter.target)
    })
  })

  describe('Election Creation and Deletion ', function () {
    it('Should create an election and initialize it', async function () {
      const { electionFactory, owner } = await loadFixture(
        deployElectionFactoryFixture
      )

      const electionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 60, // start in 1 minute
        endTime: Math.floor(Date.now() / 1000) + 3600, // end in 1 hour
        name: 'Test Election',
        description: 'This is a test election',
      }
      const initialCandidates = [
        { candidateID: 1, name: 'candidate1', description: 'candidate1' },
        { candidateID: 2, name: 'candidate2', description: 'candidate2s' },
      ]
      const ballotType = 1 // General
      const resultType = 1 // General

      await electionFactory.createElection(
        electionInfo,
        initialCandidates,
        ballotType,
        resultType
      )

      const openElections = await electionFactory.getOpenElections()
      expect(openElections.length).to.equal(1)

      const Election = await ethers.getContractFactory('Election')
      const electionInstance = Election.attach(openElections[0])
      const fetchedElectionInfo = await electionInstance.electionInfo()

      expect(fetchedElectionInfo.name).to.equal(electionInfo.name)
      expect(fetchedElectionInfo.description).to.equal(electionInfo.description)
    })
    it('should delete the election ', async function () {
      const { electionFactory, election, owner } = await loadFixture(
        deployElectionFactoryFixture
      )
      async function addElection(name) {
        const electionInfo = {
          startTime: Math.floor(Date.now() / 1000) + 60,
          endTime: Math.floor(Date.now() / 1000) + 3600,
          name: name,
          description: `This is ${name}`,
        }
        const ballotType = 1
        const resultType = 1
        const initialCandidates = [
          { candidateID: 1, name: 'candidate1', description: 'candidate1' },
          { candidateID: 2, name: 'candidate2', description: 'candidate2s' },
        ]

        await electionFactory.createElection(
          electionInfo,
          initialCandidates,
          ballotType,
          resultType
        )
      }
      await addElection('election1')
      await addElection('election2')
      // delete the election
      await electionFactory.deleteElection(1)
      const openElections = await electionFactory.getOpenElections()
      expect(openElections.length).to.equal(1)

      // The remaining election should be "Election 1"
      const remainingElection = election.attach(openElections[0])
      expect((await remainingElection.electionInfo()).name).to.equal(
        'election1'
      )
    })
  })
  describe('ElectionFactory Owner Management', function () {
    it('Should allow only owner to add whitelisted contracts', async function () {
      const { electionFactory, owner, otherAccount } = await loadFixture(
        deployElectionFactoryFixture
      )

      const sourceChainSelector = 16015286601757825753n // Example chain selector
      const contractAddress = '0x1234567890123456789012345678901234567890'

      // Should work when owner calls it
      await electionFactory.addWhitelistedContract(
        sourceChainSelector,
        contractAddress
      )

      // Should revert when non-owner calls it
      await expect(
        electionFactory
          .connect(otherAccount)
          .addWhitelistedContract(sourceChainSelector, contractAddress)
      ).to.be.revertedWithCustomError(electionFactory, 'OwnerRestricted')
    })

    it('Should allow only owner to remove whitelisted contracts', async function () {
      const { electionFactory, owner, otherAccount } = await loadFixture(
        deployElectionFactoryFixture
      )

      const sourceChainSelector = 16015286601757825753n // Example chain selector
      const contractAddress = '0x1234567890123456789012345678901234567890'

      // Add a whitelisted contract first
      await electionFactory.addWhitelistedContract(
        sourceChainSelector,
        contractAddress
      )

      // Should work when owner calls it
      await electionFactory.removeWhitelistedContract(sourceChainSelector)

      // Should revert when non-owner calls it
      await expect(
        electionFactory
          .connect(otherAccount)
          .removeWhitelistedContract(sourceChainSelector)
      ).to.be.revertedWithCustomError(electionFactory, 'OwnerRestricted')
    })
  })
  describe(' Cross Chain Voting ', () => {
    it(' must allow whitelisted contracts to vote cross chain ', async () => {
      const { electionFactory, election, owner, mockRouter, voter1 } =
        await loadFixture(deployElectionFactoryFixture)
      async function addElection(name) {
        const electionInfo = {
          startTime: Math.floor(Date.now() / 1000) + 60,
          endTime: Math.floor(Date.now() / 1000) + 3600,
          name: name,
          description: `This is ${name}`,
        }
        const ballotType = 1
        const resultType = 1
        const initialCandidates = [
          { candidateID: 1, name: 'candidate1', description: 'candidate1' },
          { candidateID: 2, name: 'candidate2', description: 'candidate2s' },
        ]

        await electionFactory.createElection(
          electionInfo,
          initialCandidates,
          ballotType,
          resultType
        )
      }
      await addElection('election1')
      const openElections = await electionFactory.getOpenElections()
      const electionAddress = openElections[0]
      const sourceChainSelector = BigInt('16015286601757825753')
      await electionFactory.addWhitelistedContract(
        sourceChainSelector,
        '0x1234567890abcdef1234567890abcdef12345678'
      )
      const voteArr = [0]
      const messageId = keccak256(toUtf8Bytes('testMessage'))
      await time.increase(120)
      const ccipMessage = await mockRouter.sendMessage(
        messageId,
        voter1.address,
        '0x1234567890abcdef1234567890abcdef12345678',
        electionAddress,
        sourceChainSelector,
        voteArr
      )

      const newElection = await ethers.getContractFactory('Election')
      const electionInstance = newElection.attach(electionAddress)
      const hasVoted = await electionInstance.userVoted(voter1)
      expect(hasVoted).to.be.true
    })
  })
})
