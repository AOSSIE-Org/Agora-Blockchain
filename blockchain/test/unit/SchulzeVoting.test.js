const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers')
const {
  deployElectionFactoryFixture,
} = require('../fixtures/ElectionFactoryFixture')
const { expect } = require('chai')

describe('Schulze Voting Algorithm Tests', function () {
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
    const ballotType = 4 // IRV
    const resultType = 4 // IRV
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

    await time.increase(120) // Move time forward to make the election active

    await electionInstance.connect(voter1).userVote([0, 1]) // Rank: A

    await time.increase(3600) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()

    expect(winner[0]).to.equal(0) // Candidate C is the winner
  })
  it('Test with three voters and three candidates', async function () {
    const { electionFactory, voter1, voter2, voter3 } = await loadFixture(
      deployElectionFactoryFixture
    )

    const electionInfo = {
      startTime: Math.floor(Date.now() / 1000) + 60,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      name: 'Schulze Election',
      description: 'This is a Schulze test election',
    }
    const ballotType = 4 // Schulze
    const resultType = 4 // Schulze
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

    await ethers.provider.send('evm_increaseTime', [120]) // Move time forward to make the election active

    // Voters submit their votes in preference ranking: [B, C, A] -> [1, 2, 0]
    await electionInstance.connect(voter1).userVote([1, 2, 0]) // Voter 1
    await electionInstance.connect(voter2).userVote([1, 0, 2]) // Voter 2
    await electionInstance.connect(voter3).userVote([2, 1, 0]) // Voter 3

    await ethers.provider.send('evm_increaseTime', [3600]) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()

    expect(winner[0]).to.equal(1)
  })

  it('Test with five voters and four candidates', async function () {
    const { electionFactory, voter1, voter2, voter3, voter4, voter5 } =
      await loadFixture(deployElectionFactoryFixture)

    const electionInfo = {
      startTime: Math.floor(Date.now() / 1000) + 60,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      name: 'Schulze Election',
      description: 'This is a Schulze test election',
    }
    const ballotType = 4 // Schulze
    const resultType = 4 // Schulze
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

    await ethers.provider.send('evm_increaseTime', [120]) // Move time forward to make the election active

    // Adjusting votes to prefer Candidate 3 (index 2) more
    await electionInstance.connect(voter1).userVote([2, 1, 3, 0]) // Voter 1 prefers Candidate 3
    await electionInstance.connect(voter2).userVote([0, 2, 3, 1]) // Voter 2 prefers Candidate 3
    await electionInstance.connect(voter3).userVote([1, 3, 2, 0]) // Voter 3 prefers Candidate 3
    await electionInstance.connect(voter4).userVote([0, 3, 2, 1]) // Voter 4 prefers Candidate 3
    await electionInstance.connect(voter5).userVote([2, 0, 3, 1]) // Voter 5 prefers Candidate 3

    await ethers.provider.send('evm_increaseTime', [3600]) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()

    expect(winner[0]).to.equal(2) // Candidate 3 (index 2) should be the winner
  })
  it('Test for multiple winners', async function () {
    const { electionFactory, voter1, voter2, voter3 } = await loadFixture(
      deployElectionFactoryFixture
    )

    const electionInfo = {
      startTime: Math.floor(Date.now() / 1000) + 60,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      name: 'Schulze Election',
      description: 'This is a Schulze test election',
    }
    const ballotType = 4 // Schulze
    const resultType = 4 // Schulze
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

    await ethers.provider.send('evm_increaseTime', [120]) // Move time forward to make the election active

    // Voters submit their votes in preference ranking: [B, C, A] -> [1, 2, 0]
    await electionInstance.connect(voter1).userVote([1, 2, 0]) // Voter 1
    await electionInstance.connect(voter2).userVote([2, 0, 1]) // Voter 2
    await electionInstance.connect(voter3).userVote([0, 1, 2]) // Voter 3

    await ethers.provider.send('evm_increaseTime', [3600]) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()

    expect(winner).deep.to.equal([0, 1, 2])
  })
})
