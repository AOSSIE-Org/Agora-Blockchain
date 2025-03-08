const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers')
const {
  deployElectionFactoryFixture,
} = require('../fixtures/ElectionFactoryFixture')
const { expect } = require('chai')

describe('ElectionFactory', function () {
  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      const { electionFactory, owner } = await loadFixture(
        deployElectionFactoryFixture
      )
      expect(await electionFactory.factoryOwner()).to.equal(owner.address)
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
})
