const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers')
const {
  deployElectionFactoryFixture,
} = require('../fixtures/ElectionFactoryFixture')
const { expect } = require('chai')

describe('Score Voting Algorithm Tests', function () {
  it('Test 1 with multiple voters and candidates', async function () {
    const { electionFactory, voter1, voter2, voter3, voter4, voter5, voter6 } =
      await loadFixture(deployElectionFactoryFixture)

    const electionInfo = {
      startTime: Math.floor(Date.now() / 1000) + 60,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      name: 'Score Election',
      description: 'This is a Score test election',
    }
    const ballotType = 6 // Score
    const resultType = 6 // Score
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
    // Each voter gives a score out of 10 to each candidate
    await electionInstance.connect(voter1).userVote([8, 7, 5, 6, 10]) // Voter 1's vote
    await electionInstance.connect(voter2).userVote([9, 8, 6, 7, 5]) // Voter 2's vote
    await electionInstance.connect(voter3).userVote([6, 10, 8, 5, 7]) // Voter 3's vote
    await electionInstance.connect(voter4).userVote([7, 5, 9, 8, 6]) // Voter 4's vote
    await electionInstance.connect(voter5).userVote([10, 6, 7, 9, 8]) // Voter 5's vote
    await electionInstance.connect(voter6).userVote([5, 9, 10, 6, 8]) // Voter 6's vote

    await ethers.provider.send('evm_increaseTime', [3600]) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()

    // The expected winner index would be the candidate with the highest total scores
    expect(winner[0]).to.equal(0)
  })

  it('Test 2 with different scores and multiple candidates', async function () {
    const { electionFactory, voter1, voter2, voter3, voter4, voter5, voter6 } =
      await loadFixture(deployElectionFactoryFixture)

    const electionInfo = {
      startTime: Math.floor(Date.now() / 1000) + 60,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      name: 'Score Election',
      description: 'This is another Score test election',
    }
    const ballotType = 6 // Score
    const resultType = 6 // Score
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
    // Each voter gives a score out of 10 to each candidate
    await electionInstance.connect(voter1).userVote([6, 9, 5, 8, 7]) // Voter 1's vote
    await electionInstance.connect(voter2).userVote([7, 8, 6, 10, 5]) // Voter 2's vote
    await electionInstance.connect(voter3).userVote([8, 5, 9, 6, 7]) // Voter 3's vote
    await electionInstance.connect(voter4).userVote([10, 7, 10, 9, 6]) // Voter 4's vote
    await electionInstance.connect(voter5).userVote([10, 6, 8, 7, 9]) // Voter 5's vote
    await electionInstance.connect(voter6).userVote([9, 10, 7, 5, 8]) // Voter 6's vote

    await ethers.provider.send('evm_increaseTime', [3600]) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()

    // The expected winner index would be the candidate with the highest total scores
    expect(winner[0]).to.equal(0)
  })

  it('Test 3 for multiple winners', async function () {
    const { electionFactory, voter1, voter2, voter3, voter4, voter5, voter6 } =
      await loadFixture(deployElectionFactoryFixture)

    const electionInfo = {
      startTime: Math.floor(Date.now() / 1000) + 60,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      name: 'Score Election',
      description: 'This is another Score test election',
    }
    const ballotType = 6 // Score
    const resultType = 6 // Score
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
    // Each voter gives a score out of 10 to each candidate
    await electionInstance.connect(voter1).userVote([6, 9, 5, 8, 7]) // Voter 1's vote
    await electionInstance.connect(voter2).userVote([7, 8, 6, 10, 5]) // Voter 2's vote
    await electionInstance.connect(voter3).userVote([8, 3, 9, 6, 7]) // Voter 3's vote
    await electionInstance.connect(voter4).userVote([10, 7, 10, 9, 6]) // Voter 4's vote
    await electionInstance.connect(voter5).userVote([5, 6, 8, 7, 9]) // Voter 5's vote
    await electionInstance.connect(voter6).userVote([9, 10, 7, 5, 8]) // Voter 6's vote

    await ethers.provider.send('evm_increaseTime', [3600]) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()

    // The expected winner index would be the candidate with the highest total scores
    expect(winner).deep.to.equal([0, 2, 3])
  })
})
