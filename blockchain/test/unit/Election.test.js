const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers')
const {
  deployElectionFactoryFixture,
} = require('../fixtures/ElectionFactoryFixture')
const { expect } = require('chai')

describe('Election', function () {
  describe('Candidate Management', function () {
    it('Should add and remove candidates', async function () {
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
      const Election = await ethers.getContractFactory('Election')
      const electionInstance = Election.attach(openElections[0])

      await electionInstance.addCandidate('Candidate 1', 'Description Test')
      await electionInstance.addCandidate('Candidate 2', 'Description Test')

      let candidates = await electionInstance.getCandidateList()
      expect(candidates.length).to.equal(4)

      await electionInstance.removeCandidate(0)
      candidates = await electionInstance.getCandidateList()
      expect(candidates.length).to.equal(3)
    })
  })

  describe('Voting Process', function () {
    it('Should allow voting and ensure only one vote per user', async function () {
      const { electionFactory, voter1, voter2 } = await loadFixture(
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
      const Election = await ethers.getContractFactory('Election')
      const electionInstance = Election.attach(openElections[0])

      await electionInstance.addCandidate('Candidate 1', 'Description Test')
      await electionInstance.addCandidate('Candidate 2', 'Description Test')

      await time.increase(120) // Move time forward to make the election active

      await electionInstance.connect(voter1).userVote([0]) // Vote for Candidate 3 (index 2)
      const userVoted = await electionInstance.userVoted(voter1.address)
      expect(userVoted).to.equal(true)

      await expect(
        electionInstance.connect(voter1).userVote([0])
      ).to.be.revertedWithCustomError(electionInstance, 'AlreadyVoted')
    })
  })

  describe('Result Calculation', function () {
    it('Should calculate results for General voting algorithm', async function () {
      const { electionFactory, voter1, voter2, voter3, voter4, voter5 } =
        await loadFixture(deployElectionFactoryFixture)

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
      const Election = await ethers.getContractFactory('Election')
      const electionInstance = Election.attach(openElections[0])

      await electionInstance.addCandidate('Candidate 1', 'Description Test')
      await electionInstance.addCandidate('Candidate 2', 'Description Test')
      await electionInstance.addCandidate('Candidate 3', 'Description Test')

      await time.increase(120) // Move time forward to make the election active

      await electionInstance.connect(voter1).userVote([2]) // Vote for Candidate 3
      await electionInstance.connect(voter2).userVote([2]) // Vote for Candidate 3
      await electionInstance.connect(voter3).userVote([1]) // Vote for Candidate 2
      await electionInstance.connect(voter4).userVote([1]) // Vote for Candidate 2
      await electionInstance.connect(voter5).userVote([1]) // Vote for Candidate 2
      await time.increase(3600) // Move time forward to end the election
      await electionInstance.getResult()
      const winnerId = await electionInstance.getWinners()
      expect(winnerId[0]).to.equal(1) // Candidate 2 is the winner
    })

    it('Should calculate results for Ranked voting algorithm', async function () {
      const { electionFactory, voter1, voter2, voter3 } = await loadFixture(
        deployElectionFactoryFixture
      )

      const electionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 60,
        endTime: Math.floor(Date.now() / 1000) + 3600,
        name: 'Test Election',
        description: 'This is a test election',
      }
      const initialCandidates = [
        { candidateID: 1, name: 'candidate1', description: 'candidate1' },
        { candidateID: 2, name: 'candidate2', description: 'candidate2s' },
      ]
      const ballotType = 2 // Ranked
      const resultType = 2 // Ranked

      await electionFactory.createElection(
        electionInfo,
        initialCandidates,
        ballotType,
        resultType
      )

      const openElections = await electionFactory.getOpenElections()
      const Election = await ethers.getContractFactory('Election')
      const electionInstance = Election.attach(openElections[0])

      await electionInstance.addCandidate('Candidate 1', 'Description Test')
      await electionInstance.addCandidate('Candidate 2', 'Description Test')
      await electionInstance.addCandidate('Candidate 3', 'Description Test')

      await time.increase(120) // Move time forward to make the election active

      await electionInstance.connect(voter1).userVote([3, 4, 2, 1, 0])
      await electionInstance.connect(voter2).userVote([4, 1, 2, 3, 0])
      await electionInstance.connect(voter3).userVote([4, 3, 2, 1, 0])

      await time.increase(3600) // Move time forward to end the election

      await electionInstance.getResult()
      const winner = await electionInstance.getWinners()

      expect(winner[0]).to.equal(4) // Candidate B is the winner
    })

    it('Should calculate results for IRV voting algorithm', async function () {
      const { electionFactory, voter1, voter2, voter3 } = await loadFixture(
        deployElectionFactoryFixture
      )

      const electionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 60,
        endTime: Math.floor(Date.now() / 1000) + 3600,
        name: 'Test Election',
        description: 'This is a test election',
      }
      const initialCandidates = [
        { candidateID: 1, name: 'candidate1', description: 'candidate1' },
        { candidateID: 2, name: 'candidate2', description: 'candidate2s' },
      ]

      const ballotType = 3 // IRV
      const resultType = 3 // IRV

      await electionFactory.createElection(
        electionInfo,
        initialCandidates,
        ballotType,
        resultType
      )

      const openElections = await electionFactory.getOpenElections()
      const Election = await ethers.getContractFactory('Election')
      const electionInstance = Election.attach(openElections[0])

      await electionInstance.addCandidate('Candidate 1', 'Description Test')
      await electionInstance.addCandidate('Candidate 2', 'Description Test')
      await electionInstance.addCandidate('Candidate 3', 'Description Test')

      await time.increase(120) // Move time forward to make the election active

      await electionInstance.connect(voter1).userVote([1, 2, 0, 3, 4])
      await electionInstance.connect(voter2).userVote([1, 2, 4, 0, 3])
      await electionInstance.connect(voter3).userVote([2, 3, 1, 4, 0])

      await time.increase(3600) // Move time forward to end the election

      await electionInstance.getResult()
      const winner = await electionInstance.getWinners()

      expect(winner[0]).to.equal(1) // Candidate B is the winner
    })
  })
})
