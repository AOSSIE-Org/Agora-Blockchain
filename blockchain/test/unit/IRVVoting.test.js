const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers')
const {
  deployElectionFactoryFixture,
} = require('../fixtures/ElectionFactoryFixture')
const { expect } = require('chai')

describe('IRV Voting Algorithm Tests', function () {
  it('Test 1', async function () {
    const { electionFactory, voter1, voter2, voter3, voter4, voter5 } =
      await loadFixture(deployElectionFactoryFixture)

    const electionInfo = {
      startTime: Math.floor(Date.now() / 1000) + 60,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      name: 'IRV Election',
      description: 'This is an IRV test election',
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

    await electionInstance.connect(voter1).userVote([0, 1, 2, 3, 4]) // Rank: A > B > C
    await electionInstance.connect(voter2).userVote([1, 2, 0, 3, 4]) // Rank: B > C > A
    await electionInstance.connect(voter3).userVote([2, 0, 1, 3, 4]) // Rank: C > A > B
    await electionInstance.connect(voter4).userVote([0, 2, 1, 3, 4]) // Rank: A > C > B
    await electionInstance.connect(voter5).userVote([2, 1, 0, 3, 4]) // Rank: C > B > A

    await time.increase(3600) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()
    expect(winner[0]).to.equal(2) // Candidate C is the winner
  })
  it('Should handle single vote & candidate', async function () {
    const { electionFactory, voter1 } = await loadFixture(
      deployElectionFactoryFixture
    )

    const electionInfo = {
      startTime: Math.floor(Date.now() / 1000) + 60,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      name: 'Ranked Election',
      description: 'This is a ranked test election',
    }
    const ballotType = 3 // IRV
    const resultType = 3 // IRV
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

    await time.increase(120) // Move time forward to make the election active

    await electionInstance.connect(voter1).userVote([0, 1, 2]) // Rank: A

    await time.increase(3600) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()

    expect(winner[0]).to.equal(0) // Candidate C is the winner
  })
  it('Test 2 with multiple voters and candidates', async function () {
    const { electionFactory, voter1, voter2, voter3, voter4, voter5, voter6 } =
      await loadFixture(deployElectionFactoryFixture)

    const electionInfo = {
      startTime: Math.floor(Date.now() / 1000) + 60,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      name: 'IRV Election',
      description: 'This is an IRV test election',
    }
    const ballotType = 3 // IRV
    const resultType = 3 // IRV
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

    await time.increase(120) // Move time forward to make the election active

    // Multiple voters submit their votes
    // A, B, C, D, E
    // 0, 1, 2, 3, 4
    await electionInstance.connect(voter1).userVote([1, 2, 0, 3, 4]) // Voter 1's vote
    await electionInstance.connect(voter2).userVote([2, 0, 3, 1, 4]) // Voter 2's vote
    await electionInstance.connect(voter3).userVote([1, 3, 2, 0, 4]) // Voter 3's vote
    await electionInstance.connect(voter4).userVote([3, 2, 0, 4, 1]) // Voter 4's vote
    await electionInstance.connect(voter5).userVote([1, 4, 0, 2, 3]) // Voter 5's vote
    await electionInstance.connect(voter6).userVote([4, 0, 3, 1, 2]) // Voter 5's vote

    await time.increase(3600) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()
    // console.log(winner)
    expect(winner[0]).to.equal(3) // Candidate 4 is the winner
  })
})
