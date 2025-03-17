const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers')
const {
  deployElectionFactoryFixture,
} = require('../fixtures/ElectionFactoryFixture')
const { expect } = require('chai')

describe("Moore's Voting Algorithm Tests", function () {
  it('Election with 3 candidates', async function () {
    const { electionFactory, voter1, voter2, voter3, voter4, voter5 } =
      await loadFixture(deployElectionFactoryFixture)

    const electionInfo = {
      startTime: Math.floor(Date.now() / 1000) + 60,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      name: 'Tie Election',
      description: 'This is a tie test election',
    }
    const ballotType = 8 // Moore
    const resultType = 8 // Moore
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

    const openElections = await electionFactory.getOpenElections()
    const Election = await ethers.getContractFactory('Election')
    const electionInstance = Election.attach(openElections[0])

    await electionInstance.addCandidate('Candidate 1', 'Description Test')
    await electionInstance.addCandidate('Candidate 2', 'Description Test')
    await electionInstance.addCandidate('Candidate 3', 'Description Test')

    await time.increase(120) // Move time forward to make the election active

    await electionInstance.connect(voter1).userVote([0]) // Vote for Candidate 1
    await electionInstance.connect(voter2).userVote([1]) // Vote for Candidate 2
    await electionInstance.connect(voter3).userVote([0]) // Vote for Candidate 1
    await electionInstance.connect(voter4).userVote([2]) // Vote for Candidate 3
    await electionInstance.connect(voter5).userVote([0]) // Vote for Candidate 3

    await time.increase(3600) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()
    // console.log('Winner', winner)
    expect(winner[0]).to.equal(0) // Candidate 1 is the winner due to more votes
  })
  it('Should handle a two-way tie in General voting algorithm', async function () {
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

    await electionInstance.addCandidate('Candidate 3', 'Description Test')

    await time.increase(120) // Move time forward to make the election active

    await electionInstance.connect(voter1).userVote([0]) // Vote for Candidate 1
    await electionInstance.connect(voter2).userVote([1]) // Vote for Candidate 2
    await electionInstance.connect(voter3).userVote([1]) // Vote for Candidate 2
    await electionInstance.connect(voter4).userVote([0]) // Vote for Candidate 1
    await electionInstance.connect(voter5).userVote([2]) // Vote for Candidate 3
    await time.increase(3600) // Move time forward to end the election
    await electionInstance.getResult()
    const winnerIds = await electionInstance.getWinners()
    expect(winnerIds).to.deep.equal([0, 1]) // Candidate 1 and Candidate 2 are winners due to tie
  })
})
