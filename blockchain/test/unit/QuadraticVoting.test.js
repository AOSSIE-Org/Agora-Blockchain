const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers')
const {
  deployElectionFactoryFixture,
} = require('../fixtures/ElectionFactoryFixture')
const { expect } = require('chai')

describe('Quadratic Voting Algorithm Tests', function () {
  it('Should handle double vote & candidate', async function () {
    const { electionFactory, voter1 } = await loadFixture(
      deployElectionFactoryFixture
    )

    const electionInfo = {
      startTime: Math.floor(Date.now() / 1000) + 60,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      name: 'Ranked Election',
      description: 'This is a ranked test election',
    }
    const initialCandidates = [
      { candidateID: 1, name: 'candidate1', description: 'candidate1' },
      { candidateID: 2, name: 'candidate2', description: 'candidate2s' },
    ]
    const ballotType = 5 // Quadratic
    const resultType = 5 // Quadratic

    await electionFactory.createElection(
      electionInfo,
      initialCandidates,
      ballotType,
      resultType
    )

    const openElections = await electionFactory.getOpenElections()
    const Election = await ethers.getContractFactory('Election')
    const electionInstance = Election.attach(openElections[0])

    await time.increase(120) // Move time forward to make the election active

    await electionInstance.connect(voter1).userVote([75, 25]) // Rank: A

    await time.increase(3600) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()

    expect(winner[0]).to.equal(0) // Candidate C is the winner
  })
  it('Test with multiple voters and candidates', async function () {
    const { electionFactory, voter1, voter2, voter3, voter4, voter5, voter6 } =
      await loadFixture(deployElectionFactoryFixture)

    const electionInfo = {
      startTime: Math.floor(Date.now() / 1000) + 60,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      name: 'Quadratic Election',
      description: 'This is a Quadratic test election',
    }
    const ballotType = 5 // Quadratic
    const resultType = 5 // Quadratic
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

    await electionInstance.addCandidate('Candidate 3', 'Description Test')
    await electionInstance.addCandidate('Candidate 4', 'Description Test')
    await electionInstance.addCandidate('Candidate 5', 'Description Test')

    await ethers.provider.send('evm_increaseTime', [120]) // Move time forward to make the election active

    // Multiple voters submit their votes
    // A, B, C, D, E
    // 0, 1, 2, 3, 4
    // Each voter has 100 credits to distribute, in quadratic voting
    await electionInstance.connect(voter1).userVote([0, 25, 0, 25, 50]) // Voter 1's vote
    await electionInstance.connect(voter2).userVote([0, 50, 0, 50, 0]) // Voter 2's vote
    await electionInstance.connect(voter3).userVote([25, 0, 25, 0, 50]) // Voter 3's vote
    await electionInstance.connect(voter4).userVote([50, 25, 0, 25, 0]) // Voter 4's vote
    await electionInstance.connect(voter5).userVote([25, 25, 25, 25, 0]) // Voter 5's vote
    await electionInstance.connect(voter6).userVote([0, 0, 50, 25, 25]) // Voter 6's vote

    await ethers.provider.send('evm_increaseTime', [3600]) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()

    // The expected winner index would be the candidate with the highest total votes
    expect(winner[0]).to.equal(3)
  })
  it('Test with multiple voters and candidates', async function () {
    const { electionFactory, voter1, voter2, voter3, voter4, voter5, voter6 } =
      await loadFixture(deployElectionFactoryFixture)

    const electionInfo = {
      startTime: Math.floor(Date.now() / 1000) + 60,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      name: 'Quadratic Election',
      description: 'This is a Quadratic test election',
    }
    const ballotType = 5 // Quadratic
    const resultType = 5 // Quadratic
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

    await electionInstance.addCandidate('Candidate 3', 'Description Test')
    await electionInstance.addCandidate('Candidate 4', 'Description Test')
    await electionInstance.addCandidate('Candidate 5', 'Description Test')

    await ethers.provider.send('evm_increaseTime', [120]) // Move time forward to make the election active

    // Multiple voters submit their votes
    // A, B, C, D, E
    // 0, 1, 2, 3, 4
    // Each voter has 100 credits to distribute, in quadratic voting
    await electionInstance.connect(voter1).userVote([0, 25, 25, 0, 50]) // Voter 1's vote
    await electionInstance.connect(voter2).userVote([0, 50, 0, 50, 0]) // Voter 2's vote
    await electionInstance.connect(voter3).userVote([25, 0, 25, 0, 50]) // Voter 3's vote
    await electionInstance.connect(voter4).userVote([50, 25, 0, 25, 0]) // Voter 4's vote
    await electionInstance.connect(voter5).userVote([25, 25, 25, 25, 0]) // Voter 5's vote
    await electionInstance.connect(voter6).userVote([0, 0, 50, 25, 25]) // Voter 6's vote

    await ethers.provider.send('evm_increaseTime', [3600]) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()

    // The expected winner index would be the candidate with the highest total votes
    expect(winner).deep.to.equal([1, 2, 3, 4])
  })
})
